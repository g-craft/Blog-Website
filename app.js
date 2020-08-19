//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");

const app = express();
mongoose.connect(process.env.MONGO_DB_ATLAS_LINK, {
  useNewUrlParser: true
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true}));
app.use(express.static("public"));



const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res) {
  Post.find({}, function(err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      allPosts: posts
    });
  });
});

app.get("/about", function(req, res) {
  res.render("about", {
    startingContent: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    startingContent: contactContent
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const post = new Post({
    title: req.body.newPostTitle,
    content: req.body.newPostText
  });
  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res) {

  const requestedPostId = req.params.postId;
  Post.findOne({_id: requestedPostId}, function(err, post){
    if (!err) {
      console.log("Match found!");
      res.render("post", {
        postTitle: post.title,
        postText: post.content
      });
    } else {
      console.log("Not a match!");
      res.render("post", {
        postTitle: "Error!",
        postText: "The post you are looking for does not exist. Please try again."
      });
    }
  });
});


app.listen(process.env.PORT || 3000, function() { //process.env.PORT to launch on Heroku server, 3000 to launch localy
  console.log("app is running on port 3000");
});
