'use strict';

require('dotenv').config();
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const server = express();

const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
const methodOverride = require('method-override');
const { profile } = require('console');

server.use(cors());
server.set('view engine', 'ejs');
server.use(express.urlencoded({ extended: true }));
server.use(express.static('./public'));
server.use(methodOverride('_method'));

server.get('/', homePage);
server.post('/singUp', singUp);
server.post('/login', Login);
server.get('/TEST', TEST);
// profile page - Basel Atalla 
// server.get('/myprofile', profileHandler);
// server.post('/')


function homePage(req, res, next) {
  let url = `https://api.deezer.com/chart`;
  superagent.get(url)
    .then(response => {
      let result = response.body;
      res.render('pages/Home', { data: result.tracks.data });
    })
    .catch(()=> { throw Error('Cannot get data from the API');});
}

function singUp(req, res, next) {
  let { name, email, password } = req.body;

  // checking user existing
  let SQL = `Select * from persons where name=$1 or email=$2`;
  let safeValues = [name ,email];
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

// function updateBookHandler(req,res){
//   let {authors,title,isbn,image,description} = req.body;
//   let SQL = `UPDATE books SET authors=$1,title=$2,isbn=$3,image=$4,description=$5 WHERE id=$6;`;
//   let safeValues = [authors,title,isbn,image,description,req.params.bookID];
//   console.log(req.params.bookID);
//   client.query(SQL,safeValues)
//     .then(()=>{
//       res.redirect(`/bookDetail/${req.params.bookID}`);
//     });
// }


client.connect()
  .then(() => {
    server.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
  });
