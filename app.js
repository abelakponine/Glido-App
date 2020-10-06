var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var fs = require("fs");
var path = require("path");
var db = require("./dbConnection");
var formidable = require("formidable");
var feeds = require("./feeds-fetch");
var comment = require("./comment-fetch");
var createdb = require("./database-tables");
var myData = [];
var myFriends = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine", "ejs");

// fetch timeline feeds
app.use("/app/feeds", feeds);
// fetch post comments
app.use("/app/post", comment);
// create database tables
app.use("/app/createdb", createdb);

app.get("/", (req, res)=>{
    res.render("index");
});

app.post("/signup", (req, res)=>{
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let dob = req.body.dob;
    let gender = req.body.gender;
    let email = req.body.email;
    let telephone = req.body.telephone;
    let location = req.body.location;
    let username = req.body.username;
    let password = req.body.password;

    db.query(`INSERT INTO users (firstname, lastname, dob, gender, email, telephone, location, username, password) 
        VALUES ('${firstname}', '${lastname}', '${dob}','${gender}','${email}', '${telephone}', '${location}',
            '${username}', '${password}')`, (err, rows, fields)=>{
        if (!err){
            res.send(true);
        }
        else {
            res.send(err);
        }
    });
    db.query(`INSERT INTO profile (Owner) 
        VALUES ((SELECT ID FROM users WHERE username = '${username}'))`, (err, rows, fields)=>{
        if (!err){
            res.end(true);
        }
        else {
            res.end(err);
        }
    });
});

app.post("/login", function(req, res){
    let username = req.body.username;
    let password = req.body.password;
    db.query(`SELECT * FROM users U, profile P WHERE
            username = '${username}' AND password = '${password}' AND U.ID = P.Owner OR
            email = '${username}' AND password = '${password}' AND U.ID = P.Owner`, (err, rows, fields)=>{
            if (!err){
                if (rows.length > 0){
                    delete rows[0]['password'];
                    myData = rows[0];
                    res.send({status: true, result: rows});
                }
                else {
                    res.send({status: false});
                }
            }
            else {
                res.send(err);
            }
    });
});

app.get("/logout", (req, res)=>{
    myData = [];
    res.send({logout:true});
});

app.get("/app", (req, res)=>{
    if (myData.username !== undefined){
        res.render("app", {myData});
    }
    else {
        res.redirect("/");
    }
});

app.post("/uploader", (req, res)=>{
    let form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        fs.mkdirSync(`public/files/${myData.ID}`, {recursive: true}, (err)=>{
            if (!err){
                console.log("Directory created successfully.");
            }
            else {
                console.log(err);
            }
        });

        let filename = '', fileType = '';

        if ('media' in files){
            let date = new Date();
            filename = date.toJSON().split(':').join('.')+'-'+files.media.name;
            fileType = files.media.type;

            fs.copyFile(files.media.path, `public/files/${fields.author}/${filename}`, (err)=>{
                if (!err){
                    console.log("File uploaded successfully.");
                }
                else {
                    console.log(err);
                }
            });
        }
        if ('author' in fields) {
            let author = fields.author;
            let content = fields.content;
            if (content !== '' || filename !== ''){
                db.query(`INSERT INTO posts (author, content, media, media_type)
                    VALUES ('${author}','${content}', '${filename}','${fileType}')`, (err, rows, fields)=>{
                    if (!err){
                        res.send(true);
                        res.end();
                    }
                    else {
                        res.end(err);
                    }
                });
            }
            else {
                console.log("empty post sent");
            }
        }
    });
});

app.post("/save-comment", (req, res)=>{
    let form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        console.log(fields);
        db.query(`INSERT INTO comments (postid, commenter, content, media)
            VALUES ('${fields.postid}','${fields.commenter}','${fields.content}','${fields.media}')`, (err, rows, fields)=>{
            if (!err){
                res.send(true);
                res.end();
            }
            else {
                res.end(err);
            }
        });
    });
});

app.listen(4000, (err)=>{
    console.log("Server started at 4000");
});