require("dotenv").config();
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");

var Spotify = require('node-spotify-api');
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

var userInput = process.argv.slice(3).join(" ");

// liri commands:
// concert-this - needs moment to format date to MM/DD/YYYY
// spotify-this-song *done for now, but can clean up code-also, it plays entire song instead of preview..
// movie-this *done for now, but can clean up axios function use
// do-what-it-says *need to add math random feature to do different commands..
var command = process.argv[2]
switch (command) {
    case "concert-this":
        bands()
        console.log("concert-this returned all results");
        break;

    case "spotify-this-song":
        if (userInput === '') {
            userInput = 'Ace of Base';
            spotifySearch();
        } else {
            spotifySearch();
        }
        break;

    case "movie-this": //this is working
        if (userInput === '') {
            userInput = 'Mr. Nobody';
            movie();
        } else {
            movie();
        }
        break;

    case "do-what-it-says":
        console.log("do-what-it-says");
        doSays();
        break;

    default:
        console.log("Choose a valid command");

}

function bands() {
var bandQueryURL = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp"

axios.get(bandQueryURL).then(function(response) {
    var response = response.data
    response.forEach(function(event){    
    //var offer = response.map(item => item.offers);
    var eventTime = event.datetime
    console.log("Venue: ", event.venue.name)
    console.log("Venue Location: ", event.venue.city, ", " ,event.venue.region, event.venue.country)
    console.log("Date of Event: ", event.datetime, '\n')
    console.log(eventTime)
    //console.log(moment.format(event.datetime, 'MM DD YYYY'))
    console.log(moment(eventTime, "M").format("M"))//this is incorrect
    console.log(moment(eventTime, "DD").format("DD"))//this is incorrect
    console.log(moment(eventTime, "YYYY").format("YYYY"))
    //console.log(response)
    })
})
}

function movie() {
    var queryURL = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=d7cb222c";
    //console.log(queryURL)

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
    spotify.search({ type: 'track', query: userInput, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        //console.log(data.tracks.items);
        console.log("looking for preview: ", data.tracks.items[0].album.external_urls)
        console.log("Artists: ", data.tracks.items[0].album.artists[0].name)
        console.log("Song Name: ", data.tracks.items[0].name)
        console.log("Song Preview(?): ", data.tracks.items[0].album.external_urls.spotify)
        // external_urls:
        // { spotify: 'https://open.spotify.com/track/2m1hi0nfMR9vdGC8UcrnwU' }

        console.log("Album Name: ", data.tracks.items[0].album.name)
    });
}

function doSays() {
    fs.readFile("random.txt", "utf8", function(err, data){
        if (err) {
            return console.log(err);
        } 
       // console.log("original text: ", data);
        //dataSplit = data.split(",")
        dataSplit = data.split('\n') //array of returned text with command at dataSplit[0], and searchInput at dataSplit[1]
        //console.log(dataSplit)

        dataSplit.forEach(function(item){
            itemArr = item.split(',')
            // console.log("Item Array: ", itemArr)

            command = itemArr[0]
            userInput = itemArr[1]
            console.log(command)
            console.log(userInput)
            if (command === 'spotify-this-song') {
                spotifySearch()
            } else {
                movie()
            }
        })
    })
}
