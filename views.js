function viewThis(fuckery) {
  return function(u) {
    return '<html>' +
      '<head>' +
        '<title>what the fuck are templates</title>' +
      '</head>' +
      '<body>' +
        '<div>' +
          fuckery(u) +
        '</div>' +
      '</body>' +
    '</html>';
  }; 
}

function logged_out() {
  return '<p>you are not logged in</p>' +
  '<a href="/login">log in</a>' +
  '<br/>' + // cuz fu
  '<a href="/signup">sign up</a>';
}

function logged_in(u) {
  return '<p>Hi, ' + u.humanName + '</p>' +
  '<p>u logged in as ' + u.username + '</p>' +
  '<form action="/logout" method="post">' +
    '<input type="submit" value="log out" />' +
  '</form>';
}

function log_in() {
  return '<p>log in to existing account (or <a href="/signup">sign up for new account</a>)</p>' +
  '<form action="/login" method="post">' +
    '<input name="user" type="text" placeholder="username" />' +
    '<input name="pass" type="password" placeholder="password" />' +
    '<input type="submit" value="log in" />' +
  '</form>';
}

function sign_up() {
  return '<p>sign up for new account (or <a href="/login">log in to existing account</a>)</p>' +
  '<form action="/signup" method="post">' +
    '<input name="humanName" type="text" placeholder="real name" />' +
    '<input name="user" type="text" placeholder="username" />' +
    '<input name="pass" type="password" placeholder="password" />' +
    '<input type="submit" value="sign up" />' +
  '</form>';
}

function bad_login() {
  return '<p>bad login</p>' +
  '<a href="/login">try again</a>';
}

function username_taken(username) {
  return '<p>username "' + username + '" has been taken. choose another.</p>' +
  '<a href="/signup">back to signup</a>';
}

exports.logged_out_home = viewThis(logged_out);
exports.log_in = viewThis(log_in);
exports.sign_up = viewThis(sign_up);
exports.logged_in_home = viewThis(logged_in);
exports.bad_login = viewThis(bad_login);
exports.username_taken = viewThis(username_taken);
