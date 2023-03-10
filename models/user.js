const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 50 },
  last_name: { type: String, required: true, maxLength: 50 },
  username: { type: String, required: true },
  password: { type: String, required: true},
  member: Boolean,
});

UserSchema.virtual("name").get(function () {
  let fullname = `${this.first_name} ${this.last_name}`;
  return fullname;
});

UserSchema.virtual("first_name_cap").get(function () {
  return `${this.first_name}`.charAt(0).toUpperCase() + `${this.first_name}`.slice(1);
});

module.exports = mongoose.model("User", UserSchema);