var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
const exphbs = require("express-handlebars")

var router = express.Router();



var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/sportsnews";

// require("./routes/apiRoutes")(app);
// require("./routes/htmlRoutes")(app);


app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")


mongoose.connect("mongodb://localhost/sportsnews", { useNewUrlParser: true });


app.get("/scrape", function(req, res) {
  
  axios.get("http://www.espn.com").then(function(response) {
 
    var $ = cheerio.load(response.data);


    $(".contentItem__content").each(function(i, element) {
   
      var result = {};

    

      result.summary=$(this).children("a").children("div").children("div").children("p").text();

      result.title = $(this).children("a").children("div").children("div").children("h1").text();

       result.link="http://www.espn.com" + $(this).children("a").attr("href");
   
      
      db.Headline.create(result)
        .then(function(dbHeadline) {
          
          console.log(dbHeadline);
          
        })
        .catch(function(err) {
      
          console.log(err);
        });
    });

    
    res.send("Scraped!");
    
  });
});

app.get('/', function(req, res, next) {
  db.Headline.find(function(err, dbHeadline) {
    res.render('index', {headlines: dbHeadline });
});
});



app.get("/headlines", function(req, res) {
  db.Headline.find({})
  .then(function(dbHeadline) {
    res.json(dbHeadline)
  })
  .catch(function(err) {
    res.json(err)
  })
});

app.get("/headlines/:id", function(req, res) {
  db.Headline.findOne({
    _id: req.params.id})
 
  .populate("note")  
  .then(function(dbHeadline) {
    res.json(dbHeadline)
  }).catch(function(err) {
    res.json(err)
  })

  })
  

app.post("/headlines/:id", function(req, res) {
  db.Note.create(req.body)
  .then(function (dbNote) {
  return db.Headline.findOneAndUpdate({_id : req.params.id},
    {note: dbNote._id}, {new: true}
    )
    .then(function(dbHeadline) {
      res.json(dbHeadline)
    })
    .catch(function(err) {
      res.json(err);
    })
  })

});


app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

