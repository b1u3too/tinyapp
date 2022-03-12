const bodyParser = require('body-parser');
const { generateRandomString, getUserByEmail, urlsForUser } = require('./helpers');
const cookieSession = require('cookie-session');
const express = require("express");
const { restart } = require('nodemon');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const PORT = 8080; //default port 8080

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "424224"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};

const users = {
  "0078a1": {
    id: "0078a1",
    email: "user@example.com",
    hashPass: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  "424224": {
    id: "424224",
    email: "user2@example.com",
    hashPass: bcrypt.hashSync("dishwasher-funk", 10)
  }
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  if (!req.session.user_id) {
    return res.redirect("/notAuthorized");
  }
  const templateVars = {
    urls: urlsForUser(req.session.user_id, urlDatabase),
    user: users[req.session.user_id]
  };
  res.render("urls_index", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.session.user_id]
  };
  res.render("urls_register", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    return res.redirect("/notAuthorized");
  }
  const templateVars = {
    urls: urlDatabase,
    user: users[req.session.user_id]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const cookieID = req.session.user_id;
  const shortURL = req.params.shortURL;

  if (!urlDatabase.hasOwnProperty(shortURL)) {
    return res.status(404).send("The requested page does not exist");
  }

  if (!req.session.user_id || urlDatabase[req.params.shortURL].userID !== cookieID) {
    return res.redirect("/notAuthorized");
  }
  const templateVars = {
    shortURL: shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user: users[req.session.user_id]
  };
  res.render("urls_show", templateVars);
});

app.get("/notAuthorized", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id]
  }
  res.render("urls_pleaseAuth", templateVars);
});

//redirect user to shortURL address requested
app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    return res.status(404).send("Invalid short link ID!");
  }

  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.get("/login", (req, res) => {
  if (req.session.user_id) {
    return res.redirect("/urls");
  }
  const templateVars = {
    user: users[req.session.user_id]
  };
  res.render("urls_login", templateVars);
});

//POST delete request to the database
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!req.session.user_id) {
    return res.status(401).send("You are not authorized to delete this link\n");
  }

  if (req.session.user_id !== urlDatabase[shortURL].userID) {
    return res.status(401).send("You are not authorized to delete this link\n");
  }
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

//POST Edit request to server database
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;

  if (!req.session.user_id) {
    return res.status(401).send("You are not authorized to edit this link\n");
  }

  if (req.session.user_id !== urlDatabase[shortURL].userID) {
    return res.status(401).send("You are not authorized to edit this link\n");
  }

  urlDatabase[shortURL].longURL = req.body.longURL;
  res.redirect("/urls");
});

//POST register new user
app.post("/register", (req, res) => {
  const email = req.body.email.trim();
  const password = req.body.password.trim();

  if (!email || !password) {
    return res.status(400).send("ERROR: Please input at least one character in both email and password");
  }

  if (getUserByEmail(email, users)) {
    return res.status(400).send("ERROR: Email address not available");
  }

  const id = generateRandomString();
  const hashPass = bcrypt.hashSync(password, 10);
  users[id] = { id, email, hashPass };

  req.session.user_id = id;
  res.redirect("urls");
});

//POST log in existing user
app.post("/login", (req, res) => {
  const email = req.body.email;
  const passwordIn = req.body.password;
  const id = getUserByEmail(email, users);

  if (!id) {
    return res.status(403).send("Invalid credentials");
  }
  if (bcrypt.compareSync(users[id].hashPass, passwordIn)) {
    return res.status(403).send("Invalid credentials");
  }

  req.session.user_id = id;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  if (!req.session.user_id) {
    return res.status(401).send("Unauthorized action");
  }
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = { longURL: req.body.longURL, userID: req.session.user_id };
  res.redirect(`/urls/${shortURL}`);
});

app.listen(PORT, () => {
  express;
  console.log(`Example app listening on port ${PORT}`);
});