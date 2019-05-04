require("dotenv").config();
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");

var Spotify = require('node-spotify-api');
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

var userInput = process.argv.slice(3).join(" ")//.replace("'","\'" );

// liri commands:
// concert-this - *done*
// spotify-this-song *done for now, need to fix 'null' result
// movie-this *done for now, but does not work with "Pan's Labyrinth"
// do-what-it-says *concert-need to remove quotes from second portion of array

var command = process.argv[2]

commandSwitch()

function commandSwitch() {
switch (command) {
    case "concert-this":
        bands()
        console.log("concert-this returned all results");
        break;

    case "spotify-this-song":
        if (userInput === '') {
            userInput = 'The Sign Ace of Base';
            spotifySearch();
        } else {
            spotifySearch();
        }
        break;

    case "movie-this":
        if (userInput === '') {
            userInput = 'Mr. Nobody';
            movie();
        } else {
            movie();
        }
        break;

    case "do-what-it-says":
        doSays();
        break;

    default:
        console.log("\nChoose a valid command: \n\nconcert-this + <desired search term>\nspotify-this-song + <desired search term>\nmovie-this + <desired search term>\ndo-what-it-says (app will choose at random)\n\n");
}
}

function bands() {
    var bandQueryURL = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp"
    axios.get(bandQueryURL).then(function (response) {
        console.log(bandQueryURL)
        var response = response.data
        //console.log(response)
        response.forEach(function (event) {
            //var offer = response.map(item => item.offers);
            var eventTime = event.datetime
            var eventTimeFormatted = moment(eventTime).format("MM/DD/YYYY")
            var bandData = [
                "Venue: " + event.venue.name,
                "Venue Location: " + event.venue.city + ", " + event.venue.region + " " + event.venue.country,
                "Date of Event: " + eventTimeFormatted,
                "--------------------------------------"
            ].join("\n\n")
            console.log(bandData)
        })
    })
}

function movie() {
    console.log(userInput)
    var queryURL = "http://www.omdbapi.com/?t="+ userInput +"&y=&plot=short&apikey=d7cb222c";
    axios.get(queryURL).then(function (response) {
        console.log(queryURL)
        var responseInfo = response.data;
        //console.log(responseInfo);
        var ratingsArr = responseInfo.Ratings
        console.log(ratingsArr)
        console.log(ratingsArr.length)
        var rottenTom = ""
        if (ratingsArr.length === 1) {
            rottenTom = "Unavailable"
        } else {
            rottenTom = responseInfo.Ratings[1].Value
        }
        //console.log(rottenTom)
        var movieData = [
            "Title: " + responseInfo.Title,
            "Release Year: " + responseInfo.Year,
            "IMDB Rating: " + responseInfo.imdbRating,
            "Rotten Tomatoes Rating: " + rottenTom,
            "Country Produced: " + responseInfo.Country,
            "Language: " + responseInfo.Language,
            "Plot: " + responseInfo.Plot,
            "Actors: " + responseInfo.Actors,
            "--------------------------------------"
        ].join("\n\n")
        console.log(movieData)
    });
}

function spotifySearch() {
    spotify.search({ type: 'track', query: userInput, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var spotifyInfo = data.tracks.items[0]
        //console.log(data.tracks.items[0])
        var songPreviewConsole = "Song Preview: " + spotifyInfo.preview_url
        if (spotifyInfo.preview_url === null) {
            songPreviewConsole = "Entire Song: " + spotifyInfo.album.external_urls.spotify
        }
        var searchData = [
            "Artists: " + spotifyInfo.album.artists[0].name,
            "Song Name: " + spotifyInfo.name,
            //"Entire Song: " + spotifyInfo.album.external_urls.spotify,
            songPreviewConsole,
            "Album Name: " + spotifyInfo.album.name,
            "--------------------------------------"
        ].join('\n\n')
        console.log(searchData)
    });
}

function doSays() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        // console.log("original text: ", data);
        function splitData(){
        var dataSplit = data.split('\n') //splits each line of text into dataSplit array
        console.log(dataSplit)
        var dataSplitRand = dataSplit[Math.floor(Math.random() * dataSplit.length)]
        console.log(dataSplitRand)
        var splitRandCommInp = dataSplitRand.split(',')
        command = splitRandCommInp[0]
        //userInput = splitRandCommInp[1]
        var userInputQuoted = splitRandCommInp[1]
        //this needs to remove quotes, because concert-this "band name" does not work when reading from text file
        userInput = userInputQuoted.substring(1, userInputQuoted.length-1);
        console.log(command)
        console.log(userInput)
        }
        splitData()
        commandSwitch()
    })
}

