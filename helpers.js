const generateRandomString = function() {
  return Math.random().toString(36).substr(2, 6);
};

const getUserByEmail = function(newEmail, users) {
  for (const userId in users) {
    if (users[userId].email === newEmail) {
      return userId;
    }
  }
};

const urlsForUser = function(userId, urlDatabase) {
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