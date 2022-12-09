
// require statements
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config() // loads environment variables from a . env file
}
const express = require('express') // back end web application framework
const bcrypt = require('bcrypt') // password-hashing function
const passport = require('passport') // modular authentication middleware
const flash = require('express-flash') // extension to display a flash message
const session = require('express-session') // create and manage a session middleware
const methodOverride = require('method-override') // extension to allow PUT and DELETE in unsupported places
const fs = require('fs'); // extension to read files
const csv = require('csv-parser'); // extension to parse csvs
const sanitizeHtml = require('sanitize-html'); // simple method for input sanitization
const kfs = require("key-file-storage")('storage'); // simple key-value storage directly on file system
var path = require("path"); // import to retrieve paths
var stringSimilarity = require("string-similarity"); // string soft comparing

const app = express()
const port = 4000;
const users = kfs.userCred; // retrieves all users from userCred JSON db
// instantiating routers
const logs = kfs.adminLog; // retrieves all users from adminLog JSON db
// instantiating routers
const aup = kfs.aup;
const dmca = kfs.dmca;
const pp = kfs.privacy;
const openRouter = express.Router(); // nonauthorized users
const secureRouter = express.Router(); // authorized users
const adminRouter = express.Router(); // admin users

// parse data in body as JSON
openRouter.use(express.json());
secureRouter.use(express.json());
adminRouter.use(express.json())

// Arrays to store parsed CSV data
const genres = [];
const albums = [];
const artists = [];
const tracks = [];

// Array to hold user data
var user = [];

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

// insitializing passport for authenitcation
const initializePassport = require('./passport-config')
const e = require('express')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

// initializing app ware
app.use('/views', express.static('views'));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', require('ejs').renderFile);
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

/*******************************************************/
/*** BACKEND FOR ACCOUNT CREATION AND VERIFICIATION! ***/
/*******************************************************/

app.get('/', checkAuthenticated, (req, res) => {
  user = req.user;
  res.render(path.join(__dirname, '/public/secure.html'))
})

app.get('/admin', checkAuthenticated, (req, res) => {
  user = req.user;
  res.render(path.join(__dirname, '/public/admin.html'))
})

app.get('/user', (req, res) => {
  res.send(user)
})

app.get('/open', (req, res) => {
  res.render(path.join(__dirname, '/public/open.html'))
})

app.get('/interface', (req, res) => {
  res.render(path.join(__dirname, '/public/policy/interface.html'))
})

app.get('/interfacesecure', (req, res) => {
  res.render(path.join(__dirname, '/public/policy/interfacesecure.html'))
})

app.get('/aup', (req, res) => {
  res.render(path.join(__dirname, '/public/policy/aup.html'))
})

app.get('/privacy', (req, res) => {
  res.render(path.join(__dirname, '/public/policy/privacy.html'))
})

app.get('/dmca', (req, res) => {
  res.render(path.join(__dirname, '/public/policy/dmca.html'))
})

app.get('/dmcaproc', (req, res) => {
  res.render(path.join(__dirname, '/public/policy/dmcaproc.html'))
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.get('/success', (req, res) => {
  res.render('success.ejs')
})

openRouter.route('/verify/:email')
  .get((req, res) => {
    user = users.find(l => l.email == req.params.email);
    res.send(user);
  })

openRouter.route('/verify/done/:email')
  .post((req, res) => {
    const newUsers = users.find(l => l.email == req.params.email)
    newUsers.ver = "done";
    kfs.userCred = users;
    res.send(newUsers)
  })

openRouter.route('/aup')
  .get((req, res) => {
    aup = kfs.aup;
    res.send(aup);
  })

openRouter.route('/dmca')
  .get((req, res) => {
    dmca = kfs.dmca;
    res.send(dmca);
  })

openRouter.route('/privacy')
  .get((req, res) => {
    privacy = kfs.privacy;
    res.send(privacy);
  })

// Post login authentication for password 
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
}),
  (req, res) => {
    if (req.user.status == "admin") {
      res.redirect('/admin')
    }
    else if (req.user.ver == "waiting") {
    }
    else {
      res.redirect('/')
    }
  })

app.get('/changepassword', function (req, res) {
  res.render('changepass.ejs')
})

// Post password changes for authenticated users
app.post('/changepassword', async function (req, res) {
  const userF = users.find(user => user.email === req.body.email)
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  userF.password = hashedPassword
  kfs.userCred = users;
  res.redirect('/login')
})

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

// Post users that are to be registered run through authentication sync
app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    if (!users.find(user => user.email === req.body.email)) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        status: "active",
        ver: "waiting"
      })
      kfs.userCred = users;
      res.redirect('/login')
    } else {
      return res.status(500).send("Email has already been used <a href='/register'>GO BACK</a>");
    }
  } catch {
    res.redirect('/register')
  }
})

app.delete('/logout', (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});

function checkAuthenticated(req, res, next) {

  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

/****************************************/
/*** BACKEND FOR AUTHENITCATED USERS! ***/
/****************************************/

// get creator lists
secureRouter.route('/lists/:list_name/:creator')
  // Get list from list name
  .get((req, res) => {

    const oldLists = kfs.myLists
    const lists = oldLists.map((data) => {
      return {
        'list_name': data.list_name,
        'track_list': data.track_list,
        'description': data.description
      }
    });
    const param = sanitizeHtml(req.params.list_name)
    const list = lists.find(l => l.list_name === param);
    if (list) {
      res.send(list);
    } else {
      res.status(404).send(`List ${req.params.list_name} doesn't exist!`);
    }
  })

secureRouter.route('/lists/:list_name/:creator')
  // Get list of lists (For development)
  .get((req, res) => {

    const oldLists = kfs.myLists
    const lists = oldLists.map((data) => {
      return {
        'list_name': data.list_name,
        'track_list': data.track_list,
        'description': data.description
      }
    });
    const param = sanitizeHtml(req.params.list_name)
    const list = lists.find(l => l.list_name === param);
    if (list) {
      res.send(list);
    } else {
      res.status(404).send(`List ${req.params.list_name} doesn't exist!`);
    }
  })
  // Create a new list
  .put((req, res) => {

    let today = new Date().toISOString().slice(0, 10)
    const lists = kfs.myLists
    const newList = req.body;
    const param = sanitizeHtml(req.params.list_name)
    const param0 = sanitizeHtml(req.params.creator)
    newList.creator = param0;
    newList.list_name = param
    newList.track_list = [];
    newList.list_duration = 0;
    newList.track_list_count = 0;
    newList.rating = 0;
    newList.comment = []
    newList.date = today;

    if (!lists.find(l => l.list_name === param) && lists.filter(list => list.creator.indexOf(param0) !== -1).length < 20) {
      if (req.body.description) {
        newList.description = req.body.description;
      } else {
        newList.description = ""
      }
      if (req.body.public) {
        newList.public === true;
      } else {
        newList.public = false;
      }
      lists.push(newList);
      kfs.myLists = lists;
      res.send(lists);
    } else {
      res.status(404).send(`List ${req.params.list_name} already exists! Or exceeded maximum allowed lists`);
    }
  })

  // Add/Replace track list and edit other aspects
  .post((req, res) => {
    const trackFilter = tracks.map((data) => {
      return {
        'track_id': data.track_id,
        'track_duration': data.track_duration
      }
    });
    let today = new Date().toISOString().slice(0, 10)
    const param = sanitizeHtml(req.params.list_name)
    const lists = kfs.myLists
    const list = lists.find(l => l.list_name === param);
    var has = false;
    var BreakException = {};
    req.body.track_list.forEach(e => {
      if (tracks.find(l => l.track_id === e)) {
        has = true
      } else {
        has = false
        throw BreakException;
      }
    })

    if (list) {
      if (req.body.track_list && has) {
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
      }
      if (req.body.description) {
        list.description = req.body.description
      }
      if (req.body.public) {
        list.public === true;
      }

      if (req.body.new_name && !lists.find(l => l.list_name === req.body.new_name)) {
        list.list_name = req.body.new_name;
      } else {
        res.status(404).send(`List ${req.params.new_name} already exists!`);
      }

      list.date = today;
      kfs.myLists = lists;
      res.send(list);
    } else {
      res.status(404).send(`List ${req.params.list_name} doesn't exist!`);
    }
  })

  // Removes full list
  .delete((req, res) => {
    const param = sanitizeHtml(req.params.list_name)
    const lists = kfs.myLists
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

// Authenticated router to display lists user created
secureRouter.route('/display-lists/:creator')
  .get((req, res) => {
    const lists = kfs.myLists

    let n = 20;
    let limitResult = [];
    for (let i = 0; i < lists.length; i++) {
      if (n != 0 && lists[i]['creator'] === req.params.creator) {
        limitResult.push(lists[i]);
        n--;
      }
    }
    res.send(limitResult);
  })

// Authenticated route for list names made by users
secureRouter.route('/lists/:list_name')
  // Get list of lists (For development)
  .get((req, res) => {

    const lists = kfs.myLists
    // const lists = oldLists.map((data) => {
    //   return {
    //     'list_name': data.list_name,
    //     'track_list': data.track_list,
    //     'description': data.description,
    //     'comment': data.comment
    //   }
    // });
    const param = sanitizeHtml(req.params.list_name)
    const list = lists.find(l => l.list_name === param);
    if (list) {
      res.send(list);
    } else {
      res.status(404).send(`List ${req.params.list_name} doesn't exist!`);
    }
  })

  // updates reviews
secureRouter.route('/review/:list_name/:creator')
  // Add/Replace track list
  .post((req, res) => {
    const param = sanitizeHtml(req.params.list_name)
    const lists = kfs.myLists
    const list = lists.find(l => l.list_name === param);
    if (list) {
      comments = {
        comment: req.body.comment,
        rating: req.body.rating,
        user: req.params.creator,
        date: req.body.date,
        status: "active"
      }
      list.comment.push(comments)

      if (list.rating != 0) {
        list.rating = ((list.rating + req.body.rating) / 2)
      } else {
        list.rating = req.body.rating;
      }

      kfs.myLists = lists;
      res.send(list);
    } else {
      res.status(404).send(`List ${req.params.list_name} doesn't exist!`);
    }
  })

/******************************************/
/*** BACKEND FOR UNAUTHENITCATED USERS! ***/
/******************************************/

// find tracks with track title and optional artist name
openRouter.route('/tracks/:track_title/:artist_name?')
  // Get track from track_title or artist name
  .get((req, res) => {

    const newArray = tracks.map((data) => {
      return {
        'track_title': data.track_title,
        'album_title': data.album_title,
        'artist_name': data.artist_name,
        'track_duration': data.track_duration,
        'track_id': data.track_id
      }
    });

    let limitResult = [];
    let n = 4;
    const paramTrack = sanitizeHtml(req.params.track_title)
    console.log(paramTrack)
    const paramArtist = sanitizeHtml(req.params.artist_name)
    console.log(paramArtist)
    for (let i = 0; i < newArray.length; i++) {
      if (paramTrack !== "" && paramArtist !== "") {
        if (stringSimilarity.compareTwoStrings((newArray[i]['track_title']).toUpperCase(), paramTrack.toUpperCase()) > 0.3 && stringSimilarity.compareTwoStrings((newArray[i]['artist_name']).toUpperCase(), paramArtist.toUpperCase()) > 0.7 && n != 0) {
          limitResult.push(newArray[i]);
          n--;
          continue;
        }
      }
      if (paramTrack != "") {
        if (stringSimilarity.compareTwoStrings((newArray[i]['track_title']).toUpperCase(), paramTrack.toUpperCase()) > 0.2 && n != 0) {
          limitResult.push(newArray[i]);
          n--;
          continue;
        }
      }
      if (paramArtist != "") {
        if (stringSimilarity.compareTwoStrings((newArray[i]['artist_name']).toUpperCase(), paramArtist.toUpperCase()) > 0.2 && n != 0) {
          limitResult.push(newArray[i]);
          n--;
          continue;
        }
      }
    }
    res.send(limitResult);
  })

  // comapre function to order by date
function compare(a, b) {
  if (a.date > b.date) {
    return -1;
  }
  if (a.date < b.date) {
    return 1;
  }
  return 0;
}

// Unauthenticated users can see displayed list
openRouter.route('/display-lists')
  .get((req, res) => {

    const oldLists = kfs.myLists
    const lists = oldLists.map((data) => {
      return {
        'list_name': data.list_name,
        'creator': data.creator,
        'track_list_count': data.track_list_count,
        'list_duration': data.list_duration,
        'rating': data.rating,
        'public': data.public,
        'date': data.date
      }
    });
    let n = 10;
    let limitResult = [];
    for (let i = 0; i < lists.length; i++) {
      if (lists[i]['public'] === true && n != 0) {
        limitResult.push(lists[i]);
        n--;
      }
    }
    limitResult.sort(compare)
    res.send(limitResult);
  })

// Unauthenticated users can see displayed list names
openRouter.route('/lists/:list_name')
  // Get list of lists (For development)
  .get((req, res) => {

    const oldLists = kfs.myLists
    const lists = oldLists.map((data) => {
      return {
        'list_name': data.list_name,
        'track_list': data.track_list,
        'description': data.description
      }
    });
    const param = sanitizeHtml(req.params.list_name)
    const list = lists.find(l => l.list_name === param);
    if (list) {
      res.send(list);
    } else {
      res.status(404).send(`List ${req.params.list_name} doesn't exist!`);
    }
  })

// Unauthenticated users can see track ID information
openRouter.route('/tracks-info/:track_id')
  // Get track details from track_id
  .get((req, res) => {
    const param = sanitizeHtml(req.params.track_id)
    const track = tracks.find(t => t.track_id === param);
    if (track) {
      let filters = ['track_title', 'album_title', 'artist_name', 'track_duration', 'track_id', 'album_id', 'album_title', 'artist_id', 'tags', 'track_date_created', 'track_date_recorded', 'track_genres', 'track_number']
      const filterTrack = (obj, fil) => fil.reduce((a, c) => (a[c] = obj[c], a), {});
      res.send(filterTrack(track, filters));
    } else {
      res.status(404).send(`Track ${req.params.artist_id} was not found!`);
    }
  })

/******************************************/
/******** BACKEND FOR ADMINISTRATOR *******/
/******************************************/
adminRouter.route('/users')
  // Get list of users
  .get((req, res) => {
    const newUsers = users.map((data) => {
      return {
        'id': data.id,
        'name': data.name,
        'email': data.email,
        'status': data.status
      }
    })
    res.send(newUsers)
  });

adminRouter.route('/logs')
  // Get list of logs
  .get((req, res) => {
    const newLogs = logs.map((data) => {
      return {
        'type': data.type,
        'date': data.date,
        'review': data.review
      }
    })
    res.send(newLogs)
  });

adminRouter.route('/users/activate/:id')
  .post((req, res) => {
    const newUsers = users.find(l => l.id == req.params.id)
    newUsers.status = "active";
    kfs.userCred = users;
    res.send(newUsers)
  })

adminRouter.route('/users/deactivate/:id')
  .post((req, res) => {
    const newUsers = users.find(l => l.id == req.params.id)
    newUsers.status = "deactivated";
    kfs.userCred = users;
    res.send(newUsers)
  })

adminRouter.route('/users/grantadmin/:id')
  .post((req, res) => {
    const newUsers = users.find(l => l.id == req.params.id)
    newUsers.status = "admin";
    kfs.userCred = users;
    res.send(newUsers)
  })

adminRouter.route('/logs/:type/:date/:review')
  // Add Log
  .post((req, res) => {
    const newLog = {
      "type": req.params.type,
      "date": req.params.date,
      "review": req.params.review
    }
    logs.push(newLog)
    kfs.adminLog = logs;
    res.send(newLog)
  })

adminRouter.route('/hide/:comment')
  // Add Log
  .post((req, res) => {
    oldLists = kfs.myLists
    oldLists.forEach(e => {
      e.comment.forEach(e => {
        if (req.params.comment == e.comment) {
          e.status = "deactivated"
        }
      })
    })
    kfs.myLists = oldLists;
    res.send(oldLists)
  })

adminRouter.route('/show/:comment')
  .post((req, res) => {
    oldLists = kfs.myLists
    oldLists.forEach(e => {
      e.comment.forEach(e => {
        if (req.params.comment == e.comment) {
          e.status = "active"
        }
      })
    })
    kfs.myLists = oldLists;
    res.send(oldLists)
  })

adminRouter.route('/reviews')
  // Get list of users
  .get((req, res) => {
    lists = kfs.myLists
    const newList = lists.map((data) => {
      return {
        'comment': data.comment
      }
    })
    res.send(newList)
  });

adminRouter.route('/aup/:line')
  .post((req, res) => {
    newLine = {
      "line": req.params.line
    }
    aup.push(newLine);
    kfs.aup = aup;
    res.send(newLine)
  })

adminRouter.route('/dmca/:line')
  .post((req, res) => {
    newLine = {
      "line": req.params.line
    }
    dmca.push(newLine);
    kfs.dmca = dmca;
    res.send(newLine)
  })

adminRouter.route('/pp/:line')
  .post((req, res) => {
    newLine = {
      "line": req.params.line
    }
    pp.push(newLine);
    kfs.privacy = pp;
    res.send(newLine)
  })

app.use('/api/open', openRouter);
app.use('/api/secure', secureRouter);
app.use('/api/admin', adminRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
});
