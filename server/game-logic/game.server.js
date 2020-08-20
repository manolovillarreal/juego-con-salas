const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 400;
const LOOP_PERIOD = 10;
const STATE = {
  players: [],
  coins: [],
};

let inputs = [];

const spawnPlayer = (id, username) => {
  STATE.players.push(
    new Player(
      id,
      username,
      Math.floor(Math.random() * (CANVAS_WIDTH - 10)) + 10,
      Math.floor(Math.random() * (CANVAS_HEIGHT - 10)) + 10
    )
  );
  inputs[id] = [
    {
      horizontal: 0,
      vertical: 0,
      sequence: 0,
    },
  ];
};

class Player {
  constructor(id, username, x, y) {
    console.log(`New Player at (${x},${y})`);
    this.id = id;
    this.username = username;
    this.sequence = 0;
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.speed = 10;
    this.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    this.score = 0;
  }
}
class Coin {
  constructor() {
    this.x = Math.floor(Math.random() * (CANVAS_WIDTH - 10)) + 10;
    this.y = Math.floor(Math.random() * (CANVAS_HEIGHT - 10)) + 10;
    this.points = 1;
    this.radius = Math.floor(Math.random() * 15) + 5;
    this.taken = false;
  }
  take(player) {
    if (!this.taken) {
      let dx = player.x - this.x;
      let dy = player.y - this.y;
      let rSum = this.radius + player.radius;

      return dx * dx + dy * dy <= rSum * rSum;
    }
  }
}
function setAxis(id, axis) {
  inputs[id].push(axis);
}
function spawnCoin() {
  if (STATE.coins.length <= 50) {
    let newCoin = new Coin();
    STATE.coins.push(newCoin);
  }
}

const update = () => {
  if (STATE.players) {
    STATE.players.forEach((player) => {
      processInputs(player);
      STATE.coins = STATE.coins.filter((coin) => {
        if (!coin.take(player)) {
          return coin;
        } else {
          player.score += coin.radius;
        }
      });
    });
  }
};

function processInputs(player) {
  let playerInputs = inputs[player.id];
  if (playerInputs.length > 0) {
    let input = playerInputs.shift();
    console.log(input);
    if (input.horizontal > 0 && player.x < CANVAS_WIDTH - player.radius) {
      player.x += player.speed;
    } else if (input.horizontal < 0 && player.x > 0 + player.radius) {
      player.x -= player.speed;
    }
    if (input.vertical > 0 && player.y < CANVAS_HEIGHT - player.radius) {
      player.y += player.speed;
    } else if (input.vertical < 0 && player.y > 0 + player.radius) {
      player.y -= player.speed;
    }
    player.sequence = input.sequence;
  }
}

const removePlayer = (id) => {
  STATE.players = STATE.players.filter((player) => player.id != id);
};

setInterval(update, LOOP_PERIOD);
setInterval(spawnCoin, Math.floor(Math.random() * 2000) + 1000);

module.exports = {
  spawnPlayer,
  STATE,
  setAxis,
  removePlayer,
  update,
};
