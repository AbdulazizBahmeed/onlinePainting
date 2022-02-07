//this initatin the socker and connect with the server
const socket = io({ extraHeaders: { time: getTime() } });
const username = getUsername(document.cookie);
//here we are getting the elemnt from the html DOM to add event lertiner
const button = document.getElementById("send-button");
button.onclick = sendMessage;

const exit = document.getElementById("exit");
exit.onclick = () => (window.location.href = "/");

const chat = document.getElementById("chatbox");

//each time the user preees the enter key the send messag we invoked
//and it is the same as pressing the send button
//this is just for UX (user experience)
const input = document.getElementById("message-input");
input.focus();
input.oninput = () => (input.style.borderColor = "");
input.onkeyup = (e) => {
  if (e.code == "Enter" || e.code == "NumpadEnter") {
    if (input.value.trim() != "") {
      sendMessage();
      input.value = "";
    } else {
      input.style.borderColor = "red";
      input.className = "invalid-input";
      setTimeout(() => {
        input.className = "";
      }, 500);
      input.value = "";
      input.active();
    }
  }
};

//here we adding event lestiner on the socket
//each time it ger trigger it get the msg data and display using create msg
//the creat msg method just format the data so we can display in the DOM
socket.on("receive", (data) => {
  console.log(data.username);
  const message = createMsg(data);
  chat.appendChild(message);
  chat.scrollTo(0, chat.scrollHeight);
});

//here i displayed the helpers method so it wont be messy up there XD
//the get time format to 12 hours system
function getTime() {
  const date = new Date();
  let hour = date.getHours();
  const am_pm = hour > 12 ? "PM" : "AM";
  hour = hour > 12 ? `0${hour - 12}` : hour;
  const time = `${hour}:${date.getMinutes() + am_pm}`;
  return time;
}

//this method parse the cookie from the browser and take the username from it
//we need the cookie username value when we send a message
function getUsername(cookie) {
  cookie = '{"' + cookie.replace("=", '":"') + '"}';
  cookie = cookie.replace(";", ",");
  cookie = JSON.parse(cookie);
  return cookie.username;
}

//and here the create msg that format the msg data that cam from the server
function createMsg(data) {
  const msg = document.createElement("p");

  const spanTime = document.createElement("span");
  spanTime.className = "msg-time";
  spanTime.textContent = data.time;
  msg.appendChild(spanTime);

  const spanUsername = document.createElement("span");
  spanUsername.className = "msg-username";
  spanUsername.textContent =
    data.username == username ? ":" + data.username : data.username + ":";
  msg.appendChild(spanUsername);

  const spanMsg = document.createElement("span");
  spanMsg.className = "msg-content";
  spanMsg.textContent = data.msg;
  msg.appendChild(spanMsg);

  return msg;
}

//each time the user send a message by either pressing the button or pressing the enter key
//it will take the text area and invelope it a json and send with socket
//and also display the msg that user sent
function sendMessage() {
  if (input.value) {
    const time = getTime();

    const data = { time: time, username: username, msg: input.value };
    const message = createMsg(data);
    message.className = "msg-outcome";
    chat.appendChild(message);

    socket.emit("send", data);
    input.value = "";
    chat.scrollTo(0, chat.scrollHeight);
    input.focus();
  } else {
    //we notify the user that the message is empty
    input.style.borderColor = "red";
    input.className = "invalid-input";
    setTimeout(() => {
      input.className = "";
    }, 500);
    input.focus();
  }
}
