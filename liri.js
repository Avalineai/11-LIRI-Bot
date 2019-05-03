require("dotenv").config();
var axios = require("axios");
var Spotify = require('node-spotify-api');

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

// var search = process.argv[2];
// var term = process.argv.slice(3).join(" ");

// using tempSearch to test currently
var tempSearch = process.argv.slice(3).join(" ");

// var movieName = "";

// liri commands:
// concert-this
// spotify-this-song
// movie-this *done for now, but can clean up axios function use
// do-what-it-says
var command = process.argv[2]
switch (command) {
    case "concert-this":
        console.log("concert-this");
        break;

    case "spotify-this-song":
        spotifySearch();
        console.log("spotify-this-song");
        break;

    case "movie-this": //this is working
        console.log("movie-this");
        movie();
        break;

    case "do-what-it-says":
        console.log("do-what-it-says");
        break;

    default:
        console.log("The Sign-Ace of Base");

}

// var bandQueryURL = "https://rest.bandsintown.com/artists/" + tempSearch + "/events?app_id=codingbootcamp"

// axios.get(bandQueryURL).then(function(response) {
//         var responseInfo = response.data;
//         console.log(responseInfo);
// })

function movie() {
    var queryURL = "http://www.omdbapi.com/?t=" + tempSearch + "&y=&plot=short&apikey=d7cb222c";
    console.log(queryURL)

    axios.get(queryURL).then(function (response) {
        var responseInfo = response.data;
        //console.log(responseInfo);

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
    });
}

function spotifySearch() {
    spotify.search({ type: 'track', query: tempSearch, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        //console.log(data.tracks.items);
        console.log("Artists: ", data.tracks.items[0].album.artists[0].name)
        console.log("Song Name: ", data.tracks.items[0].name)
        console.log("Song Preview: ", data.tracks.items[0].album.external_urls.spotify)
        // external_urls:
        // { spotify: 'https://open.spotify.com/track/2m1hi0nfMR9vdGC8UcrnwU' }

        console.log("Album Name: ", data.tracks.items[0].album.name)
    });
}