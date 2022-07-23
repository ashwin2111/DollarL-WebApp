const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
/*
Name
Email
Password
Picture of the User
*/
/*We use this Model to structure our Data in Our Database*/
const userModel = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  {
    timestamps: true,
  }
);

userModel.methods.matchPassword = async function (enterredPassword) {
  return await bcrypt.compare(enterredPassword, this.password);
};

//means->>>before saving it will encrpt our password
userModel.pre("save", async function (next) {
  if (!this.isModified) {
    next(); //if current password is not modified then move on to the Next
  }

  //otherWise We ll generate the new Password
  /*
    bcrypt is a password-hashing function
    Hash(value)+salt(just like string/anything)->>>high secure
    1->generated the salt
    2->hash the whole password and the salt
  */
  const salt = await bcrypt.genSalt(10); //higher the number , the strong salt will be generated
  this.password = await bcrypt.hash(this.password, salt); //password + salt is hashed
});
const User = mongoose.model("User", userModel);
module.exports = User;
