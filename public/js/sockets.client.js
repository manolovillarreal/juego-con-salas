import { startGame, updateState } from "./game.client.js";
import { axis } from "./modules/controls.js";
import { gameHtml } from "./modules/gameRender.js";

var socket;
var searching = false;
var searchInterval;

//Referencias DOM
var lblOnlinePlayers = document.getElementById("lblOnlinePlayers");
var btnBuscarPartida = document.getElementById("btnSearchMatch");
var lblSearching = document.getElementById("lblSearching");
var divLobby = document.getElementById("divLobby");
var divGame = document.getElementById("divGame");

const params = new URLSearchParams(window.location.search);
if (!params.has("username")) {
  window.location = "index.html";
  throw new Error("Ser requiere el username");
}
let username = params.get("username");
socket = io(window.location.host + "?username=" + username);
//Listeners
socket.on("connect", function () {
  console.log("Conexión exitosa");
});
socket.on("welcome", function (data) {
  console.log("Server: " + data.message);
  lblOnlinePlayers.innerHTML = data.onlineUsers.length;
});
socket.on("onlineUsers", function (data) {
  console.log("Server: " + data.message, data.user.username);
  lblOnlinePlayers.innerHTML = data.onlineUsers.length;
});
socket.on("matchReady", function (data) {
  console.log(data.message, data.match);
  divLobby.style.visibility = "hidden";
  divGame.style.visibility = "visible";
  divGame.innerHTML = gameHtml;
  document.addEventListener("playerMove", playerMove, false);
  startGame(socket.id);
});
socket.on("updateState", function (data) {
  updateState(data.state);
});
socket.on("disconnect", function () {
  window.location.reload();
});
//
btnBuscarPartida.onclick = function () {
  if (!searching) {
    socket.emit("searchMatch");
    matchSearchStart();
    this.innerHTML = "Cancelar";
    searching = true;
  } else {
    socket.emit("stopSearchMatch");
    matchSearchEnd();
    this.innerHTML = "Buscar Partida";
    searching = false;
  }
};

function playerMove() {
  socket.emit("move", axis);
}
function matchSearchStart() {
  searchInterval = setInterval(searchingAnimation, 400);
}
function matchSearchEnd() {
  clearInterval(searchInterval);
  lblSearching.innerHTML = "";
}
function searchingAnimation() {
  let searchText = lblSearching.innerHTML;
  if (searchText == "") {
    lblSearching.innerHTML = "Buscando";
  } else if (searchText.split(".").length < 4) {
    lblSearching.innerHTML += ".";
  } else {
    lblSearching.innerHTML = "Buscando";
  }
}
