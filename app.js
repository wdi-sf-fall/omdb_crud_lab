var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));

app.get('/', function(req, res){
  res.render('index.ejs');
});

app.get('/search', function(req, res){

  var searchTerm = req.query.movieTitle;
  var url = "http://www.omdbapi.com/?s=" + searchTerm;

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var obj = JSON.parse(body);
      res.render("results.ejs", {movieList: obj.Search});
    }
  });
});

app.get('/details/:id', function(req, res){
  var imdbID = req.params.id;
  var url = "http://www.omdbapi.com/?i=" + imdbID;
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var obj = JSON.parse(body);
      res.render("details.ejs", {movieDetails: obj});
    }
  });
});

var watchLater = [];
app.get('/watchlater', function (req, res) {
  res.render('watchlater.ejs', {watchLater: watchLater});
});
app.post('/watchlater', function (req, res) {
  var id = req.body.id;
  var title = req.body.title;
  watchLater.push({id:id, title:title});
  res.redirect("/watchlater");
});
app.delete('/watchlater', function (req, res) {
  // remove a movie from the watchLater list
  var id = req.body.id;
  for (var i = 0; i < watchLater.length; i++) {
    if (watchLater[i].id === id) {
      watchLater.splice(i, 1);
    }
  }
  res.redirect("/watchlater");
});

app.listen(3000);
