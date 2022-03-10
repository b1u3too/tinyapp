const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require("express");
const app = express();
app.use(cookieParser());
const PORT = 8080; //default port 8080
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "0078a1": {
    id: "0078a1", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "424224": {
    id: "424224", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

function generateRandomString() {
  return Math.random().toString(36).substr(2, 6);
};

function findUserByEmail(users, newEmail) {
  for (const userId in users) {
    if (users[userId].email === newEmail) return userId;
  }
  return false;
}

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
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies.user_id]
  };
  res.render("urls_index", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies.user_id]
  };
  res.render("urls_register", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies.user_id]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies.user_id]
  };
  res.render("urls_show", templateVars);
});

//redirect user to shortURL address requested
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/login", (req, res) => {
  if (req.cookies.user_id) {
    return res.redirect("/urls");
  }
  const templateVars = {
    user: users[req.cookies.user_id]
  }
  res.render("urls_login", templateVars);
});

//POST delete request to the database
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

//POST Edit request to server database
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL; //save new shortURL/longURL pair to the database
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  const email = req.body.email.trim();
  const password = req.body.password.trim();

  if (!email || !password ) return res.status(400).send("ERROR: Please input at least one character in both email and password");

  if (findUserByEmail(users, email)) return res.status(400).send("ERROR: Email address not available");

  const id = generateRandomString();
  users[id] = { id, email, password };

  res.cookie("user_id", id);
  res.redirect("/urls");
});

//POST log in existing user
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const id = findUserByEmail(users, email);

  if (!id) return res.status(403).send("Invalid credentials");
  if (password !== users[id].password) return res.status(403).send("Invalid credentials");

  res.cookie("user_id", id);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
})

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL; //save new shortURL/longURL pair to the database
  res.redirect(`/urls/${shortURL}`);
});

app.listen(PORT, () => {
  express
  console.log(`Example app listening on port ${PORT}`);
});