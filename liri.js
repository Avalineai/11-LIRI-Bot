var dotenv = require("dotenv").config();
var axios = require("axios");

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);