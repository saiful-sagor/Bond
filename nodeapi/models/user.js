const mongoose = require("mongoose");
// const v1 = require('uuid'); not working now
const { v4: uuidv4 } = require('uuid');
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  hashed_password: {
    type: String,
    required: true,
  },
  salt: String,
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
});

// Virtual fielsd are aditional fields for a given model
// their values can be set manually or automatically with defined functionality.
// virtual properties(password) don't get persisted in the database
// they only exist logically and are not written to the doccuments collections

//Virtal field

userSchema
  .virtual("password")
  .set(function (password) {
    //create temporary variable called password
    this._password = password;
    // generate a timestamp
    this.salt = uuidv4();
    //encrypt the password()
    this.hashed_password = this.encryptPassword(password);
  })

  .get(function () {
    return this._password;
  });

//methods
userSchema.methods = {

  authenticate: function(plaintext){
       return this.encryptPassword(plaintext) === this.hashed_password
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto.createHmac("sha1", this.salt).update(password).digest("hex");
    } catch (err) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema);
