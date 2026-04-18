const User = require("../models/users");
const { NotFoundError } = require("../errors/index");

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new NotFoundError("Usuario no encontrado"));
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = { getCurrentUser };
