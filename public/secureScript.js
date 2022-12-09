// to show lists on arrival
displayLists()
// adding event listeners to all active button
document.getElementById('refresh-lists-open').addEventListener('click', displayLists);
document.getElementById('get-tracklist-reset-open').addEventListener('click', getTrackListDetailsResetOpen);
document.getElementById('get-tracks-open').addEventListener('click', getTracksOpen);
document.getElementById('create-list').addEventListener('click', createList);
document.getElementById('del-tracks').addEventListener('click', confirmation);
document.getElementById('creator-refresh-lists').addEventListener('click', displayCreatorLists);
document.getElementById('add-tracks').addEventListener('click', editLists);
document.getElementById('creator-get-tracklist-reset').addEventListener('click', getTrackListDetailsReset);
document.getElementById('add-review').addEventListener('click', confirmationReview);
// call to get intial user
getUser()

// Lists for authenticated methods
var dictLists = [];
var dictTracksList = [];

// Lists fot unauthenticateed methods
var dictTracksOpen = [];
var dictListsOpen = [];
var dictTracksListOpen = [];


// displays 10 most recently modified public lists fron database
function displayLists() {
  dictLists = [];
  fetch(`/api/open/display-lists`)
    .then(res => res.json()
      .then(data => {
        const l = document.getElementById('list-data-open');
        var i = 1;
        l.innerHTML = "";
        data.forEach(e => {
          const item = document.createElement('li');
          var listInfo = document.createElement('button')
          listInfo.textContent = "TRACKS"
          listInfo.name = i;
          dictListsOpen.push({
            key: i,
            value: e.list_name
          })
          i++
          listInfo.addEventListener('click', getIndvListOpen);
          listInfo.classList.add("get-list-button");
          var text = document.createTextNode(e.list_name + " by " + e.creator + " with " + e.track_list_count + " tracks" + " : " + e.list_duration + "[ " + e.rating + " ]");
          item.appendChild(text)
          l.appendChild(item);
          l.appendChild(listInfo)
        })
      }))
}

// function to get dictioanry value and respectiviley show track details
function getIndvListOpen() {
  getTrackListDetailsResetOpen()
  var id = this.attributes["name"].value
  var trackID = dictListsOpen[id - 1]
  var val = trackID.value;
  getTrackListDetailsOpen(val)
}

// provides the ability to reset the display of extended track list results
function getTrackListDetailsResetOpen() {
  var l = document.getElementById('tracklist-data-open');
  l.innerHTML = "";
  const a = document.getElementById('tracks-in-list-data-open');
  a.innerHTML = "";
}

// displays tracklist of any of the previously identified lists
function getTrackListDetailsOpen(list) {
  fetch(`/api/open/lists/${list}`)
    .then(res => res.json()
      .then(data => {
        var listInfo = document.createElement('button')
        listInfo.textContent = "+"
        dictTracksListOpen = data.track_list;
        listInfo.addEventListener('click', getTrackListInfoOpen);
        const l = document.getElementById('tracklist-data-open');
        l.innerHTML = "";
        list = "";
        const item = document.createElement('li');
        item.appendChild(document.createTextNode("Track List: " + data.track_list + " - " + data.description))
        l.appendChild(item);
        l.appendChild(listInfo)
      }))
}

// function to get dictioanry value and respectiviley show track details
function getTrackListInfoOpen() {

  const l = document.getElementById('tracks-in-list-data-open');
  l.innerHTML = "";

  for (var i = 0; i < dictTracksListOpen.length; i++) {
    getTracksFromListOpen(dictTracksListOpen[i])
  }
}



// function to get tracks from list via soft match input comaprision to track title, artist name or album title
function getTracksFromListOpen(track) {
  fetch(`/api/open/tracks-info/${track}`)
    .then(res => res.json()
      .then(data => {
        const l = document.getElementById('tracks-in-list-data-open');
        const item = document.createElement('li');
        const alldetails = document.createElement('li');
        var buttonYT = document.createElement('a');
        var link = document.createTextNode("Play");
        buttonYT.appendChild(link)
        buttonYT.title = "Play";
        buttonYT.href = "https://www.youtube.com/results?search_query=" + data.artist_name + data.track_title;
        buttonYT.target = "_blank";
        var text = document.createTextNode(data.track_title + " from " + data.album_title + " - " + data.artist_name + " : " + data.track_duration + "[ " + data.track_id + " ]                 ");
        alldetails.appendChild(document.createTextNode("Album ID: " + data.album_id + "   ||   "))
        alldetails.appendChild(document.createTextNode("Album Title: " + data.album_title + "   ||   "))
        alldetails.appendChild(document.createTextNode("Artist ID: " + data.artist_id + "   ||   "))
        alldetails.appendChild(document.createTextNode("Artist Name: " + data.artist_name + "   ||   "))
        alldetails.appendChild(document.createTextNode("Tags: " + data.tags + "   ||   "))
        alldetails.appendChild(document.createTextNode("Created On: " + data.track_date_created + "   ||   "))
        alldetails.appendChild(document.createTextNode("Recorded On: " + data.track_date_recorded + "   ||   "))
        alldetails.appendChild(document.createTextNode("Duration: " + data.track_duration + "   ||   "))
        alldetails.appendChild(document.createTextNode("Genres: " + data.track_genres + "   ||   "))
        alldetails.appendChild(document.createTextNode("Track Number: " + data.track_number + "   ||   "))
        alldetails.appendChild(document.createTextNode("Track Title: " + data.track_title))
        item.appendChild(text)
        item.appendChild(buttonYT)
        l.appendChild(item)
        l.appendChild(alldetails)

      }))
}

// function to get tracks via soft match input comaprision to track title, artist name or album title
function getTracksOpen() {
  const track = document.getElementById('find-tracks1');
  const artist = document.getElementById('find-tracks2');
  dictTracksOpen = [];
  if (track.value != "") {
    fetch(`/api/open/tracks/:${track.value}/:${artist.value}`)
      .then(res => res.json()
        .then(data => {
          const l = document.getElementById('tracks-data-open');
          l.innerHTML = "";
          track.value = "";
          artist.value = "";
          console.log(data);
          var i = 1
          data.forEach(e => {
            console.log(data);
            const item = document.createElement('li');
            var buttonYT = document.createElement('a');
            var buttonInfo = document.createElement('button')
            buttonInfo.textContent = "Details"
            var link = document.createTextNode("Play");
            buttonYT.appendChild(link)
            buttonYT.title = "Play";
            buttonYT.href = "https://www.youtube.com/results?search_query=" + e.artist_name + e.track_title;
            buttonYT.target = "_blank";
            buttonInfo.name = i;
            buttonInfo.addEventListener('click', getIndvTrackOpen);
            buttonInfo.classList.add("get-info-button");
            dictTracksOpen.push({
              key: i,
              value: e.track_id
            })
            i++;
            var text = document.createTextNode(e.track_title + " from " + e.album_title + " - " + e.artist_name + " : " + e.track_duration + "[ " + e.track_id + " ]");
            item.appendChild(text)
            l.appendChild(item);
            l.appendChild(buttonYT);
            l.append(buttonInfo)
          })
        }).catch())
  } else { alert("Please input a track title!") }
}

// function to get dictioanry value and respectiviley show track details
function getIndvTrackOpen() {
  var id = this.attributes["name"].value
  console.log(id)
  var trackID = dictTracksOpen[id - 1]
  console.log(trackID)
  var val = trackID.value;
  console.log(val)
  getTrackDetailsOpen(val)
}

// displays track details of any previosuly identified track
function getTrackDetailsOpen(track_id) {
  // const track_id = document.getElementById('find-track');
  if (!track_id.match(/[a-z]/i) && track_id.match(/[0-9]/i)) {
    fetch(`/api/open/tracks-info/${track_id}`)
      .then(res => res.json()
        .then(data => {
          var l = document.getElementById('track-data-open');
          l.innerHTML = "";
          // track_id.value = "";
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
    track_id = "";
    alert("PLEASE ENTER NUMBERS ONLY!");
  }
}

// function to get user
function getUser() {
  fetch('/user', {
    method: 'GET'
  })
    .then(res => {
      res.json()
        .then(data => {
          user = data.name
          displayCreatorLists()
        })
        .catch(err => console.log('Failed to get json object'))
    })
    .catch()
}

// var to store user
var user;

// provides the ability to reset the display of extended track list results
function getTrackListDetailsReset() {

  const a = document.getElementById('creator-tracklist-data');
  var l = document.getElementById('new-tracks-in-list-data');
  a.innerHTML = "";
  l.innerHTML = "";
}

// function to create list
function createList() {
  const list_name = document.getElementById('list-name');
  var description = document.getElementById('list-desc').value
  var public;
  if (document.getElementById('list-public').checked) {
    public = true
  } else {
    public = false
  }
  var data = {
    description: description,
    public: public
  }
  fetch(`/api/secure/lists/${list_name.value}/${user}`, {
    method: 'PUT',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => {
      if (res.ok) {
        res.json()
          .then(data => {
            console.log(data);
            displayCreatorLists()
          })
          .catch(err => console.log('Failed to get json object'))
      } else {
        console.log('Error: ', res.status);
      }
    })
    .catch()
}

// function to delete list
function deleteList() {
  var yeso = document.getElementById('yes')
  var noo = document.getElementById('no')
  var sureo = document.getElementById('sure')

  yeso.remove()
  noo.remove()
  sureo.remove()
  const list_name = document.getElementById('find-list-name-del');
  fetch(`/api/secure/lists/${list_name.value}/${user}`, {
    method: 'DELETE'
  })
    .then(res => {
      if (res.ok) {
        res.json()
          .then(data => {
            console.log(data);
            displayCreatorLists()
          })
          .catch(err => console.log('Failed to get json object'))
      } else {
        console.log('Error: ', res.status);
      }
    })
    .catch()
}

// function called when not confirmed
function dontDelete() {
  var yeso = document.getElementById('yes')
  var noo = document.getElementById('no')
  var sureo = document.getElementById('sure')

  yeso.remove()
  noo.remove()
  sureo.remove()
}

// function called to show confirmation
function confirmation() {
  var yeso = document.getElementById('yes')
  var noo = document.getElementById('no')
  var sureo = document.getElementById('sure')
  if (yeso) yeso.remove()
  if (noo) noo.remove()
  if (sureo) sureo.remove()

  const sure = document.createElement('p')
  sure.textContent = "Are you sure?"
  sure.id = 'sure'
  const yes = document.createElement('button')
  yes.id = 'yes'
  yes.textContent = 'yes'
  yes.addEventListener('click', deleteList);
  const no = document.createElement('button')
  no.id = 'no'
  no.textContent = 'no'
  no.addEventListener('click', dontDelete);
  const l = document.getElementById('delete-tracks')
  l.appendChild(sure)
  l.appendChild(yes)
  l.appendChild(no)
}

// function called to show confirmation review
function confirmationReview() {
  var yeso = document.getElementById('yes')
  var noo = document.getElementById('no')
  var sureo = document.getElementById('sure')
  if (yeso) yeso.remove()
  if (noo) noo.remove()
  if (sureo) sureo.remove()

  const sure = document.createElement('p')
  sure.textContent = "Are you sure?"
  sure.id = 'sure'
  const yes = document.createElement('button')
  yes.id = 'yes'
  yes.textContent = 'yes'
  yes.addEventListener('click', addReview);
  const no = document.createElement('button')
  no.id = 'no'
  no.textContent = 'no'
  no.addEventListener('click', dontDelete);
  const l = document.getElementById('add-review-now')
  l.appendChild(sure)
  l.appendChild(yes)
  l.appendChild(no)
}

// displays creators lists
function displayCreatorLists() {
  dictLists = [];
  fetch(`/api/secure/display-lists/${user}`)
    .then(res => res.json()
      .then(data => {
        const l = document.getElementById('creator-list-data');
        var i = 1;
        l.innerHTML = "";
        data.forEach(e => {
          const item = document.createElement('li');
          var listInfo = document.createElement('button')
          listInfo.textContent = "TRACKS"
          listInfo.name = i;
          dictLists.push({
            key: i,
            value: e.list_name
          })
          i++
          listInfo.addEventListener('click', getCreatorIndvList);
          listInfo.classList.add("creator-get-list-button");
          var text = document.createTextNode(e.list_name + " with " + e.track_list_count + " tracks");
          item.appendChild(text)
          l.appendChild(item)
          l.appendChild(listInfo)
        })
      }))
}

// function to get dictioanry value and respectiviley show track details
function getCreatorIndvList() {
  getTrackListDetailsReset()
  var id = this.attributes["name"].value
  var trackID = dictLists[id - 1]
  var val = trackID.value;
  getTrackListDetails(val)
}

// displays tracklist of any of the previously identified lists
function getTrackListDetails(list) {
  dictTracksList = []
  fetch(`/api/secure/lists/${list}`)
    .then(res => res.json()
      .then(data => {
        const reviews = document.createElement('li');
        reviews.setAttribute("class", "reviews")
        var listInfo = document.createElement('button')

        listInfo.textContent = "TRACKS"
        listInfo.addEventListener('click', getCreatorIndvList);
        listInfo.classList.add("creator-get-list-button");

        var listInfo = document.createElement('button')
        listInfo.textContent = "+"
        dictTracksList = data.track_list;
        listInfo.addEventListener('click', getTrackListInfo);
        const l = document.getElementById('creator-tracklist-data');
        l.innerHTML = "";
        list = "";
        const item = document.createElement('li');
        item.appendChild(document.createTextNode(data.list_name + " with " + data.track_list_count + " tracks" + " : duration of " + data.list_duration + " Average Rating of [ " + data.rating + " ]" + " -->Track List: " + data.track_list + " - " + data.description))
        l.appendChild(item);
        l.appendChild(listInfo)
        var p = 1
        data.comment.forEach(e => {
          if (e.status == "active") {
            var review = document.createTextNode(" ~ REVIEW #" + p + " Comment: " + e.comment + " Rating: " + e.rating + "/10 by " + e.user + " " + e.date)
            reviews.appendChild(review)
            p++
          }
        })
        l.append(reviews)
      }))
}

// function to get dictioanry value and respectiviley show track details
function getTrackListInfo() {

  const l = document.getElementById('new-tracks-in-list-data');
  l.innerHTML = "";

  for (var i = 0; i < dictTracksList.length; i++) {
    getTracksFromList(dictTracksList[i])
  }
}

// gets tracks from private lists
function getTracksFromList(track) {
  fetch(`/api/open/tracks-info/${track}`)
    .then(res => res.json()
      .then(data => {
        const l = document.getElementById('new-tracks-in-list-data');
        const item = document.createElement('li');
        var buttonYT = document.createElement('a');
        var link = document.createTextNode("Play");
        buttonYT.appendChild(link)
        buttonYT.title = "Play";
        buttonYT.href = "https://www.youtube.com/results?search_query=" + data.artist_name + data.track_title;
        buttonYT.target = "_blank";
        var text = document.createTextNode(data.track_title + " from " + data.album_title + " - " + data.artist_name + " : " + data.track_duration + "[ " + data.track_id + " ]         ");
        item.appendChild(text)
        item.append(buttonYT)
        l.appendChild(item)

        const item2 = document.createElement('li');
        item2.appendChild(document.createTextNode("Album ID: " + data.album_id + "   ||   "))
        item2.appendChild(document.createTextNode("Album Title: " + data.album_title + "   ||   "))
        item2.appendChild(document.createTextNode("Artist ID: " + data.artist_id + "   ||   "))
        item2.appendChild(document.createTextNode("Artist Name: " + data.artist_name + "   ||   "))
        item2.appendChild(document.createTextNode("Tags: " + data.tags + "   ||   "))
        item2.appendChild(document.createTextNode("Created On: " + data.track_date_created + "   ||   "))
        item2.appendChild(document.createTextNode("Recorded On: " + data.track_date_recorded + "   ||   "))
        item2.appendChild(document.createTextNode("Duration: " + data.track_duration + "   ||   "))
        item2.appendChild(document.createTextNode("Genres: " + data.track_genres + "   ||   "))
        item2.appendChild(document.createTextNode("Track Number: " + data.track_number + "   ||   "))
        item2.appendChild(document.createTextNode("Track Title: " + data.track_title))
        l.appendChild(item2);
      }))
}

// function to edit lists
function editLists() {
  const list_name = document.getElementById('new-find-list-name');
  var track_inp = document.getElementById('new-track-list').value;

  var new_name = document.getElementById('new-find-list-name-new').value;
  const tracks = track_inp.split(" ");
  var description = document.getElementById('new-list-desc').value
  var public;
  if (document.getElementById('new-list-public').checked) {
    public = true
  } else {
    public = false
  }
  var track_list = {
    track_list: tracks,
    description: description,
    public: public,
    new_name: new_name
  }
  fetch(`/api/secure/lists/${list_name.value}/${user}`, {
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
    }).catch(err => console.log(err))
}

// fucntion to add review
function addReview() {
  var yeso = document.getElementById('yes')
  var noo = document.getElementById('no')
  var sureo = document.getElementById('sure')
  if (yeso) yeso.remove()
  if (noo) noo.remove()
  if (sureo) sureo.remove()
  const list_name = document.getElementById('newest-find-list-name');
  const comment = document.getElementById('list-review').value

  var rating = document.getElementById('list-rating').value;
  let today = new Date().toISOString().slice(0, 10)

  var reviews = {
    comment: comment,
    rating: rating * 1,
    date: today,
    status: "active"
  }
  if (0 < rating && rating <= 10 && !rating.match(/[a-z]/i) && ratings.match(/[0-9]/i)) {
    fetch(`/api/secure/review/${list_name.value}/${user}`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(reviews)
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
    alert("Enter a rating between 1-10")
    rating = 0;
  }
}