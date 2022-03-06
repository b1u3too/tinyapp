const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require("express");
const app = express();
const PORT = 8080; //default port 8080

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  return Math.random().toString(36).substr(2, 6);
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
  const templateVars = {
    urls: urlDatabase,
    username: ""
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: ""
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  console.log(req.params);
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  console.log("Delete request recieved", req.params);
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

//POST Edit request to server database
app.post("/urls/:shortURL", (req, res) => {
  console.log(req.body); //Log the POST request body to the Console
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL; //save new shortURL/longURL pair to the database
  res.redirect("/urls");
});

//POST username
app.post("/login", (req, res) => {
  console.log(req.body);
  const username = req.body.username;
  res.cookie("username", username);
  res.redirect("/urls");
})

app.post("/urls", (req, res) => {
  console.log(req.body); //Log the POST request body to the Console
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL; //save new shortURL/longURL pair to the database
  res.redirect(`/urls/${shortURL}`);
});

app.listen(PORT, () => {
  express
  console.log(`Example app listening on port ${PORT}`);
});