// first we will implemnet the chat input section
const nameInput = document.getElementById("name-input");
nameInput.addEventListener("input", () => {
  nameInput.style.borderColor = "";
});

nameInput.onkeydown = (e) => {
  console.log(e);
  if (e.code == "Enter" || e.code == "NumpadEnter" || e.keyCode == "13") enter.onclick();
};

const enter = document.getElementById("enter-button");
enter.onclick = () => {
  if (nameInput.value) {
    const now = new Date();
    now.setTime(now.getTime() + 2 * 3600 * 1000);
    document.cookie = `username=${
      nameInput.value
    }; expires=${now.toUTCString()}`;
    window.location = "/chatroom";
  } else {
    nameInput.style.borderColor = "red";
    nameInput.classList = "homepage-input invalid-input";
    setTimeout(() => {
      nameInput.classList = "homepage-input";
    }, 500);
    nameInput.focus();
  }
};

// second we handle the coputing of fibonacci
const fiboInput = document.getElementById("fibo-input");
fiboInput.addEventListener("input", () => {
  fiboInput.style.borderColor = "";
});

fiboInput.onkeydown = (e) => {
  if (e.code == "Enter" || e.code == "NumpadEnter" || e.keyCode == "13") compute.onclick();
};

const fiboResult = document.getElementById("fibo-result");
const compute = document.getElementById("compute-button");
compute.onclick = () => {
  const value = fiboInput.value;
  if ((value !== "") & (value >= 0) & (value <= 50)) {
    const result = computeFibo(value);
    fiboInput.value = "";
  } else {
    fiboResult.style.color = "red";
    fiboResult.innerText = "Out of range";
    fiboInput.style.borderColor = "red";
    fiboInput.classList = "homepage-input invalid-input";
    setTimeout(() => {
      fiboInput.classList = "homepage-input";
    }, 500);
    fiboInput.focus();
  }
};

async function computeFibo(number) {
  fiboResult.style.color = "dodgerblue";
  fiboResult.innerText = "Computing...";
  const response = await fetch(`/computeFibo/${number}`);
  if (response.ok) {
    const result = await response.json();
    setTimeout(() => {
      fiboResult.innerText = result.data;
    }, 400);
  } else {
    fiboResult.style.color = "red";
    fiboResult.innerText = "server Error";
  }
}
