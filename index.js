// var handler = function(req, res) {
//   fs.readFile('./page.html', function (err, data) {
//     if(err) throw err;
//     res.writeHead(200);
//     res.end(data);
//   });
// };

var handler = function(req, res) {
  var request = require('url').parse(req.url, true);
  var action = request.pathname;

  if (action == '/logo.jpg') {
    var img = fs.readFileSync('./logo.jpg');
    res.writeHead(200, {'Content-Type': 'image/jpg'});
    res.end(img, 'binary');
  } else if (action == '/logo.gif') {
    var img = fs.readFileSync('./logo.gif');
    res.writeHead(200, {'Content-Type': 'image/gif'});
    res.end(img, 'binary');
  } else if (action == '/track.jpg') {
    var img = fs.readFileSync('./track.jpg');
    res.writeHead(200, {'Content-Type': 'image/jpg'});
    res.end(img, 'binary');
  } else if (action == '/favicon.ico') {
    var img = fs.readFileSync('./favicon.ico');
    res.writeHead(200, {'Content-Type': 'image/x-icon'});
    res.end(img, 'binary');
  } else {
    var page = fs.readFile('./page.html', function (err, html) {
      if(err) throw err;
      res.writeHead(200, {"Content-Type": "text/html"});
      res.write(html);
      res.end(page);
    });
  }
};

var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var Faker = require('Faker');
var port = 3250;

app.listen(port);

// math game logic
function randomOp() {
  mathOps = ["+", "-"]
  var i = Math.floor((Math.random()*2));
  return mathOps[i];
}

function Operation() {
  var self = this;
  var num1 = Math.floor((Math.random()*30));
  var num2 = Math.floor((Math.random()*30));

  var operation_type = randomOp();
  self.quest =  num1 + operation_type + num2;
  self.solution = eval(self.quest);
}

var operation = new Operation();

// socket.io
io.sockets.on('connection', function(socket) {
  var user = addUser();
  socket.emit("welcome", user);
  newGame();

  socket.on('disconnect', function() {
    removeUser(user);
  });

  socket.on('solve_operation', function(data) {
    if (data.operation == operation.solution){
      user.points += 1;
    } else if (user.points>0) {
      user.points -= 1;
    };
    updateUsers();
    if (user.points == 5) {
      user.wins += 1;
      disableInput();
      io.sockets.emit("win", { message: "<strong>" + user.name + "</strong> wins!", winner: user.name });
      setTimeout(function(){resetUsers()}, 5000);
    } else {
      newEquation();
    }
  });

});

// original game logic
var users = [];

// real-time user logic
var addUser = function() {
  var user = {
    name: Faker.random.catch_phrase_adjective(),
    points: 0,
    wins: 0
  };
  users.push(user);
  updateUsers();
  return user;
};

var removeUser = function(user) {
  for(var i=0; i<users.length; i++) {
    if(user.name === users[i].name) {
      users.splice(i, 1);
      updateUsers();
      return;
    }
  }
};

var newEquation = function() {
  operation =  new Operation();
  io.sockets.emit("new_operation", operation.quest);
};

var enableInput = function() {
  io.sockets.emit("enable", {state: "disabled"});
};

var disableInput = function() {
  io.sockets.emit("disable", {state: "disabled"});
};

var resetUsers = function() {
  for(var i=0; i<users.length; i++) {
    users[i].points = 0;
    console.log("Users[" + i + "] reset");
  }
  updateUsers();
  io.sockets.emit("win", { message: "Who will our winner be?" });
  enableInput();
  newEquation();
  console.log("RESULTS RESET!");
  return;
};

var updateUsers = function() {
  var userArray = users.sort(function(a, b) {
    return b.wins-a.wins;
  });
  var str = '<table border="0" cellpadding="0" cellspacing="0">';
  str += '<tr><td width="180">Player Ranking</td><td width="500"></td><td class="pts" width="60">Points</td><td class="wins" width="60">Wins</td></tr>';
  for(var i=0; i<userArray.length; i++) {
    var user = userArray[i];
    // str += '<tr class="' + user.name + '"><td><small>' + (i+1) + ') ' + user.name + '</small></td><td><meter value="' + user.points + '" min="0" max="5">' + user.points + ' out of 5</meter></td><td class="pts"><small><span>' + user.points + '</span></small></td><td class="wins"><small><span>' + user.wins + '</span></small></td></tr>';
    str += '<tr class="' + user.name + '"><td><small>' + (i+1) + ') ' + user.name + '</small></td><td><div class="race" style="margin-left:' + (user.points*94-1) + 'px;"></div></td><td class="pts"><small><span>' + user.points + '</span></small></td><td class="wins"><small><span>' + user.wins + '</span></small></td></tr>';
  }
  str += '</table>';
  io.sockets.emit("users", { users: str });
};

var newGame = function() {
  io.sockets.emit("new_operation", operation.quest);
};