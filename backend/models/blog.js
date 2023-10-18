const mongoose = require("mongoose");
const { Schema } = mongoose;
// every record assign auto id in mongo db
const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    photoPath: { type: String, required: true },
    author: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  },
  {
    timestamps: true, //it indicates time when record update
  }
);
// mongoose.model("it is modal name","modal schema","data base mein jis name connections banaen ga")
module.exports = mongoose.model("Blog", blogSchema, "blogs");
