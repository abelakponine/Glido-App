var express = require("express");
var Router = express.Router();
var db = require("./dbConnection");

Router.get("/", (req, res)=>{
    let response = [];

    db.query(`CREATE TABLE users (id INT(10) AUTO_INCREMENT NOT NULL PRIMARY KEY, firstname varchar(20) NOT NULL,
         lastname varchar(20) NOT NULL, gender varchar(10) NOT NULL, dob DATE NOT NULL, email varchar(100) NOT NULL UNIQUE,
         location varchar(50) NOT NULL, telephone varchar(20) NOT NULL, username varchar(20) NOT NULL UNIQUE,
         password Longtext NOT NULL, date_created timestamp)`, (err, rows, fields)=>{
        
        if (!err){
            response.push("Database table `users` created successfully.");
        }
        else {
            console.log(err);
        }
    });
    db.query(`CREATE TABLE profile (pid INT(10) AUTO_INCREMENT NOT NULL PRIMARY KEY,
        owner INT(10) NOT NULL,
        avatar longtext DEFAULT 'avatar.png',
        FOREIGN KEY (Owner) REFERENCES users(ID) ON DELETE CASCADE, last_updated timestamp)`, (err, rows, fields)=>{
        
        if (!err){
            response.push("Database table `profile` created successfully.");
        }
        else {
            console.log(err);
        }
    });
    db.query(`CREATE TABLE posts (postid INT(10) AUTO_INCREMENT NOT NULL PRIMARY KEY,
        author INT(10) NOT NULL, content longtext, media longtext, media_type varchar(20),
        likes varchar(15000) DEFAULT '[]', tags longtext, mention longtext,
        FOREIGN KEY (author) REFERENCES users(ID) ON DELETE CASCADE, last_updated timestamp)`, (err, rows, fields)=>{
    
        if (!err){
            response.push("Database table `profile` created successfully.");
        }
        else {
            console.log(err);
        }
    });
    db.query(`CREATE TABLE comments (commentid INT(10) AUTO_INCREMENT NOT NULL PRIMARY KEY,
        postid INT(10) NOT NULL, commenter INT(10) NOT NULL, content longtext, media longtext,
        FOREIGN KEY (postid) REFERENCES posts(postid) ON DELETE CASCADE,
        FOREIGN KEY (commenter) REFERENCES users(ID) ON DELETE CASCADE, last_updated timestamp)`, (err, rows, fields)=>{
        
        if (!err){
            response.push("Database table `posts` created successfully.");
            res.send(response);
        }
        else {
            console.log(err);
            res.send(err);
        }
    });
});

module.exports = Router;