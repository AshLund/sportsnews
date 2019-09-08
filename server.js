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
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/sportsnews";




// require("./routes/apiRoutes")(app);
// require("./routes/htmlRoutes")(app);


app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")



mongoose.connect(MONGODB_URI);


app.post("/scrape", function(req, res) {
  
  axios.get("http://www.espn.com/nfl").then(function(response) {
 
    var $ = cheerio.load(response.data);


    $(".contentItem__content").each(function(i, element) {
   
      var result = {};

    

      var summary=$(this).children("a").children("div").children("div").children("p").text();

      var title = $(this).children("a").children("div").children("div").children("h1").text();

       var link="http://www.espn.com" + $(this).children("a").attr("href");
   
      
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
    res.render('index', {title: "Home", headlines: dbHeadline });
});
});

app.get('/articles', function(req, res, next) {
  db.Headline.find(function(err, dbHeadline) {
    res.render('articles', {title: "Articles", headlines: dbHeadline });
});
});

app.get('/saved', function(req, res) {
  db.Headline.find({})
  .populate("note")
  .then(function(dbHeadline){
    res.render('saved', {title: "Saved", headlines: dbHeadline });
  })
  .catch(function(err) {
    res.json(err);
  })
    
});


app.get("/headlines", function(req, res) {
  db.Headline.find({}).limit(20)
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
  .then(function(dbNote) {
return db.Headline.findOneAndUpdate({_id : req.params.id},
   {$push:  {note: dbNote._id}}, {new: true}
    )
    .then(function(dbHeadline) {
      res.json(dbNote)
    })
    .catch(function(err) {
      res.json(err);
    })
  })

});

app.delete("/headlines/:id", function (req,res) {
  db.Note.findOneAndDelete({_id: req.params.id})
    .then(function(dbNote){
      res.json(dbNote);
    });
  });



app.put("/headlines/:id", function(req, res) {
  db.Headline.update({ _id: req.params.id },{ saved: req.body.saved})  
  .then(function(data) {
    res.json(data);
  });
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
