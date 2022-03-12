const { assert } = require('chai');

const {
  generateRandomString,
  getUserByEmail, 
  urlsForUser
} = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const testURLS = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "user2RandomID"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "user2RandomID"
  }
}

describe('getRandomString', () => {
  it('should return a string of length 6', () => {
    let testCase;
    for (let i = 0; i < 20; i++) {
      testCase = generateRandomString();
      assert.equal(testCase.length, 6);
    }
  });
});

describe('getUserByEmail', () =>  {
  it('should return a user with valid email', () => {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.equal(user, expectedUserID);
  });
  it('should return undefined if no user is registered with that email', () => {
    const user = getUserByEmail("nothere@gmail.com", testUsers);
    const expectedUserId = undefined;
    assert.equal(user, expectedUserId);
  });
});

describe('urlsForUser', () => {
  it('should return an object containing all URL objects belonging to the user', () => {
    const actual = urlsForUser("user2RandomID", testURLS);
    const expected = {
      b6UTxQ: {
        longURL: "https://www.tsn.ca",
        userID: "user2RandomID"
      },
      i3BoGr: {
        longURL: "https://www.google.ca",
        userID: "user2RandomID"
      }
    };
    assert.deepEqual(actual, expected);
  });
  it('should return an empty object if there are no URLs belonging to the user in the DB', () => {
    const actual = urlsForUser("nothereID", testURLS);
    const expected = {};
    assert.deepEqual(actual, expected);
  }); 
});