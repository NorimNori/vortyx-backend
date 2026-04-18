module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const message =
    statusCode === 500 ? "Ha ocurrido un error en el servidor" : err.message;

  return res.status(statusCode).json({ message });
};
