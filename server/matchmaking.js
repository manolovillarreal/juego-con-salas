const crypto = require("crypto");
const { Game } = require("./game");

let matches = [];
let searchPlayers = [];
let startingMatches = [];

const addPlayer = (player) => {
  player.searching = true;
  searchPlayers.push(player);

  //MatchMaking
  if (searchPlayers.length >= 4) {
    let players = searchPlayers.slice(0, 4);
    let match = new Match(players);
    console.log("new Match Ready:", match.id);
    //console.log("Playes:", players);

    matches.push(match);
    startingMatches.push(match);

    searchPlayers = searchPlayers.slice(4);
  }
};

class Match {
  constructor(players) {
    this.id = crypto.randomBytes(20).toString("hex");
    this.players = players;
    this.game = new Game();
  }
  startGame() {
    this.game.Start(this.players);
  }
}

module.exports = {
  addPlayer,
  startingMatches,
  matches,
};
