const express = require('express');
const csv = require('csv-parser');
const kfs = require("key-file-storage")('storage');
const sanitizeHtml = require('sanitize-html');
const fs = require('fs');
const app = express();
const port = 3000;
const router = express.Router();

// Array will store parsed CSV data (10-14)
const genres = [];
const albums = [];
const artists = [];
const tracks = [];

// Functions to parse CSV data and make readable (16-39)
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


// Setup serving front-end code
app.use('/', express.static('static'));

// Setup middlewear to do the loggin
app.use((req, res, next) => { // for all routes
  console.log(`${req.method} request for ${req.url}`);
  next();
});

// Parse data in body as JSON
router.use(express.json());

// Route for genres to be fetched in front end
router.route('/genres')
  // Gets a list of genres with genre_id and parent_id
  .get((req, res) => {
    const genresFilter = genres.map((data) => {
      return {
        'genre_name': data.title,
        'genre_id': data.genre_id,
        'parent_id': data.parent
      }
    });
    res.send(genresFilter);
  })

// Route for artists ID to be fetched in front end
router.route('/artists/:artist_id')
  // Get artist details from artist_id
  .get((req, res) => {
    const param = sanitizeHtml(req.params.artist_id)
    const artist = artists.find(a => a.artist_id === param);
    console.log(artist.artist_name)
    if (artist) {
      let filters = ['artist_name', 'artist_image_file', 'artist_active_year_begin', 'artist_bio', 'artist_associated_labels', 'artist_website']
      const filterArtist = (obj, fil) => fil.reduce((a, c) => (a[c] = obj[c], a), {});
      res.send(filterArtist(artist, filters));
    } else {
      res.status(404).send(`Artist ${req.params.artist_id} was not found!`);
    }
  })

// Route for artists name to be fetched in front end
router.route('/findArtist/:artist_name')
  // Get artist id from artist name
  .get((req, res) => {
    const newArray = artists.map((data) => {
      return {
        'artist_id': data.artist_id,
        'artist_name': data.artist_name
      }
    });
    let limitResult = [];
    const param = sanitizeHtml(req.params.artist_name)
    for (let i = 0; i < newArray.length; i++) {
      if ((newArray[i]['artist_name']).includes(param)) {
        limitResult.push(newArray[i]['artist_id']);
      }
    }
    console.log(limitResult);
    res.send(limitResult);
  })

// Route for track ID to be fetched in front end
router.route('/tracks/:track_id')
  // Get track details from track_id
  .get((req, res) => {
    const param = sanitizeHtml(req.params.track_id)
    const track = tracks.find(t => t.track_id === param);
    if (track) {
      let filters = ['album_id', 'album_title', 'artist_id', 'artist_name', 'tags', 'track_date_created', 'track_date_recorded', 'track_duration', 'track_genres', 'track_number', 'track_title']
      const filterTrack = (obj, fil) => fil.reduce((a, c) => (a[c] = obj[c], a), {});
      res.send(filterTrack(track, filters));
    } else {
      res.status(404).send(`Track ${req.params.artist_id} was not found!`);
    }
  })

// Route for track or album to be fetched in front end
router.route('/findTrack/:search_track_or_album')
  // Get track id from track title or album title 
  .get((req, res) => {
    const newArray = tracks.map((data) => {
      return {
        'track_id': data.track_id,
        'track_title': data.track_title,
        'album_title': data.album_title
      }
    });

    console.log(newArray);

    let limitResult = [];
    let n = 10;
    const param = sanitizeHtml(req.params.search_track_or_album)
    for (let i = 0; i < newArray.length; i++) {
      if ((newArray[i]['track_title']).includes(param) && n != 0) {
        limitResult.push(newArray[i]['track_id']);
        n--;
        continue;
      }
      if ((newArray[i]['album_title']).includes(param) && n != 0) {
        limitResult.push(newArray[i]['track_id']);
        n--;
        continue;
      }
    }
    res.send(limitResult);
  })

router.route('/listen')
  .get((req, res) => {
    const x = kfs.myLists
    const lists = x;

    const newArray = lists.map((data) => {
      return {
        'list_name': data.list_name,
        'track_list_count': data.track_list_count,
        'list_duration': data.list_duration
      }
    });
    res.send(newArray);
  })

// Route for list to be fetched in front end
router.route('/lists/:list_name')
  // Get list of lists (For development)
  .get((req, res) => {
    const x = kfs.myLists
    const lists = x;
    const param = sanitizeHtml(req.params.list_name)
    const list = lists.find(l => l.list_name === param);
    if (list) {
      res.send(list.track_list);
    } else {
      res.status(404).send(`List ${req.params.list_name} doesn't exist!`);
    }
  })

  // Create a new list
  .put((req, res) => {
    const x = kfs.myLists
    const lists = x;
    const newList = req.body;
    const param = sanitizeHtml(req.params.list_name)
    newList.list_name = param
    newList.track_list = [];
    newList.list_duration = 0;
    newList.track_list_count = 0;
    if (!lists.find(l => l.list_name === param)) {
      lists.push(newList);
      kfs.myLists = lists;
      res.send(lists);
    } else {
      res.status(404).send(`List ${req.params.list_name} already exists!`);
    }
  })

  // Add/Replace track list
  .post((req, res) => {
    const trackFilter = tracks.map((data) => {
      return {
        'track_id': data.track_id,
        'track_duration': data.track_duration
      }
    });

    const param = sanitizeHtml(req.params.list_name)
    const x = kfs.myLists
    const lists = x;
    const newList = req.body;
    const list = lists.find(l => l.list_name === param);
    if (list) {
      list.track_list = req.body.track_list;
      list.track_list_count = list.track_list.length;
      list.list_duration = 0;
      for (let i = 0; i < list.track_list_count; i++) {
        let trackDur = trackFilter[list.track_list[i]].track_duration;
        console.log(trackDur)
        var durArray = trackDur.split(":");
        let durMins = (parseFloat(durArray[0], 10)) + (parseFloat(durArray[1], 10) / 60);
        list.list_duration += durMins;
      }
      list.list_duration = Math.round(list.list_duration * 1e2) / 1e2 + " mins";
      kfs.myLists = lists;
      res.send(list);
    } else {
      res.status(404).send(`List ${req.params.list_name} doesn't exist!`);
    }
  })

  // Removes full list
  .delete((req, res) => {
    const param = sanitizeHtml(req.params.list_name)
    const x = kfs.myLists
    const lists = x;
    const newList = req.body;
    const list = lists.find(l => l.list_name === param)
    if (list) {
      const listIndex = lists.findIndex(a => a.list_name === list.list_name);
      lists.splice(listIndex, 1);
      kfs.myLists = lists;
      res.send(lists);
    } else {
      res.status(404).send(`List ${req.params.list_name} doesn't exist!`);
    }
  })

// Install the router at /api/parts
app.use('/api/data', router);

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});
