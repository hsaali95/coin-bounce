const mongoose = require("mongoose");
const { Schema } = mongoose;

const refreshTokenSchema = Schema(
  {
    token: { type: String, required: true },
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  },
  {
    timesStamps: true,
  }
);
                               //(modal name,Schema,collection name)
module.exports = mongoose.model("RefreshToken", refreshTokenSchema, "tokens"); 
