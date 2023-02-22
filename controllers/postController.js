const User = require("../models/user");
const Post = require("../models/post");
const { body, validationResult } = require("express-validator");

exports.index = (req, res) => {
    Post.find()
      .sort([["timestamp", "descending"]])
      .populate("author")
      .exec(function (err, list_posts) {
        if (err) {
          return next(err);
        }
        res.render("index", { 
            user: req.user,
            title: "Home",
            posts: list_posts,
        });
      });
};

exports.create_post_get = (req, res) => {
    res.render("create-post", { 
      user: req.user,
      title: "Create new post",
    });
};

exports.create_post_post = [
    body("text", "The post must be between 1 and 2000 characters long").trim().isLength({ min: 1, max: 2000 }).escape(),

    (req, res, next) => {
      const errors = validationResult(req);
  
      const post = new Post({ 
        author: req.user._id,
        text: req.body.text,
        timestamp: Date.now()
      });
  
      if (!errors.isEmpty()) {
        res.render("create-post", { 
            user: req.user,
            title: "Create new post",
            errors: errors.array()
          });
        return;
      } else {
            post.save((err) => {
              if (err) {
                return next(err);
              }
              res.redirect("/");
            });
      }
    }
];
