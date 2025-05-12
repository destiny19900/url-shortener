require('dotenv').config();
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();

var urlDatabase = {}; // In-memory database for simplicity
var urlId = 1;

// Basic Configuration
var port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// API endpoint to shorten a URL
app.post('/api/shorturl', (req, res) => {
  var originalUrl = req.body.url;

  // Validate URL
  var urlRegex = /^(http|https):\/\/[^ "]+$/;
  if (!urlRegex.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // Store the URL and return the shortened version
  var shortUrl = urlId++;
  urlDatabase[shortUrl] = originalUrl;
  res.json({ original_url: originalUrl, short_url: shortUrl });
});

// API endpoint to redirect to the original URL
app.get('/api/shorturl/:shortUrl', (req, res) => {
  var shortUrl = req.params.shortUrl;
  var originalUrl = urlDatabase[shortUrl];

  if (!originalUrl) {
    return res.status(404).json({ error: 'No short URL found for the given input' });
  }

  res.redirect(originalUrl);
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
