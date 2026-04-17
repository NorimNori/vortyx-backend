const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { UnauthorizedError } = require("../errors/index");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [30, "El nombre no puede superar 30 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El correo es obligatorio"],
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: "El correo no es válido",
      },
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email }).then((user) => {
    if (!user) {
      throw new UnauthorizedError("Correo o contraseña incorrectos");
    }
    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        throw new UnauthorizedError("Correo o contraseña incorrectos");
      }
      return user;
    });
  });
};

module.exports = mongoose.model("User", userSchema);
