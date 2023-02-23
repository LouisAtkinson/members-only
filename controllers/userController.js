const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.register_get = (req, res) => {
    res.render("register", {
      user: req.user,
      title: "Register",
      errors: null,
      input: {
        first_name: '',
        last_name: '',
        username: '',
        password: '',
        passwordConfirmation: '',
      },
    });
};
  
exports.register_post =  [
    body("first_name")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("First name must be specified"),
    body("last_name")
      .trim()
      .isLength({ min: 1 })
      .escape()
      .withMessage("Last name must be specified"),
    body("username")
      .trim()
      .isLength({ min: 3 })
      .escape()
      .withMessage("Username must be at least 3 characters long"),
    body("password")
      .trim()
      .isLength({ min: 5 })
      .escape()
      .withMessage("Password must at least 5 characters long"),
    body('passwordConfirmation').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
    
      return true;
    }),
    (req, res, next) => {
  
      const errors = validationResult(req);

      const input = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: req.body.password,
        passwordConfirmation: req.body.passwordConfirmation
      }
    
      if (!errors.isEmpty()) {
          res.render("register", {
            user: req.user,
            input,
            title: "Register",
            errors: errors.array(),
          });
          return;
      }
      
      User.findOne({ username: req.body.username }).exec((err, found_user) => {
        if (err) {
          return next(err);
        }

        if (found_user) {
          res.render("register", {
            user: req.user,
            title: "Register",
            errors: [{ msg: "Username already taken" }],
            input,
          });
          return;

        } else {

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
        };
      });
      
}];
  
exports.sign_in_get = (req, res) => {
    res.render("sign-in", {
      user: req.user,
      title: "Sign in",
      error: req.flash("error"),
    });
};
  
exports.sign_in_post = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/sign-in",
    failureFlash: true 
});


  
exports.sign_out_get = (req, res, next) => {
      req.logout(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
};
  