// ===================================================================
// GENERAL LIRI //////////////////////////////////////////////////////
// ===================================================================

// Liri Commands
	// * my-tweets
	// * spotify-this-song
	// * movie-this
	// * do-what-it-says
	
	// =================================================================
	// Set up node programs
	var dataKeys = require("./keys.js");
	var fs = require('fs'); //file system
	var twitter = require('twitter');
	var spotify = require('spotify');
	var request = require('request');

	

	// =================================================================	
	// Determine which liri command is being requested and run associated function.
	var pick = function(caseData, functionData) 
		{
	  switch (caseData) 
	  	{
	    case 'my-tweets':
	      getTweets();
	      break;
	    
	    case 'spotify-this-song':
	      getMeSpotify(functionData);
	      break;
	    
	    case 'movie-this':
	      getMeMovie(functionData);
	      break;
	    
	    case 'do-what-it-says':
	      doWhatItSays();
	      break;
	    
	    default:
	      console.log('LIRI doesn\'t know that');
	  	}
    };
    
  // =================================================================
	// On file load, Lets do this!!! (run the liriCommand function below 
	// with the arguments entered within the terminal)	
	var leroyJenkins = function(argOne, argTwo) 
    {
    pick(argOne, argTwo);
  };

leroyJenkins(process.argv[2], process.argv[3]);


	// =================================================================	
	// Function to update log of liri commands entered 
	var writeToLog = function(data) 
		{
	  fs.appendFile("log.txt", '\r\n\r\n');

	  fs.appendFile("log.txt", JSON.stringify(data), function(err) 
	  	{
	    if (err) 
	    	{return console.log(err);}
	
	    console.log(" Updated Log");
	  	});
		}
	
	// =================================================================	
	// Will perform whichever commands are in the random.txt file.
	var doWhatItSays = function() 
		{
	  fs.readFile("random.txt", "utf8", function(error, data) 
	  	{
	    
	    console.log(data);
	    
	    writeToLog(data);
	    
	    var dataArr = data.split(',')
	
	    if (dataArr.length == 2) 
	    	{liriCommand(dataArr[0], dataArr[1]);} 
	    
	    else if (dataArr.length == 1) 
	    	{liriCommand(dataArr[0]);}
	    	
	  	});
		}	
		
// ===================================================================
// TWITTER ///////////////////////////////////////////////////////////
// ===================================================================

	var getTweets = function() 
		{
	  var client = new twitter(dataKeys.twitterKeys);

	  var params = { screen_name: 'RonSwansonTwitr', count: 10 };
	

	  client.get('statuses/user_timeline', params, function(error, tweets, response) 
	  	{
	

	    if (!error) 
	    	{
	      var data = []; //empty array to hold data
	      
	      for (var i = 0; i < tweets.length; i++) 
	      	{
	        data.push(
	        	{
	          'created at: ' : tweets[i].created_at,
	          'Tweets: ' : tweets[i].text,
	        	});
	      	}
	      	
	      console.log(data);
	      
	      writeToLog(data);
	    	}
	  	});
		};
		
// ===================================================================
// SPOTIFY ///////////////////////////////////////////////////////////
// ===================================================================

	// Find artist name from spotify
	var getArtistNames = function(artist) 
		{
	  return artist.name;
		};
	
	// =================================================================
	//Find song on Spotify
	var getMeSpotify = function(songName) 
		{
	  // If the song is not found, search Sir Mix-A-Lot: Baby Got Back
	  if (songName === undefined) 
	  	{
	    songName = 'Baby Got Back';
	  	};

		// Song name search function that returns song list
	  spotify.search({ type: 'track', query: songName }, function(err, data) 
	  	{
	    if (err) 
	    	{
	      console.log('Error occurred: ' + err);
	      return;
	    	}

	    var songs = data.tracks.items;
	    
	    var data = [];
	
			// Converts song list into an array in the data variable.
	    for (var i = 0; i < songs.length; i++) 
	    	{
	      data.push(
	      	{
	        'artist(s)': songs[i].artists.map(getArtistNames),
	        'song name: ': songs[i].name,
	        'preview song: ': songs[i].preview_url,
	        'album: ': songs[i].album.name,
	      	});
	    	}

	    console.log(data);
	    writeToLog(data);
	  	});
		};
		
// ===================================================================
// OMDB //////////////////////////////////////////////////////////////
// ===================================================================

	var getMeMovie = function(movieName) 
		{
	

	  if (movieName === undefined) 
	  	{movieName = 'Mr Nobody';}
	

	  var urlHit = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&r=json";
	

	  request(urlHit, function(error, response, body) 
	  	{
	    if (!error && response.statusCode == 200) 
	    	{
	      var data = [];
	      var jsonData = JSON.parse(body);
	

	      data.push(
	      	{
		      'Title: ' : jsonData.Title,
		      'Year: ' : jsonData.Year,
		      'Rated: ' : jsonData.Rated,
		      'IMDB Rating: ' : jsonData.imdbRating,
		      'Country: ' : jsonData.Country,
		      'Language: ' : jsonData.Language,
		      'Plot: ' : jsonData.Plot,
		      'Actors: ' : jsonData.Actors,
		      'Rotten Tomatoes Rating: ' : jsonData.tomatoRating,
		      'Rotton Tomatoes URL: ' : jsonData.tomatoURL,
	  			});
	      
	      console.log(data);
	      writeToLog(data);
				}
	  	});
		}

