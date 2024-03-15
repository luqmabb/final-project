// function getData() {
//     let name = document.getElementById("name").value

//     console.log(name)
// }

function getData() {
    let name = document.getElementById("name").value
    let email = document.getElementById("email").value
    let phone = document.getElementById("phone").value
    let subject = document.getElementById("subject").value
    let message = document.getElementById("message").value
  console.log(name)
  
    if(name == "") {
      return alert("Please type your name")
    } else if(email == "") {
      return alert("Please type your email")
    } else if(phone == "") {
      return alert("Please type your phone")
    } else if(subject == "") {
      return alert("Please input your subject")
    } else if(message == "") {
      return alert("Please type your message")
    }
  
    const emailDestination = "luqmannfauzy46@gmail.com"
    let a = document.createElement("a")
    a.href = `mailto:${emailDestination}?subject=${subject}&body= Halo bang nama saya, ${name}, saya ingin ${message}. bisakah anda menghubungi saya ${phone}`
    a.click()
  
    const data = {
      name,
      email,
      phone,
      subject,
      message
    }
  
    console.log(data)
  }