const generateRandomString = function() {
  return Math.random().toString(36).substr(2, 6);
};

const getUserByEmail = function(users, newEmail) {
  for (const userId in users) {
    if (users[userId].email === newEmail) return userId;
  }
  return false;
};

const urlsForUser = function(urlDatabase, userId) {
  const result = {};

  for (const key in urlDatabase) {
    if (urlDatabase[key].userID === userId) {
      result[key] = urlDatabase[key];
    }
  }

  return result;
}

module.exports = {
  generateRandomString,
  getUserByEmail, 
  urlsForUser
};