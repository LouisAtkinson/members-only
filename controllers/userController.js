const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.register_get = (req, res) => {
    res.render("register", {
      user: req.user,
      title: "Register",
      errors: null,
    });
};
  
exports.register_post =  [
    body("first_name")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("First name must be specified."),
    body("last_name")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Last name must be specified."),
    body("username")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Username must be specified."),
    body("password")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Password must be specified."),
    body("passwordConfirmation")
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Password confirmation field must match password field."),
    (req, res, next) => {
  
      const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          res.render("register", {
            user: req.user,
            title: "Register",
            errors: errors.array(),
          });
          return;
        }
    
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
          const user = new User({
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              username: req.body.username,
              password: hashedPassword
          }).save(err => {
              if (err) { 
                return next(err);
              }
              res.redirect("/");
          });
      });
}];
  
exports.sign_in_get = (req, res) => {
    res.render("sign-in", {
      user: req.user,
      title: "Sign in",
    });
};
  
exports.sign_in_post = passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/sign-in",
});
  
exports.sign_out_get = (req, res, next) => {
      req.logout(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
};
  