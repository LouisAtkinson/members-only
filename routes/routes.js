const express = require("express");
const router = express.Router();

const user_controller = require("../controllers/userController");
const post_controller = require("../controllers/postController");

router.get("/", post_controller.index);

router.get("/sign-in", user_controller.sign_in_get);

router.post("/sign-in", user_controller.sign_in_post);

router.get("/register", user_controller.register_get);

router.post("/register", user_controller.register_post);

router.get("/sign-out", user_controller.sign_out_get);

router.get("/create-post", post_controller.create_post_get);

router.post("/create-post", post_controller.create_post_post);

module.exports = router;