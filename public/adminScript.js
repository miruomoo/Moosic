document.getElementById('viewUsers').addEventListener('click', displayUsers);
document.getElementById('activate').addEventListener('click', activateUser);
document.getElementById('deactivate').addEventListener('click', deactivateUser);
document.getElementById('gadmin').addEventListener('click', grantAdmin);
document.getElementById('viewLogs').addEventListener('click', displayLogs);
document.getElementById('enterLog').addEventListener('click', enterLog);
document.getElementById('showRev').addEventListener('click', showRev);
document.getElementById('hideRev').addEventListener('click', hideRev);
document.getElementById('displayRev').addEventListener('click', displayRev);
document.getElementById('updatePolicy').addEventListener('click', updatePolicy);

function displayUsers() {
  const l = document.getElementById('users');

  while (l.firstChild) {
    l.removeChild(l.firstChild);
  }

  fetch('/api/admin/users')
    .then(res => res.json()
      .then(data => {
        data.forEach(e => {
          console.log(data);
          const item = document.createElement('li');
          item.appendChild(document.createTextNode(`User ID: ${e.id} `))
          item.appendChild(document.createTextNode(`Name: ${e.name} `))
          item.appendChild(document.createTextNode(`E-mail: ${e.email} `))
          item.appendChild(document.createTextNode(`STATUS: ${e.status} `))
          l.appendChild(item)
        })
      }))
}

function activateUser() {
  input = document.getElementById("userID")

  fetch(`/api/admin/users/activate/${input.value}`, {
    method: 'POST'
  })
    .then(res => res.json()
      .then(data => {
        console.log(data)
      }))

    displayUsers()
}

function deactivateUser() {
  input = document.getElementById("userID")

  fetch(`/api/admin/users/deactivate/${input.value}`, {
    method: 'POST'
  })
    .then(res => res.json()
      .then(data => {
        console.log(data)
      }))

    displayUsers()
}

function grantAdmin() {
  input = document.getElementById("userID")

  fetch(`/api/admin/users/grantadmin/${input.value}`, {
    method: 'POST'
  })
    .then(res => res.json()
      .then(data => {
        console.log(data)
      }))

    displayUsers()
}

function displayLogs() {
  l = document.getElementById('logs');

  while (l.firstChild) {
    l.removeChild(l.firstChild);
  }

  fetch('/api/admin/logs')
    .then(res => res.json()
      .then(data => {
        data.forEach(e => {
          console.log(data);
          const item = document.createElement('li');
          if (e.type=="tr"){
            item.appendChild(document.createTextNode("Takedown Request "))
          }
          else if (e.type=="in"){
            item.appendChild(document.createTextNode("Infringment Notice "))
          }
          else if (e.type=="dc"){
            item.appendChild(document.createTextNode("Dispute Claim "))
          }
          item.appendChild(document.createTextNode(`Date: ${e.date} `))
          item.appendChild(document.createTextNode(`Associated Review: ${e.review} `))
          l.appendChild(item)
        })
      }))
}

function enterLog() {
  select = document.getElementById("logType")
  input2 = document.getElementById("revDate")
  input = document.getElementById("review")


  fetch(`/api/admin/logs/${select.value}/${input2.value}/${input.value}`, {
    method: 'POST'
  })
    .then(res => res.json()
      .then(data => {
        console.log(data)
      }))

    displayLogs()
}

function showRev() {
  input = document.getElementById("comment")

  fetch(`/api/admin/show/${input.value}`, {
    method: 'POST'
  })
    .then(res => res.json()
      .then(data => {
        console.log(data)
      }))
      displayRev()
}

function hideRev() {
  input = document.getElementById("comment")

  fetch(`/api/admin/hide/${input.value}`, {
    method: 'POST'
  })
    .then(res => res.json()
      .then(data => {
        console.log(data)
      }))
      displayRev()
}

function displayRev() {
  l = document.getElementById('reviews');

  while (l.firstChild) {
    l.removeChild(l.firstChild);
  }

  fetch('/api/admin/reviews')
    .then(res => res.json()
      .then(data => {
        data.forEach(e => {
          e.comment.forEach(e => {
            console.log(data);
            const item = document.createElement('li');
            item.appendChild(document.createTextNode(`Comment: "${e.comment}" `))
            item.appendChild(document.createTextNode(`Date: ${e.date} `))
            item.appendChild(document.createTextNode(`STATUS: ${e.status} `))
            l.appendChild(item)
          })
        })
      }))
}

function updatePolicy(){
  input = document.getElementById('updateP')
  select = document.getElementById('update')

  if (select.value=='aup'){
    fetch(`/api/admin/aup/${input.value}`, {
      method: 'POST'
    })
      .then(res => res.json()
        .then(data => {
          console.log(data)
        }))
    alert('Acceptable Use Policy Updated!')
  }
  else if 
  (select.value=='dmca'){
    fetch(`/api/admin/dmca/${input.value}`, {
      method: 'POST'
    })
      .then(res => res.json()
        .then(data => {
          console.log(data)
        }))
    alert('DMCA Policy Updated!')

  }
  if (select.value=='pp'){
    fetch(`/api/admin/pp/${input.value}`, {
      method: 'POST'
    })
      .then(res => res.json()
        .then(data => {
          console.log(data)
        }))
    alert('Privacy Policy Updated!')

  }
}