// fuck you express

var db = require('./db');
var viewz = require('./views');
var port = process.env.PORT || 8888;

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var session = require('client-sessions');
var bcrypt = require('bcrypt');
var saltRounds = 10; // ????

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  cookieName: 'session',
  secret: 'still dont understand what this is; prolly should be in config file somewhere',
  duration: 1800000,
  activeDuration: 300000 // literally not using this tho. zach will probably make me incorporate this shit next time
}));

app.get('/signup', function(req, res) {
  if (!req.session.user) {
    res.send(viewz.sign_up());
  } else {
    res.redirect('/');
  }
});

app.post('/signup', function(req, res) {
  var u = req.body.user;
  var p = req.body.pass;
  var n = req.body.humanName;
  // ugh i should case insensitive this
  // but i wont because i dont care
  db.qq('SELECT username FROM userz WHERE username = $1', [u], function(err, result) {
    if (result.rows.length < 1) {
      // why the fuck is this nested
      // great i have to hash this password and when the hashing is done i will stick this disgusting blob in the callback
      bcrypt.hash(p, saltRounds, function(err, hash) {
        db.qq('INSERT INTO userz (username, password, humanName) VALUES ($1, $2, $3) RETURNING username, humanName', [u, hash, n], function(err, newUser) {
          var user = newUser.rows[0]; // this is seriously the same shit as u and n i don't have to do this.
          req.session.user = {
            username: user.username,
            humanName: user.humanname
          };
          res.redirect('/');
        });
      });
    } else {
      // username taken
      res.send(viewz.username_taken(u));
    }
  });
});

app.get('/login', function(req, res) {
  if (!req.session.user) {
    res.send(viewz.log_in());
  } else {
    res.redirect('/');
  }
});

app.post('/login', function(req, res) {
  var u = req.body.user;
  var p = req.body.pass;
  db.qq('SELECT username, password, humanname FROM userz WHERE username = $1', [u], function(err, result) {
    if (result.rows.length < 1) {
      // bad login
      res.send(viewz.bad_login());
    } else {
      // compare password
      var user = result.rows[0];
      bcrypt.compare(p, user.password, function(err, check) {
        if (!check) {
          res.send(viewz.bad_login());
        } else {
          // why did i do this twice i should write a helper fn
          req.session.user = {
            username: user.username,
            humanName: user.humanname
          };
          res.redirect('/');
        }
      });
    }
  });
});

app.post('/logout', function(req, res) {
  req.session.reset();
  res.redirect('/');
});

app.all('/', function(req, res) {
  if (req.session && req.session.user) {
    // how many times do i need to do this. isn't there a fucking way to check the timestamp esp if i _just_ logged in
    // this is idiotic but i dont care enough to stick a timestamp in my session and then write the logic to check it. i can't find documentation on how specifying the duration at the top affects session length and i don't care cuz i'll probably have to deal with this in zach's next project
    db.qq('SELECT username FROM userz WHERE username = $1', [req.session.user.username], function(err, result) {
      if (result.rows.length < 1) {
        req.session.reset();
        res.send(viewz.logged_out_home());
      } else {
        res.send(viewz.logged_in_home(req.session.user));
      }
    });
  } else {
    res.send(viewz.logged_out_home());
  }
});

app.listen(port);
