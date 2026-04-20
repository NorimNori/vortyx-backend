const Movie = require("../models/movies");
const {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} = require("../errors/index");

const getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });
    return res.json(movies);
  } catch (err) {
    return next(err);
  }
};

const createMovie = async (req, res, next) => {
  const { tmdb_id, title, genre, type, status, imageUrl } = req.body;

  try {
    const movie = await Movie.create({
      tmdb_id,
      title,
      genre,
      type,
      status,
      imageUrl,
      owner: req.user._id,
    });

    return res.status(201).json(movie);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError(err.message));
    }
    return next(err);
  }
};

const updateMovieStatus = async (req, res, next) => {
  const { movieId } = req.params;
  const { status } = req.body;

  try {
    const movie = await Movie.findById(movieId).select("+owner");

    if (!movie) {
      return next(new NotFoundError("Película/serie no encontrada"));
    }

    if (movie.owner.toString() !== req.user._id) {
      return next(
        new ForbiddenError("No tienes permiso para modificar este item"),
      );
    }

    movie.status = status;
    await movie.save();

    return res.json(movie);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError(err.message));
    }
    return next(err);
  }
};

const deleteMovie = async (req, res, next) => {
  const { movieId } = req.params;

  try {
    const movie = await Movie.findById(movieId).select("+owner");

    if (!movie) {
      return next(new NotFoundError("Película/serie no encontrada"));
    }

    if (movie.owner.toString() !== req.user._id) {
      return next(
        new ForbiddenError("No tienes permiso para eliminar este item"),
      );
    }

    await movie.deleteOne();
    return res.json({ message: "Item eliminado correctamente" });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getMovies,
  createMovie,
  updateMovieStatus,
  deleteMovie,
};
