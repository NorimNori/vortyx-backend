const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors");

const { JWT_SECRET = "dev-secret-key" } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Es necesario iniciar sesión"));
  }

  const token = authorization.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    return next(new UnauthorizedError("Token inválido o expirado"));
  }

  req.user = payload;
  return next();
};
