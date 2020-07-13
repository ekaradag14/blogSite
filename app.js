const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
let posts = [];
const app = express();
// mongoose.connect("mongodb://localhost:27017/blogs",{ useNewUrlParser: true ,  useUnifiedTopology: true });

const uri = "mongodb://admin-erencan:XXXXXXXX@cluster0-shard-00-00.efw9y.mongodb.net:27017,cluster0-shard-00-01.efw9y.mongodb.net:27017,cluster0-shard-00-02.efw9y.mongodb.net:27017/blogDB?ssl=true&replicaSet=atlas-ad3yxk-shard-0&authSource=admin&retryWrites=true&w=majority"
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });
const connection = mongoose.connection;
connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});
const router = express.Router();
app.use("/", router);
app.set('view engine', 'ejs');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Post title required!"]
  },
  content: {
    type: String,
    required: [true, "Post content required!"]
  }
});

const Blog = mongoose.model("Blog", blogSchema);

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));
let postArray = []
app.get("/", function(req, res) {
  res.redirect("/home");
});

app.get("/home", function(req, res) {
  posts.length = 0;
  Blog.find(function(err, blogs){
    if(err){
      console.log(err);
    } else {
      blogs.forEach(function(element){
        let post = {
          title: "",
          content: "",
        };

        post.title = element.title;
        post.content = element.content;
          posts.push(post);
  // console.log(element.title);
      });
      console.log(posts);
      res.render("home", {
        pContent: homeStartingContent,
        postArray: posts

      });
    }

  });



});
app.get("/about", function(req, res) {

  res.render("about", {
    pContent: aboutContent
  });
});
app.get("/contact", function(req, res) {

  res.render("contact", {
    pContent: contactContent
  });
});



app.get("/compose", function(req, res) {

  res.render("compose");
});

app.post("/home", function(req, res) {

  let articleName = "";
  for (var property in req.body) {
    articleName = property;
  }
  req.params = {
    title: "articleName",
  }
  res.redirect("/posts/" + articleName);
});

app.get("/posts/:title", function(req, res) {
  posts.length = 0;
  Blog.find(function(err, blogs){
    if(err){
      console.log(err);
    } else {
      blogs.forEach(function(element){
        let post = {
          title: "",
          content: "",
        };

        post.title = element.title;
        post.content = element.content;
          posts.push(post);
  // console.log(element.title);
      });

      var check = findTitle(posts, req.params.title);

      if (check) {
        console.log("Match Found");
        res.render("post", {
          postTitle: req.params.title,
          postContent: posts.find(x => x.title === req.params.title).content
        });
    }

  };


})

  function findTitle(innerPosts, innerTitle) {


    for (i = 0; i < innerPosts.length; i++) {

      if (_.snakeCase(innerPosts[i].title) === _.snakeCase(innerTitle)) {
        console.log(_.snakeCase(innerPosts[i].title));


        console.log(_.snakeCase(innerTitle));
        return true

      }
    }
    console.log("Fail");
    return false
  }

});

app.post("/compose", function(req, res) {
  let post = {
    title: "",
    content: "",
  };
  post.title = req.body.titleText
  post.content = req.body.postText

  const blog = new Blog({
    title:   post.title,
    content: post.content
  });

  blog.save();
  posts.push(post);
  setTimeout(closure, 3000);
  res.redirect("/home");
  function closure(){
    console.log(blog)
    // Burada da db ile bağlantıyı kapatıyorum
    mongoose.connection.close();
  }
})

// app.listen(3000, function() {
//
//   console.log("Server started successfuly on port 3000!");
// });

var server = app.listen(process.env.PORT || 3000, function () {
  var port = server.address().port;
  console.log("Express is working on port " + port);
});
