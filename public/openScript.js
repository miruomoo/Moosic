// to show lists on arrival
displayLists()
// adding event listeners to all active button
document.getElementById('refresh-lists').addEventListener('click', displayLists);
document.getElementById('get-tracks').addEventListener('click', getTracks);
document.getElementById('get-tracklist-reset').addEventListener('click', getTrackListDetailsReset);

// dictionaries to map button to their resepctive list
var dictTracks = [];
var dictLists = [];
var dictTracksList = [];

// displays 10 most recently modified or created public lists fron database
function displayLists() {
  dictLists = [];
  fetch(`/api/open/display-lists`)
    .then(res => res.json()
      .then(data => {
        const l = document.getElementById('list-data');
        var i = 1;
        l.innerHTML = "";
        data.forEach(e => {
          const item = document.createElement('li');
          var listInfo = document.createElement('button')
          listInfo.textContent = "TRACKS"
          listInfo.name = i;
          // maps buttons to lists
          dictLists.push({
            key: i,
            value: e.list_name
          })
          i++
          listInfo.addEventListener('click', getIndvList);
          listInfo.classList.add("get-list-button");
          var text = document.createTextNode(e.list_name + " by " + e.creator + " with " + e.track_list_count + " tracks" + " : " + e.list_duration + "[ " + e.rating + " ]");
          item.appendChild(text)
          l.appendChild(item);
          l.appendChild(listInfo)
        })
      }))
}

// function to get dictioanry value and respectiviley show track details
function getIndvList() {
  getTrackListDetailsReset()
  var id = this.attributes["name"].value
  var trackID = dictLists[id - 1]
  var val = trackID.value;
  getTrackListDetails(val)

}

// displays tracklist of any of the previously identified lists and callback
function getTrackListDetails(list) {
  fetch(`/api/open/lists/${list}`)
    .then(res => res.json()
      .then(data => {
        var listInfo = document.createElement('button')
        listInfo.textContent = "+"
        dictTracksList = data.track_list;
        listInfo.addEventListener('click', getTrackListInfo);
        const l = document.getElementById('tracklist-data');
        l.innerHTML = "";
        list = "";
        const item = document.createElement('li');
        item.appendChild(document.createTextNode("Track List: " + data.track_list + " - " + data.description))
        l.appendChild(item);
        l.appendChild(listInfo)
      }))
}

// function to get dictionary value and callback
function getTrackListInfo() {

  const l = document.getElementById('tracks-in-list-data');
  l.innerHTML = "";

  for (var i = 0; i < dictTracksList.length; i++) {
    getTracksFromList(dictTracksList[i])
  }
}

// provides the ability to reset the display of extended track list results
function getTrackListDetailsReset() {
  var l = document.getElementById('tracklist-data');
  l.innerHTML = "";
  const a = document.getElementById('tracks-in-list-data');
  a.innerHTML = "";
}

// function to get tracks via soft match input comaprision to track title/artist name and get details
function getTracks() {
  const track = document.getElementById('find-tracks1');
  const artist = document.getElementById('find-tracks2');
  dictTracks = [];
  if (track.value != "") {
    fetch(`/api/open/tracks/:${track.value}/:${artist.value}`)
      .then(res => res.json()
        .then(data => {
          const l = document.getElementById('tracks-data');
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
            buttonInfo.addEventListener('click', getIndvTrack);
            buttonInfo.classList.add("get-info-button");
            dictTracks.push({
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

// function to get track details of a track from a list
function getTracksFromList(track) {
  fetch(`/api/open/tracks-info/${track}`)
    .then(res => res.json()
      .then(data => {
        const l = document.getElementById('tracks-in-list-data');
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

// function to get dictionary value and callback
function getIndvTrack() {
  var id = this.attributes["name"].value
  console.log(id)
  var trackID = dictTracks[id - 1]
  console.log(trackID)
  var val = trackID.value;
  console.log(val)
  getTrackDetails(val)
}

// displays track details of any previosuly identified track
function getTrackDetails(track_id) {
  // const track_id = document.getElementById('find-track');
  if (!track_id.match(/[a-z]/i) && track_id.match(/[0-9]/i)) {
    fetch(`/api/open/tracks-info/${track_id}`)
      .then(res => res.json()
        .then(data => {
          const l = document.getElementById('track-data');
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