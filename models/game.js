const mongoose = require("mongoose");
const validator = require("validator");

const gameSchema = new mongoose.Schema(
  {
    rawg_id: {
      type: Number,
      required: [true, "El ID de RAWG es obligatorio"],
    },
    title: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
    },
    genre: {
      type: String,
      default: "",
      trim: true,
    },
    platform: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["playing", "completed", "backlog", "dropped"],
        message: "Estado no válido",
      },
      required: [true, "El estado es obligatorio"],
    },
    imageUrl: {
      type: String,
      default: "",
      validate: {
        validator: (v) => v === "" || validator.isURL(v),
        message: "La URL de imagen no es válida",
      },
    },
    playtime: {
      type: Number,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

gameSchema.index({ title: "text", genre: "text" });

module.exports = mongoose.model("Game", gameSchema);
