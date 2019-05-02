var dotenv = require("dotenv").config();
var axios = require("axios");
var Spotify = require('node-spotify-api');

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

// var search = process.argv[2];
// var term = process.argv.slice(3).join(" ");
var tempSearch = process.argv.slice(2).join(" ");

// var movieName = "";

var queryURL = "http://www.omdbapi.com/?t=" + tempSearch + "&y=&plot=short&apikey=d7cb222c";

console.log(queryURL)

axios.get(queryURL).then(function(response) {
        var responseInfo = response.data;
        console.log(responseInfo);

        var movieData = [
            "Title: " + responseInfo.Title,
            "Release Year: " + responseInfo.Year,
            "IMDB Rating: " + responseInfo.imdbRating,
            "Rotten Tomatoes Rating: " + responseInfo.Ratings[1].Value,
            "Country Produced: " + responseInfo.Country,
            "Language: " + responseInfo.Language,
            "Plot: " + responseInfo.Plot,
            "Actors: " + responseInfo.Actors
        ].join("\n\n")
        console.log(movieData)
    }


);