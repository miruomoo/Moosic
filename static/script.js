document.getElementById('get-artistID').addEventListener('click', getMusicData);
document.getElementById('get-trackID').addEventListener('click', getTrackData);
document.getElementById('create-list').addEventListener('click', createList);
document.getElementById('add-tracks').addEventListener('click', addTracks);
document.getElementById('get-tracklist').addEventListener('click', getTrackListDetails);
document.getElementById('del-tracks').addEventListener('click', deleteList);
document.getElementById('refresh-tracks').addEventListener('click', getLists);
document.getElementById('refresh-genres').addEventListener('click', getGenres);
document.getElementById('get-artist').addEventListener('click', getArtistDetails);
document.getElementById('get-track').addEventListener('click', getTrackDetails);

document.getElementById('artist-sort').addEventListener('click', sortByName);

function getMusicData() {
  const artist = document.getElementById('search-artist');
  console.log(artist.value);
  if (artist.value != "") {
    fetch(`/api/data/findArtist/${artist.value}`)
      .then(res => res.json()
        .then(data => {
          if (artist.value.match(/[a-z]/i) && !artist.value.match(/[0-9]/i)) {
            const l = document.getElementById('music-data');
            l.innerHTML = "";
            artist.value = "";
            data.forEach(e => {
              const item = document.createElement('li');
              item.appendChild(document.createTextNode(e))
              l.appendChild(item);
            })
          } else {
            artist.value = "";
            alert("PLEASE ENTER ALPHABET ONLY!");
          }
        }))
  }
}

function getTrackData() {
  const track = document.getElementById('search-track');
  if (track.value != "") {
    fetch(`/api/data/findTrack/${track.value}`)
      .then(res => res.json()
        .then(data => {
          if (track.value.match(/[a-z]/i) && !track.value.match(/[0-9]/i)) {
            const l = document.getElementById('music-data');
            l.innerHTML = "";
            track.value = "";
            data.forEach(e => {
              console.log(data);
              const item = document.createElement('li');
              item.appendChild(document.createTextNode(e))
              l.appendChild(item);
            })
          } else {
            track.value = "";
            alert("PLEASE ENTER ALPHABET ONLY!");
          }
        }))
  }
}

function createList() {
  const list_name = document.getElementById('list-name');
  fetch(`/api/data/lists/${list_name.value}`, {
    method: 'PUT'
  })
    .then(res => {
      if (res.ok) {
        res.json()
          .then(data => {
            console.log(data);
          })
          .catch(err => console.log('Failed to get json object'))
      } else {
        console.log('Error: ', res.status);
      }
    })
    .catch()
}

function addTracks() {
  const list_name = document.getElementById('find-list-name');
  var track_inp = document.getElementById('track-list').value;
  const tracks = track_inp.split(" ");
  const track_list = { track_list: tracks }
  if (!track_inp.match(/[a-z]/i) && track_inp.match(/[0-9]/i)) {
    fetch(`/api/data/lists/${list_name.value}`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(track_list)
    })
      .then(res => {

        if (res.ok) {
          res.json()
            .then(data => {
              console.log(data);
            })
            .catch(err => console.log('Failed to get json object'))
        } else {
          console.log('Error: ', res.status);
        }
      })
      .catch()
  } else {
    track_inp = "";
    alert("PLEASE ENTER NUMBERS ONLY!");
  }
}

function getTrackListDetails() {
  var list = document.getElementById('search-tracklist').value;
  fetch(`/api/data/lists/${list}`, {
    method: 'GET'
  })
    .then(res => res.json()
      .then(data => {
        console.log(data)
        const l = document.getElementById('tracklist-data');
        l.innerHTML = "";
        list = "";
        const item = document.createElement('li');
        item.appendChild(document.createTextNode("Track List: " + data))
        l.appendChild(item);
      }))
}

function deleteList() {
  const list_name = document.getElementById('find-list-name-del');
  fetch(`/api/data/lists/${list_name.value}`, {
    method: 'DELETE'
  })
    .then(res => {
      if (res.ok) {
        res.json()
          .then(data => {
            console.log(data);
          })
          .catch(err => console.log('Failed to get json object'))
      } else {
        console.log('Error: ', res.status);
      }
    })
    .catch()
}

function getLists() {
  const track = document.getElementById('search-track');
  fetch('/api/data/listen')
    .then(res => res.json()
      .then(data => {
        const l = document.getElementById('list-data');
        l.innerHTML = "";
        track.value = "";
        data.forEach(e => {
          console.log(data);
          const item = document.createElement('li');
          item.appendChild(document.createTextNode("Name: " + e.list_name + "   ||   "))
          item.appendChild(document.createTextNode("Track Count: " + e.track_list_count + "   ||   "))
          item.appendChild(document.createTextNode("List Duration: " + e.list_duration))
          l.appendChild(item);
        })
      }))
}

function getGenres() {
  fetch('/api/data/genres')
    .then(res => res.json()
      .then(data => {
        const l = document.getElementById('genre-data');
        data.forEach(e => {
          console.log(data);
          const item = document.createElement('li');
          item.appendChild(document.createTextNode("Genre: " + e.genre_name + "   ||   "))
          item.appendChild(document.createTextNode("ID: " + e.genre_id + "   ||   "))
          item.appendChild(document.createTextNode("Parent: " + e.parent_id))
          l.appendChild(item);
        })
      }))
}

function getArtistDetails() {
  const artist = document.getElementById('find-list');
  if (!artist.value.match(/[a-z]/i) && artist.value.match(/[0-9]/i)) {
    fetch(`/api/data/artists/${artist.value}`)
      .then(res => res.json()
        .then(data => {
          const l = document.getElementById('artist-data');
          l.innerHTML = "";
          artist.value = "";
          console.log(data);
          const item = document.createElement('li');
          item.appendChild(document.createTextNode("Name: " + data.artist_name + "   ||   "))
          item.appendChild(document.createTextNode("Image: " + data.artist_image_file + "   ||   "))
          item.appendChild(document.createTextNode("Started: " + data.artist_active_year_begin + "   ||   "))
          item.appendChild(document.createTextNode("BIO: " + data.artist_bio + "   ||   "))
          item.appendChild(document.createTextNode("Labels: " + data.artist_associated_labels + "   ||   "))
          item.appendChild(document.createTextNode("Website: " + data.artist_website))
          l.appendChild(item);
        }))
  } else {
    artist.value = "";
    alert("PLEASE ENTER NUMBERS ONLY!");
  }
}

function getTrackDetails() {
  const artist = document.getElementById('find-track');
  if (!artist.value.match(/[a-z]/i) && artist.value.match(/[0-9]/i)) {
    fetch(`/api/data/tracks/${artist.value}`)
      .then(res => res.json()
        .then(data => {
          const l = document.getElementById('track-data');
          l.innerHTML = "";
          artist.value = "";
          console.log(data);
          const item = document.createElement('li');
          item.appendChild(document.createTextNode("Album ID: " + data.album_id + "   ||   "))
          item.appendChild(document.createTextNode("Album Title: " + data.album_title + "   ||   "))
          item.appendChild(document.createTextNode("Artist ID: " + data.artist_id + "   ||   "))
          item.appendChild(document.createTextNode("Artist Name: " + data.artist_name + "   ||   "))
          item.appendChild(document.createTextNode("Tags: " + data.tags + "   ||   "))
          item.appendChild(document.createTextNode("Created On: " + data.track_date_created + "   ||   "))
          item.appendChild(document.createTextNode("Recorded On: " + data.track_date_recorded + "   ||   "))
          item.appendChild(document.createTextNode("Duration: " + data.track_duration + "   ||   "))
          item.appendChild(document.createTextNode("Genres: " + data.track_genres + "   ||   "))
          item.appendChild(document.createTextNode("Track Number: " + data.track_number + "   ||   "))
          item.appendChild(document.createTextNode("Track Title: " + data.track_title))
          l.appendChild(item);
        }))
  } else {
    artist.value = "";
    alert("PLEASE ENTER NUMBERS ONLY!");
  }
}
