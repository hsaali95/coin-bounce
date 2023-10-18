const { json } = require("express");
const Joi = require("joi");
const fs = require("fs");
const Blob = require("../models/blog");
const { BACKEND_SERVER_PATH } = require("../config/index");
const BlogDTO = require("../dto/blog");

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const blogController = {
  async create(req, res, next) {
    // 1 validate body
    // 2 handle photo storage , name
    // 3 add to db
    // 4 return response

    // client side -> base 64 encode string -> decode -> save
    // photo;s path in db
    const createBlogSchema = Joi.object({
      title: Joi.string().required(),
      author: Joi.string().regex(mongodbIdPattern).required(),
      content: Joi.string().required(),
      photo: Joi.string().required(),
    });
    const { error } = createBlogSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { title, content, author, photo } = req.body;

    // read as buffer
    const buffer = Buffer.from(
      photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );

    // alot a random name
    const imagePath = `${Date.now()}-${author}.png`;

    // save locally
    try {
      fs.writeFileSync(`storage/${imagePath}`, buffer);
    } catch (error) {
      return next(error);
    }

    // save blob in db
    let newBlog;
    try {
      newBlog = new Blob({
        title,
        author,
        content,
        photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
      });
      await newBlog.save();
    } catch (error) {
      return next(error);
    }
    const blogDto = new BlogDTO(newBlog);

    return res.status(201).json({ blog: blogDto });
  },
  async getAll(req, res, next) {
    try {
      const blogs = await Blob.find({});
      const BlogsDto = [];
      for (let i = 0; i < blogs.length; i++) {
        const dto = new BlogDTO(blogs[i]);
        BlogsDto.push(dto);
      }
      return res.status(200).json({ blogs: BlogsDto });
    } catch (error) {
      return next(error);
    }
  },
  async getById(req, res, next) {},
  async update(req, res, next) {},
  async delete(req, res, next) {},
};

module.exports = blogController;
