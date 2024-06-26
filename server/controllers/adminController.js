const AllBlogs = require("../models/AllBlogs");
const User = require("../models/User");
const isAdmin = require("../utils/checkAdmin");

// ! check if user is admin

const checkAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await isAdmin(id);
    return res.status(200).send({ success: true, isAdmin: result });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// ! change user role to admin or user

const changeUserRole = async (req, res) => {
  try {
    const id = req.params.id;
    const role = req.body.role;
    const result = await User.findOneAndUpdate({ uid: id }, { role: role });
    return res.status(200).send({
      success: true,
      message: "Role updated successfully",
      result: result,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// ! delete user

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await User.findOneAndDelete({ uid: id });
    return res.status(200).send({
      success: true,
      message: "User deleted successfully",
      result: result,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// ! get all blogs on the admin pannel

const getAllBlogs = async (req, res) => {
  try {
    const query = req.query.status;

    let filter = {};

    if (query === "published" || query === "draft") {
      filter.status = query;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const blogs = await AllBlogs.find(filter)
      .limit(limit)
      .skip(skip)
      .sort({ published: -1 })
      .select("-content -__v -authorId -authorImg");

    if (blogs.length === 0)
      return res.status(404).json({ error: "No blogs found" });

    return res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    return res.status(500).json({ data: "Server Error" });
  }
};

// ! get total number of blogs for pagination

const totalBlogsCount = async (req, res) => {
  try {
    const query = req.query.status;

    let filter = {};

    if (query === "published" || query === "draft") {
      filter.status = query;
    }

    const count = await AllBlogs.countDocuments(filter);
    const totalPage = await Math.ceil(count / 5);
    return res.status(200).json({ success: true, data: totalPage });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
};

// ! change blog status to published or draft

const changeBlogStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;
    const result = await AllBlogs.findOneAndUpdate(
      { _id: id },
      { status: status }
    );

    return res.status(200).send({
      success: true,
      message: "Blog status updated successfully",
      result: result,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// ! delete blog

const deleteBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await AllBlogs.findOneAndDelete({ _id: id });
    return res.status(200).send({
      success: true,
      message: "Blog deleted successfully",
      result: result,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

module.exports = {
  checkAdmin,
  changeUserRole,
  deleteUser,
  getAllBlogs,
  totalBlogsCount,
  changeBlogStatus,
  deleteBlog,
};
