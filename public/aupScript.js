populate();

function populate(){
    fetch('/api/open/aup')
    .then(res => res.json()
      .then(data => {
        data.forEach(e => {
            document.body.appendChild(document.createTextNode(`${e.line}`))
            document.body.appendChild(document.createElement("br"));
        })
}))}