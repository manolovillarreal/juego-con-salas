class Game {
  constructor() {
    this.CANVAS_WIDTH = 500;
    this.CANVAS_HEIGHT = 400;
    this.LOOP_PERIOD = 5;
    this.MAX_COINS = 50;
    this.STATE = {
      players: [],
      coins: [],
    };
    this.inputs = [];
    this.loop;
    this.spawners = [];
  }
  Start(players) {
    players.forEach((player) => {
      this.spawnPlayer(player);
    });
    this.loop = setInterval(
      function () {
        this.Update();
      }.bind(this),
      this.LOOP_PERIOD
    );
    this.spawners.push(
      setInterval(
        function () {
          this.spawnCoin();
        }.bind(this),
        Math.floor(Math.random() * 2000) + 1000
      )
    );
  }
  Update() {
    if (this.STATE.players) {
      this.STATE.players.forEach((player) => {
        this.processInputs(player);
        this.STATE.coins = this.STATE.coins.filter((coin) => {
          if (!coin.take(player)) {
            return coin;
          } else {
            player.score += coin.radius;
          }
        });
      });
    }
  }
  spawnPlayer(player) {
    this.STATE.players.push(
      new Player(
        player.id,
        player.username,
        Math.floor(Math.random() * (this.CANVAS_WIDTH - 10)) + 10,
        Math.floor(Math.random() * (this.CANVAS_HEIGHT - 10)) + 10
      )
    );
    this.inputs[player.id] = [
      {
        horizontal: 0,
        vertical: 0,
        sequence: 0,
      },
    ];
  }
  removePlayer(id) {
    this.STATE.players = this.STATE.players.filter((player) => player.id != id);
  }
  setAxis(id, axis) {
    this.inputs[id].push(axis);
  }
  spawnCoin() {
    if (this.STATE.coins.length <= this.MAX_COINS) {
      let x = Math.floor(Math.random() * (this.CANVAS_WIDTH - 10)) + 10;
      let y = Math.floor(Math.random() * (this.CANVAS_HEIGHT - 10)) + 10;
      this.STATE.coins.push(new Coin(x, y));
    }
  }
  processInputs(player) {
    let playerInputs = this.inputs[player.id];
    if (playerInputs.length > 0) {
      let input = playerInputs.shift();
      if (
        input.horizontal > 0 &&
        player.x < this.CANVAS_WIDTH - player.radius
      ) {
        player.x += player.speed;
      } else if (input.horizontal < 0 && player.x > 0 + player.radius) {
        player.x -= player.speed;
      }
      if (input.vertical > 0 && player.y < this.CANVAS_HEIGHT - player.radius) {
        player.y += player.speed;
      } else if (input.vertical < 0 && player.y > 0 + player.radius) {
        player.y -= player.speed;
      }
      player.sequence = input.sequence;
    }
  }
}

//////////////////////////////////
//////////////PALYER CLASS/////////
class Player {
  constructor(id, username, x, y) {
    console.log(`New Player at (${x},${y})`);
    this.id = id;
    this.username = username;
    this.sequence = 0;
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.speed = 5;
    this.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    this.score = 0;
  }
}

//////////////////////////////////
//////////////COIN CLASS//////////
class Coin {
  constructor(x, y) {
    //this.id = crypto.randomBytes(20).toString("hex");
    this.x = x;
    this.y = y;
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

module.exports = {
  Game,
};
