var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");


var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();




app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));


mongoose.connect("mongodb://localhost/sportsnews", { useNewUrlParser: true });



app.get("/scrape", function(req, res) {
  
  axios.get("http://www.espn.com/nfl").then(function(response) {
 
    var $ = cheerio.load(response.data);


    $(".contentItem__content").each(function(i, element) {
   
      var result = {};

      result.title = $(this).children("a").children("div").children("div").children("h1").text(); 
   
      
      db.Article.create(result)
        .then(function(dbArticle) {
          
          console.log(dbArticle);
          
        })
        .catch(function(err) {
      
          console.log(err);
        });
    });

    
    res.send("Scrape Complete");
    
  });
});


app.get("/articles", function(req, res) {
  db.Article.find({})
  .then(function(dbArticle) {
    res.json(dbArticle)
  })
  .catch(function(err) {
    res.json(err)
  })
});

app.get("/articles/:id", function(req, res) {
  db.Article.findOne({
    _id: req.params.id})
 
  .populate("note")  
  .then(function(dbArticle) {
    res.json(dbArticle)
  }).catch(function(err) {
    res.json(err)
  })

  })
  

app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
  .then(function (dbNote) {
  return db.Article.findOneAndUpdate({_id : req.params.id},
    {note: dbNote._id}, {new: true}
    )
    .then(function(dbArticle) {
      res.json(dbArticle)
    })
    .catch(function(err) {
      res.json(err);
    })
  })

});


app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});