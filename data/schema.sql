DROP TABLE IF EXISTS persons;
DROP TABLE IF EXISTS usersdata; 


 CREATE TABLE persons (
   id SERIAL PRIMARY KEY,
   username VARCHAR(255),
   fullname VARCHAR(255),
   bio VARCHAR(255),
   email VARCHAR(255),
   password VARCHAR(255),
   profile_image VARCHAR(255) 
 );

  CREATE TABLE usersdata (
  username VARCHAR(255),
  artistname VARCHAR(255),
  songtitle VARCHAR(255), 
  image_url VARCHAR(255),
  cover_preview VARCHAR(255),
  event_title VARCHAR(255),
  event_time VARCHAR(255), 
  location VARCHAR(255),
  offer VARCHAR(255),
  description VARCHAR(255),
  type VARCHAR(255)
 );
