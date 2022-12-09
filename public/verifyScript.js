document.getElementById('sub').addEventListener('click', regAcc);

function regAcc(){
    document.querySelectorAll('.ver').forEach(e => e.remove());
    var input = document.getElementById('email')
    
    fetch(`/api/open/verify/${input.value}`, {
      })
        .then(res => res.json()
          .then(data => {
            console.log(data)
            if (data.ver == "waiting"){
                var a = document.createElement('a');
                a.setAttribute("id", "link")
                a.setAttribute("class", "ver")
                var linkText = document.createTextNode("http://moosic.com/VerifyEmail="+input.value);
                a.appendChild(linkText);
                a.href = "/success"
                a.addEventListener('click', verAcc)

                var textNode = document.createElement("span");
                textNode.innerText = "Verify Email!: ";
                textNode.setAttribute('class', 'ver');
                document.body.appendChild(textNode)
                document.body.appendChild(a)
            }
          }))
}

function verAcc(){
    var input = document.getElementById('email')

    fetch(`/api/open/verify/done/${input.value}`, {
        method: 'POST'
      })
        .then(res => res.json()
          .then(data => {
            console.log(data)
          }))
    
}