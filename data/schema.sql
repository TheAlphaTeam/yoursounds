DROP TABLE IF EXISTS persons;



 CREATE TABLE persons (
   id SERIAL PRIMARY KEY,
   name VARCHAR(255),
   email VARCHAR(255),
   password VARCHAR(255),
   image VARCHAR(255) 
 );