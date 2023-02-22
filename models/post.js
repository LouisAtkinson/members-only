const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  timestamp: { type: Date, required: true },
  text: { type: String, required: true },
});

PostSchema.virtual("url").get(function () {
  return `/catalogue/Post/${this._id}`;
});

PostSchema.virtual("time").get(function () {
    return this.timestamp ? DateTime.fromJSDate(this.timestamp).toFormat("yyyy-MM-dd, HH:mm") : '';
});

module.exports = mongoose.model("Post", PostSchema);