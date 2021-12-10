const socket = io({ extraHeaders: { time: getTime() } });

const button = document.getElementById("send-button");
button.onclick = sendMessage;
const exit = document.getElementById("exit");
exit.onclick = () => window.location.href = "/";
const chat = document.getElementById("chatbox");
const username = getUsername(document.cookie);
const input = document.getElementById("message-input");
input.oninput = () => (input.style.borderColor = "");
input.onkeyup = (e) => {
  if (e.code == "Enter" || e.code == "NumpadEnter") {
    if (input.value.trim()) {
      sendMessage();
      input.value = "";
    } else {
      input.style.borderColor = "red";
      input.className = "invalid-input";
      setTimeout(() => {
        input.className = "";
      }, 500);
      input.value = ""
      input.active()
    }
  }
};

socket.on("receive", (data) => {
  const message = createMsg(data);
  chat.appendChild(message);
  chat.scrollTo(0, chat.scrollHeight);
});

function getTime() {
  const date = new Date();
  let hour = date.getHours();
  const am_pm = hour > 12 ? "PM" : "AM";
  hour = hour > 12 ? `0${hour - 12}` : hour;
  const time = `${hour}:${date.getMinutes() + am_pm}`;
  return time;
}

function getUsername(cookie) {
  cookie = '{"' + cookie.replace("=", '":"') + '"}';
  cookie = cookie.replace(";", ",");
  cookie = JSON.parse(cookie);
  return cookie.username;
}

function createMsg(data) {
  const msg = document.createElement("p");

  const spanTime = document.createElement("span");
  spanTime.className = "msg-time";
  spanTime.textContent = data.time;
  msg.appendChild(spanTime);

  const spanUsername = document.createElement("span");
  spanUsername.className = "msg-username";
  spanUsername.textContent = data.username + ":";
  msg.appendChild(spanUsername);

  const spanMsg = document.createElement("span");
  spanMsg.className = "msg-content";
  spanMsg.textContent = data.msg;
  msg.appendChild(spanMsg);
  return msg;
}

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
  } else {
    input.style.borderColor = "red";
    input.className = "invalid-input";
    setTimeout(() => {
      input.className = "";
    }, 500);
  }
}
