const express = require("express");
const verifyToken = require("../middlewares/tokenVerification");
const {
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const userRouter = express.Router();

userRouter.route("/").post(createUser);

userRouter
  .route("/:id")
  .get(getUser)
  .put(verifyToken, updateUser)
  .delete(verifyToken, deleteUser);

module.exports = userRouter;
