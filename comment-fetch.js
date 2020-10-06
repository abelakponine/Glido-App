var express = require("express");
var Router = express.Router();
Router.get("/:postid", (req, res)=>{
   res.render("comments"); 
});

module.exports = Router;