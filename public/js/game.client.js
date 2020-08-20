var divPlayers;
var lblScore;
var checkPrediction;
var checkReconciliation;
var checkInterpolation;

var canvas;
var ctx;

var coins = [];
var players = [];
var clientPrediction = false;
var serverReconciliation = false;
var entityInterpolation = false;
var entityStates = [];
let playerId;

document.addEventListener("playerMove", playerMove, false);
import { axis } from "./modules/controls.js";
let playerInputs = [];

function drawPlayer(player) {
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = player.color;
  ctx.fill();
  ctx.closePath();
}
function drawCoin(coin) {
  ctx.beginPath();
  ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#f5d142";
  ctx.fill();
  ctx.closePath();
}
function drawEntity(entity) {
  let present = entityStates[entity.id].shift();
  let past = entityStates[entity.id].shift();

  let visual = { x: 0, y: 0 };
  visual.x = past.x + (present.x - past.x) / 2;
  visual.y = past.y + (present.y - past.y) / 2;
  entity.x = visual.x;
  entity.y = visual.y;
  drawPlayer(entity);
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  players.forEach((player) => {
    if (player.id == playerId) {
      drawPlayer(player);
      lblScore.innerHTML = player.score;
    } else if (entityInterpolation) {
      if (entityStates[player.id]) {
        entityStates[player.id].push(player);
        if (entityStates[player.id].length >= 2) {
          drawEntity(player);
        } else {
          drawPlayer(player);
        }
      } else {
        entityStates[player.id] = [player];
      }
    } else {
      drawPlayer(player);
    }
  });
  coins.forEach((coin) => {
    drawCoin(coin);
  });
}

function showScores() {
  divPlayers.innerHTML = "";
  let leaderBoard = [...players].sort((a, b) => b.score - a.score); //.slice(0,limit);
  leaderBoard.forEach((player) => {
    divPlayers.innerHTML +=
      "<div>" + player.username + " | " + player.score + "</div>";
  });
}

function playerMove() {
  let input = {};
  Object.assign(input, axis);
  playerInputs.push(input);
}
function processInputs() {
  let player = players.find((p) => p.id == playerId);
  console.log("Processing state: ", player.sequence);
  playerInputs = playerInputs.filter(
    (input) => input.sequence > player.sequence
  );
  if (serverReconciliation) {
    playerInputs.forEach((input) => {
      console.log("processing input", input.sequence);
      if (input.horizontal > 0 && player.x < canvas.width - player.radius) {
        player.x += player.speed;
      } else if (input.horizontal < 0 && player.x > 0 + player.radius) {
        player.x -= player.speed;
      }
      if (input.vertical > 0 && player.y < canvas.height - player.radius) {
        player.y += player.speed;
      } else if (input.vertical < 0 && player.y > 0 + player.radius) {
        player.y -= player.speed;
      }
    });
  } else {
    if (axis.horizontal > 0 && player.x < canvas.width - player.radius) {
      player.x += player.speed;
    } else if (axis.horizontal < 0 && player.x > 0 + player.radius) {
      player.x -= player.speed;
    }
    if (axis.vertical > 0 && player.y < canvas.height - player.radius) {
      player.y += player.speed;
    } else if (axis.vertical < 0 && player.y > 0 + player.radius) {
      player.y -= player.speed;
    }
  }
  draw();
}
export function startGame(id) {
  console.log(id);
  playerId = id;

  //DOM References
  divPlayers = document.getElementById("divPlayers");
  lblScore = document.getElementById("score");
  checkPrediction = document.getElementById("checkPrediction");
  checkReconciliation = document.getElementById("checkReconciliation");
  checkInterpolation = document.getElementById("checkInterpolation");

  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext("2d");

  //OPTIONS
  checkPrediction.onclick = function () {
    clientPrediction = checkPrediction.checked;
  };
  checkReconciliation.onclick = function () {
    serverReconciliation = checkPrediction.checked;
  };
  checkInterpolation.onclick = function () {
    entityInterpolation = checkInterpolation.checked;
    console.log(entityInterpolation);
  };

  setInterval(draw, 10);
}
export function updateState(state) {
  players = state.players;
  coins = state.coins;
  if (clientPrediction) {
    processInputs();
  } else {
    draw();
  }
  showScores();
}

//setInterval(draw, 10);
