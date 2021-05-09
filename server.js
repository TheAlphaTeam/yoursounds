
require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const server = express();

const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
// const client = new pg.Client(process.env.DATABASE_URL);
const methodOverride = require('method-override');
const fetch = require('node-fetch');
server.use(cors());
server.set('view engine', 'ejs');
server.use(express.urlencoded({ extended: true }));
server.use(express.static('./public'));
server.use(methodOverride('_method'));

server.get('/', homePage);
server.post('/singUp', singUp);
server.post('/login', Login);
server.get('/TEST', TEST);
server.get('/aboutus', aboutus);




function homePage(req, res, next) {
  let url = `https://api.deezer.com/chart`;
  superagent.get(url)
    .then(response => {
      let result = response.body;
      res.render('pages/Home', { data: result.tracks.data });
    })
    .catch(()=> { throw Error('Cannot get data from the API');});
}




function aboutus(req,res){
  res.render('aboutus');
}



function singUp(req, res, next) {
  let { name, email, password } = req.body;

  // checking user existing
  let SQL = `Select * from persons where email=$1`;
  let safeValues = [email];
  client.query(SQL, safeValues)
    .then(result => {
      console.log(req.body);
      if (result.rows.length === 0) {
        //insert new user
        let SQL2 = `INSERT INTO persons (name, email, password) VALUES ($1,$2,$3) RETURNING *;`;
        let safeValues2 = [name, email, password];
        client.query(SQL2, safeValues2)
          .then(result => {
            res.send(JSON.stringify({Welcom:result.rows[0].name,id:result.rows[0].id}));
          });
        //end of inserting new user
      }
      else
        res.send(`This user is aleady signed up!`);
    }); // end of checking user existing

}


function Login(req, res, next) {

  let { email, password } = req.body;
  let SQL = `Select * from persons where email=$1 And password=$2`;
  let safeValues = [email,password];
  client.query(SQL, safeValues)
    .then(result => {
      console.log(result.rows);
      if (result.rows.length !== 0) {
        res.send(JSON.stringify({Welcom:result.rows[0].name,id:result.rows[0].id}));
      }
      else
        res.send(`Password or Unsername not correct!`);
    });
}


function TEST(req, res, next) {
  res.render('pages/Test');
}
//////////////////////////////////search page//////////////////////////////////////////////////////////////////

// API Routes
server.get('/search',(req,res)=>{
  res.render('pages/search');
});
server.post('/search',showFormHandler);
/////////////////////////////////////search page///////////////////////////////////////////////////////////////
//funcrion for take data from Api and send it to show page
function showFormHandler(req,res) {
  let term =req.body.songs;
  if (req.body.name === 'artist') {
    let url = `https://api.deezer.com/search?q=${term}`;
    superagent.get(url).
      then((apiData=>{
        let artistData= apiData.body.data;
        let dataConstructors= artistData.map((item=>{
          return new Artist (item);
        }));
        res.render('pages/showartist' , {songs:dataConstructors});
      }));//Artist page
  }else if(req.body.name === 'song'){
    fetch(`https://itunes.apple.com/search?attribute=songTerm&entity=song&term=${term}`)
      .then(res => res.json())
      .then((apiData=>{
        let songData= apiData.results;
        let dataConstructors= songData.map((item=>{
          return new Songs (item);
        }));
        res.render('pages/showsong' , {songs:dataConstructors});
      }));//song page
  }
}

//Constructors for Artist Data
function Artist (artistData){
  this.preview=artistData.preview;
  this.name=artistData.artist.name;
  this.image=artistData.album.cover_medium;
  this.title=artistData.title;
}



//------------------niveen Event page (fuction with construct)--------------------//
//Routes
// request url (browser): localhost:3000/events----/show
server.get('/events',(req,res)=>{
  res.render('pages/events');
});
server.post('/show', eventHandler);


//----------------------function eventHandler------------------------//
let event_img;
function eventHandler(req,res){
  let ArtistName = req.body.search;
  let URL = `https://rest.bandsintown.com/artists/${ArtistName}/events?app_id=000&date=upcoming`;
  superagent.get(URL)
    .then(eventData => {
      let x=eventData.body[0];
      event_img=x.artist.thumb_url;
      let eventArr = eventData.body.map(item => new Events(item));
      res.render('pages/showevent', { EventArray: eventArr });
    })
    .catch (error=>{
      console.log(error);
      res.send(error);
    });
}

//----------------------------construct function--------------------//

function Events(Data){
  this.img=event_img;
  this.name=Data.lineup;
  this.title=Data.venue.name;
  this.offer=Data.offers[0].status;
  this.time=Data.datetime;
  this.description=Data.description;
  this.type = (Data.venue.type)?`will be ${Data.venue.type }event`: ` location : ${Data.venue.city} - ${Data.venue.country}`;

}




//Constructors for Songs Data
function Songs (songData){
  this.preview=songData.previewUrl;
  this.name=songData.artistName;
  this.image=songData.artworkUrl100;
  this.title=songData.trackName;
}
/////////////////////////////////////////////////end search page////////////////////////////////////////////////////


client.connect()
  .then(() => {
    server.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
  });
