
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const server = express();

const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
const methodOverride = require('method-override');
const { profile, Console } = require('console');
const fetch = require('node-fetch');
const { send } = require('process');
const { ESRCH } = require('constants');

server.use(cors());
server.set('view engine', 'ejs');
server.use(express.urlencoded({ extended: true }));
server.use(express.static(__dirname + '/public'));
server.use(methodOverride('_method'));


server.get('/', homePage);
server.post('/singUp', singUp);
server.post('/login', Login);
server.get('/TEST', TEST);
// ////////////////////////profile page - Basel Atalla///////////////////////////
server.get('/myprofile/:username', profileHandler);
server.put('/updatePersonalInformation/:username', updatePersonalIfoHandler);
server.post('/addsong/:username', addSongHandler);
server.post('/addevent/:username', addeventHandler);




function profileHandler(req, res) {
  let currentUsername = req.params.username;
  let SQL = `SELECT * FROM persons  LEFT JOIN userevents
  ON persons.username = userevents.username_event
  LEFT JOIN usersongs
  ON persons.username = usersongs.username_songs where persons.username=$1;`;
  let saveValue = [currentUsername];
  client.query(SQL, saveValue)
    .then((userData) => {
      res.render('pages/myplaylist', { input: userData.rows });
    });

}

function updatePersonalIfoHandler(req, res) {
  // let currentUsername = req.params.username;
  let { username, fullname, bio, image } = req.body;
  let SQL = `UPDATE persons SET fullname=$1,bio=$2,profile_image=$3 WHERE username=$4;`;
  let safeValues = [fullname, bio, image, `${username}`];
  client.query(SQL, safeValues)
    .then(() => {
      res.redirect(`/myprofile/${req.params.username}`);
    }).catch(error => {
      console.log(error);
      res.send(error);
    });

}

function addSongHandler(req, res) {
  let { title, preview, image, name } = req.body;
  let username = req.params.username;
  let SQL = `select username_songs=$1 from usersongs where artistname=$2 and songtitle=$3 ;`;
  let safeValues = [username,name, title];
  client.query(SQL, safeValues).then(ifData => {
    if (ifData.rowCount === 0) {
      let SQL1 = `INSERT INTO usersongs ( username_songs,artistname,songtitle,image_url,cover_preview) VALUES($1,$2,$3,$4,$5) RETURNING *;`;
      let safeValues1 = [username, name, title, image, preview];
      client.query(SQL1, safeValues1);
      res.send('&#10084;');
    }else {
      let SQL2 = `DELETE FROM usersongs WHERE artistname=$1 and songtitle=$2;`;
      let safeValues2 = [name, title];
      client.query(SQL2, safeValues2);
      res.send('&#9825;');
    }
  });
}

function addeventHandler(req, res) {
  let { image, name, title, time, location,offer,description,venue } = req.body;
  let username = req.params.username; 
  let SQL = `select username_event=$1 from userevents where event_time=$2 or type=$3 ;`;
  let safeValues = [username,time,venue];
  client.query(SQL, safeValues).then(ifData => {
    if (ifData.rowCount === 0) {
      let SQL1 = `INSERT INTO userevents (username_event,event_image,artist_name,event_title,event_time,location,offer,description,type) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *;`;
      let safeValues1 = [username, image, name, title,time, location,offer,description,venue];
      client.query(SQL1, safeValues1);
      res.send('&#10084;');
    }else {
      let SQL2 = `DELETE FROM userevents WHERE event_title=$1 or event_time=$2;`;
      let safeValues2 = [title,time];
      client.query(SQL2, safeValues2);
      res.send('&#x271A;');
    }
  });
}


/////////////////////////////////////////////////////////////////////////
function homePage(req, res) {
  let url = `https://api.deezer.com/chart`;
  superagent.get(url)
    .then(response => {
      let result = response.body;
      res.render('pages/Home', { data: result.tracks.data });
    })
    .catch(() => { throw Error('Cannot get data from the API'); });
}

function singUp(req, res) {
  let { name, email, password } = req.body;
  let uname = name.replace(/\s+/g, '');
  // checking user existing
  let SQL = `Select * from persons where username=$1 or email=$2;`;
  let safeValues = [uname, email];
  client.query(SQL, safeValues)
    .then(result => {
      if (result.rows.length === 0) {
        //insert new user
        let SQL2 = `INSERT INTO persons (username, email, password) VALUES ($1,$2,$3) RETURNING *;`;
        let safeValues2 = [uname, email, password];
        client.query(SQL2, safeValues2)
          .then(result => {
            res.send(JSON.stringify({ username: result.rows[0].username, id: result.rows[0].id }));
          });
        //end of inserting new user

      }
      else
        res.send(`This user is aleady signed up!`);
    }); // end of checking user existing

}



function Login(req, res) {

  let { email, password } = req.body;
  let SQL = `Select * from persons where email=$1 And password=$2;`;
  let safeValues = [email, password];
  client.query(SQL, safeValues)
    .then(result => {
      if (result.rows.length !== 0) {
        res.send(JSON.stringify({ username: result.rows[0].username, id: result.rows[0].id }));
      }
      else
        res.send(`Password or Unsername not correct!`);
    });
}


function TEST(req, res) {
  res.render('pages/Test');
}
//////////////////////////////////search page//////////////////////////////////////////////////////////////////

// API Routes
server.get('/search/:username', searchHandler);
function searchHandler(req, res) {
  let usrename = req.params.username;
  let SQL = `Select * from persons where  username=$1;`;
  let safeValues = [usrename];
  client.query(SQL, safeValues)
    .then(result => {
      res.render('pages/search', { user: result.rows[0].username });
    });

}

server.post('/search/:username', showFormHandler);
/////////////////////////////////////search page///////////////////////////////////////////////////////////////
//funcrion for take data from Api and send it to show page
function showFormHandler(req, res) {
  let username = req.params.username;
  let term = req.body.songs;
  if (req.body.name === 'artist') {
    let url = `https://api.deezer.com/search?q=${term}`;
    superagent.get(url).
      then((apiData => {
        let artistData = apiData.body.data;
        let dataConstructors = artistData.map((item => {
          return new Artist(item);
        }));
        res.render('pages/showartist', { songs: dataConstructors, user: username });
      }));//Artist page
  } else if (req.body.name === 'song') {
    fetch(`https://itunes.apple.com/search?attribute=songTerm&entity=song&term=${term}`)
      .then(res => res.json())
      .then((apiData => {
        let songData = apiData.results;
        let dataConstructors = songData.map((item => {
          return new Songs(item);
        }));
        res.render('pages/showsong', { songs: dataConstructors, user: username });
      }));//song page
  }
}


//Constructors for Artist Data
function Artist(artistData) {
  this.id = artistData.id;
  this.preview = artistData.preview;
  this.name = artistData.artist.name;
  this.image = artistData.album.cover_medium;
  this.title = artistData.title;
}



//------------------niveen Event page (fuction with construct)--------------------//
//Routes
// request url (browser): localhost:3000/events----/show
// server.get('/events', (req, res) => {
//   res.render('pages/events');
// });
server.post('/searchforevents/:username', eventHandler);


//----------------------function eventHandler------------------------//
let event_img;
function eventHandler(req, res) {
  let username = req.params.username;
  let ArtistName = req.body.search;
  let URL = `https://rest.bandsintown.com/artists/${ArtistName}/events?app_id=000&date=upcoming`;
  superagent.get(URL)
    .then(eventData => {
      let x = eventData.body[0];
      event_img = x.artist.thumb_url;
      
      let eventArr = eventData.body.map(item => new Events(item));
      res.render('pages/showevent', { EventArray: eventArr, user: username });
    })
    .catch(error => {
      console.log(error);
      res.send(error);
    });
}

//----------------------------construct function--------------------//

function Events(Data) {
  this.img = event_img;
  this.name = Data.lineup;
  this.title = Data.venue.name;
  this.offer = ' Tickit status: '+Data.offers[0].status;
  this.time = Data.datetime.replace(/T1+/g, ' ').slice(0,15)+'pm';
  this.description = Data.description;
  this.venue = (Data.venue.type) ? `will be ${Data.venue.type}event` : ` location : ${Data.venue.city} - ${Data.venue.country}`;

}




//Constructors for Songs Data
function Songs(songData) {
  this.id=songData.trackId;
  this.preview = songData.previewUrl;
  this.name = songData.artistName;
  this.image = songData.artworkUrl100;
  this.title = songData.trackName;
}
/////////////////////////////////////////////////end search page////////////////////////////////////////////////////


client.connect()
  .then(() => {
    server.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
  });
