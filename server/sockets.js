const { io } = require("./server");
//const game = require("./game-logic/game.server");
const matchmaking = require("./matchmaking");

const TIME_STEP = 200;

let onlineUsers = [];
let clients = {};
let matchesByClient = {};
function validation(username) {
  return true;
}

//Middleware para autenticacion
io.use((client, next) => {
  let username = client.handshake.query.username;
  console.log("Middleware: validando conexion ", username, client.id);
  if (validation(username)) {
    return next();
  }
  //client.disconnect();
  return next(new Error("authentication error"));
});

io.on("connection", (client) => {
  let username = client.handshake.query.username;
  console.log("Usuario Conectado", username, client.id);
  let user = { id: client.id, username: username };
  console.log("Usuario Conectado", user);

  clients[client.id] = client;
  onlineUsers.push(user);

  client.emit("welcome", {
    message: "Bienvenido al Lobby",
    id: client.id,
    onlineUsers,
  });
  updateOnlineUser(client, "Se ha Conectado un usuario", user);

  client.on("searchMatch", () => {
    let user = onlineUsers.find((user) => user.id == client.id);
    console.log(`${user.username} esta buscando partida`);
    matchmaking.addPlayer(user);
    console.log(user);
  });

  //game.spawnPlayer(client.id, username);
  // client.emit("welcomeMessage", {
  //   message: "Bienvenido al juego",
  //   id: client.id,
  //   state: game.STATE,
  // });

  client.on("move", (axis) => {
    matchesByClient[client.id].game.setAxis(client.id, axis);
  });
  client.broadcast.emit("userConnection", {
    message: "Se ha conectado un nuevo usuario",
  });

  //Listeners
  client.on("broadcastEmit", (data, callback) => {
    console.log("Cliente:", data);
    client.broadcast.emit("broadcastEmit", data);
    //callback({ message: "El mensaje fue recibido correctamente" });
  });
  client.on("disconnect", () => {
    // game.removePlayer(client.id);
    let user = onlineUsers.find((user) => user.id === client.id);
    console.log("Usuario desconectado", user);
    onlineUsers = onlineUsers.filter((user) => user.id != client.id);
    if (clients[clients.id]) clients[client.id] = null;
    updateOnlineUser(client, "Se ha desconectado un usuario", user);
  });
});

const updateOnlineUser = (client, message, user) => {
  client.broadcast.emit("onlineUsers", {
    message,
    user,
    onlineUsers,
  });
};
const startMatchReady = (match) => {
  let room = match.id;
  for (const player of match.players) {
    player.room = room;
    clients[player.id].join(room);
    matchesByClient[player.id] = match;
  }
  io.to(room).emit("matchReady", {
    message: "Match Ready",
    match: match.id,
  });
  match.startGame();
  setInterval(() => {
    io.to(room).emit("updateState", { state: match.game.STATE });
  }, TIME_STEP);
};

setInterval(() => {
  if (matchmaking.startingMatches.length > 0) {
    let matchReady = matchmaking.startingMatches.shift();
    console.log("Staring Match: " + matchReady.id);
    startMatchReady(matchReady);
  }
}, 1000);

// setInterval(() => {
//   io.emit("updateState", { state: game.STATE });
// }, TIME_STEP);
