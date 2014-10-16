var express = require("express");
var request = require("request");

var app = express();

app.use(express.static(__dirname + "/public"));

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

app.listen(3000);
