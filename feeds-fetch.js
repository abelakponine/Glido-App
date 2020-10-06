var express = require("express");
var Router = express.Router();
var db = require("./dbConnection");
var feeds = [];

Router.get("/:id", (req,res)=>{
    db.query(`SELECT * FROM users U, profile P, posts S WHERE U.id = ${req.params['id']}
        AND P.Owner = U.id AND S.author = P.Owner ORDER BY S.last_updated DESC`, (err, rows, fields)=>{
        feeds = rows;
        myID = req.params['id'];
        res.render("feeds", {feeds, myID});
    });
});

module.exports = Router;