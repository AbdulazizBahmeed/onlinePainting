let color = "red";
const colors = document.getElementsByClassName("color");
for (let index = 0; index < colors.length; index++) {
  colors[index].addEventListener("click", changeColor);
}
function changeColor() {
  color = this.id;
  document.getElementsByClassName("selected")[0].classList.toggle("selected");
  this.classList.toggle("selected");
}

const socket = io();
socket.on("receive", (data) => {
  stroke(data.color);
  strokeWeight(4);
  line(data.x1, data.y1, data.x2, data.y2);
});

socket.on("join", (data) => {
  console.log(data.users);
});

socket.on("left", () => {
  console.log("hello");
});

let sketchWidth = document.getElementById("canvas").offsetWidth;
let sketchHeight = document.getElementById("canvas").offsetHeight;

function setup() {
  const myCanvas = createCanvas(sketchWidth-10, sketchHeight-10);
  myCanvas.parent("canvas");
  background(255);
  cursor("cursor.png");
}

function mouseDragged() {
  stroke(color);
  strokeWeight(4);
  let data = {
    color: color,
    x1: mouseX,
    y1: mouseY,
    x2: pmouseX,
    y2: pmouseY,
  };
  line(data.x1, data.y1, data.x2, data.y2);
  socket.emit("send", data);
}
