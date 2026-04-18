const mongoose = require("mongoose");
const validator = require("validator");

const movieSchema = new mongoose.Schema(
  {
    tmdb_id: {
      type: Number,
      required: [true, "El ID de TMDB es obligatorio"],
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
    type: {
      type: String,
      enum: {
        values: ["movie", "series"],
        message: "Tipo no válido. Debe ser movie o series",
      },
      required: [true, "El tipo es obligatorio"],
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

movieSchema.index({ title: "text", genre: "text" });

module.exports = mongoose.model("Movie", movieSchema);
