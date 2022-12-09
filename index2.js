const express = require('express');
const csv = require('csv-parser');
const kfs = require("key-file-storage")('storage');
const sanitizeHtml = require('sanitize-html');
const fs = require('fs');

// Arrays to store parsed CSV data
const genres = [];
const albums = [];
const artists = [];
const tracks = [];

// Functions to parse CSV data
fs.createReadStream(__dirname + '/lab4-data/genres.csv')
  .pipe(csv({}))
  .on('data', (data) => genres.push(data))
  .on('end', () => {
  });

fs.createReadStream(__dirname + '/lab4-data/raw_albums.csv')
  .pipe(csv({}))
  .on('data', (data) => albums.push(data))
  .on('end', () => {
  });

fs.createReadStream(__dirname + '/lab4-data/raw_artists.csv')
  .pipe(csv({}))
  .on('data', (data) => artists.push(data))
  .on('end', () => {
  });

fs.createReadStream(__dirname + '/lab4-data/raw_tracks.csv')
  .pipe(csv({}))
  .on('data', (data) => tracks.push(data))
  .on('end', () => {
  });

// Localhost port definer: 3000 for our express route
const app = express();
const port = 3000;
const openRouter = express.Router();
const secureRouter = express.Router();
const adminRouter = express.Router();

// Parse data in body as JSON
openRouter.use(express.json());
secureRouter.use(express.json());
adminRouter.use(express.json())

app.use('/api/open', openRouter);
app.use('/api/secure', secureRouter);
app.use('/api/admin', adminRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});
