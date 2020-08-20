const fs = require("fs");

let users = [];
let leaderboard = [];

const loadUserDB = () => {
  try {
    users = require("./db/users.json");
  } catch (error) {
    users = [];
  }
};

const loadLeaderboardDB = () => {
  try {
    leaderboard = require("./db/leaderboard.json");
  } catch (error) {
    leaderboard = [];
  }
};
loadUserDB();
loadLeaderboardDB();

const getUser = async (id) => {
  const user = users.find((user) => user.id == id);
  if (!user) {
    throw new Error(`No existe el usuario con id: ${id}`);
  } else {
    return user;
  }
};

const saveUsersBD = () => {
  return new Promise((resolve, reject) => {
    //Cuerpo de la promesa
    let data = JSON.stringify(users);
    fs.writeFile("db/users.json", data, (err) => {
      if (err) {
        reject("Error gudardando el archivo de usuarios");
      } else {
        console.log("save ok");
        resolve(true);
      }
    });
  });
};

const saveScoresBD = () => {
  return new Promise((resolve, reject) => {
    //Cuerpo de la promesa
    let data = JSON.stringify(leaderboard);
    fs.writeFile("db/leaderboard.json", data, (err) => {
      if (err) {
        reject("Error gudardando el archivo de puntajes");
      } else {
        console.log("save ok");
        resolve(true);
      }
    });
  });
};

async function getScore(user) {
  const score = leaderboard.find((score) => score.userId == user.id);
  if (!score) {
    throw new Error(`El usuario ${user.username} no registra puntaje`);
  } else {
    return score;
  }
}

const getUserScore = async (id) => {
  const user = await getUser(id);
  const score = await getScore(user);
  return `${user.username}    |    ${score.score}`;
};

const addUser = async (username) => {
  const user = users.find((user) => user.username === username);
  if (user) {
    throw new Error(`El nombre de usuarios ${username} ya esta registrado`);
  }
  let newUser = {
    id: users.length + 1,
    username,
  };
  users.push(newUser);

  await saveUsersBD();
  return newUser;
};

const addScore = async (userId, score) => {
  const _scores = leaderboard.filter((score) => score.userId != userId);
  let newScore = {
    userId,
    score,
  };
  _scores.push(newScore);

  leaderboard = [..._scores];
  await saveScoresBD();
  return newScore;
};

const getUsers = async (limit = 10) => {
  let query = users.slice(0, limit);
  return JSON.stringify(query);
};
const getLeaderboard = async (limit = 10) => {
  // let query = leaderboard
  //   .slice()
  //   .sort((a, b) => a.score - b.score)
  //   .slice(0, limit);
  let scores = [...leaderboard]
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  let resp = [];
  await scores.forEach(async (score) => {
    const user = await getUser(score.userId);
    resp.push({ username: user.username, score: score.score });
  });

  return JSON.stringify(resp);
};

module.exports = {
  getUserScore,
  addUser,
  addScore,
  getUsers,
  getLeaderboard,
};
