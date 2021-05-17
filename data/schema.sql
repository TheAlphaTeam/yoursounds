DROP TABLE IF EXISTS usersongs; 
DROP TABLE IF EXISTS userevents; 
DROP TABLE IF EXISTS persons;

 CREATE TABLE persons (
  id SERIAL PRIMARY KEY,
   username VARCHAR(255),
   fullname VARCHAR(255),
   bio VARCHAR(255),
   email VARCHAR(255),
   password VARCHAR(255),
   profile_image VARCHAR(255), 
   UNIQUE(username)
 );


  CREATE TABLE usersongs (
     id SERIAL PRIMARY KEY,
  username_songs VARCHAR(255),
  artistname VARCHAR(255),
  songtitle VARCHAR(255), 
  image_url VARCHAR(255),
  cover_preview VARCHAR(255),
  CONSTRAINT fk_person
      FOREIGN KEY(username_songs) 
    REFERENCES persons(username)
 );
  CREATE TABLE userevents (
     id SERIAL PRIMARY KEY,
  username_event VARCHAR(255),
  event_image VARCHAR(255),
  artist_name VARCHAR(255),
  event_title VARCHAR(255),
  event_time VARCHAR(255), 
  location VARCHAR(255),
  offer VARCHAR(255),
  description varchar(5000),
  type VARCHAR(255),
   CONSTRAINT fk_person
      FOREIGN KEY(username_event) 
    REFERENCES persons(username)
 );