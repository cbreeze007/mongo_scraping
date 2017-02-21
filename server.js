/* Scraping into DB (18.2.5)
 * ========================== */


/* Students: Using the tools and techniques you learned so far,
 * you will scrape a website of your choice, then place the data
 * in a MongoDB database. Be sure to make the database and collection
 * before running this exercise.

 * Consult the assignment files from earlier in class
 * if you need a refresher on Cheerio. */


// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");


// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "hackerdb";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

//var result = [];
request("https://www.democracynow.org/", function(error, response, html) {
// console.log('hello');
  var $ = cheerio.load(html);
  var results = [];
  var result ={};

  $('a').each(function(i, element){
console.log('hello2');
    // Save the text of the element (this) in a "title" variable

      //result.title = $(this).children("a").text();
      //result.link = $(this).children("a").attr("href");
    var a = $(this);
    var title = a.text();
    var img = a.children('img').attr('src');
    var url = 'https://www.democracynow.org'+ a.attr('href');
    // var url = a.parent('a').attr("href")
    //var headline = a.headline;
    //var title = a.text();
    //var url = a.url;
      //console.log('A = ' + a )
      console.log('URL = ' + url );
      console.log('IMG = ' + img );
      console.log('title = ' + title );
    var metadata = {
      //title: title
      //position: parseInt(position)
     // title: title,
     title: title,
     url: url,
     img:img
    };

           // Save the data in the scrapedData db
       if ((img != undefined) && (url==="")) {  
        db.scrapedData.save({
          title: title,
          url: url,
          img: img
        }),


    // In the currently selected element, look at its child elements (i.e., its a-tags),
    // then save the values for any "href" attributes that the child elements may have
   // var link = $(element).children().attr("href");

    // Save these results in an object that we'll push into the result array we defined earlier
    // result.push({
    //   title: title
    // });
      results.push(metadata); 
    };
      //console.log("hello " + metadata);
  });

  // Log the result once cheerio analyzes each of its selected elements
 
});

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  //res.send("Basic Route");
  res.json(metadata);
});




app.get("/all", function(req, res){
db.scrapedData.find({url: /.2017.*/}).sort({_id: -1}, function(err, data) {
    // Log any errors if the server encounters one
    if (err) {
      return console.log(err);
    }
    // Otherwise, send the result of this query to the browser
    else {
      //res.send("Hello Sebrina");
      res.json(data);
    }
});
});
// Listen on port 3000
app.listen(3001, function() {
  console.log("App running on port 3001!");
});
