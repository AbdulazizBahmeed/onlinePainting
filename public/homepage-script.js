const input = document.getElementById("name-input");
input.addEventListener("input", () => {
  input.style.borderColor = "";
  if (input.value.length > 15) {
    setTimeout(function () {
      input.value = input.value.substr(0, 15);
    }, 150);
  }
});
input.onkeydown = (e) => {
  if (e.code == "Enter" || e.code == "NumpadEnter")
    enter.onclick();
};

const enter = document.getElementById("enter-button");
enter.onclick = () => {
  if (input.value) {
    const now = new Date();
    now.setTime(now.getTime() + 2 * 3600 * 1000);
    document.cookie = `username=${input.value}; expires=${now.toUTCString()}`;
    window.location = "/chatroom";
  } else {
    input.style.borderColor = "red";
    input.className = "invalid-input";
    setTimeout(() => {
      input.className = "";
    }, 500);
  }
};
