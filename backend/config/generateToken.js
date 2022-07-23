const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, "ashwin", {
    expiresIn: "30d",
  });
  //I goona sign new Token with that paticulary unique id(send from userController.js)
  //and also we have to have jwt secrect
  //and third is in how much time this Token Expires
};

module.exports = generateToken;
