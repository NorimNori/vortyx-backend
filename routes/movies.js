const router = require("express").Router();
const { celebrate, Joi, Segments } = require("celebrate");
const {
  getMovies,
  createMovie,
  updateMovieStatus,
  deleteMovie,
} = require("../controllers/movies");

const VALID_STATUSES = ["playing", "completed", "backlog", "dropped"];
const VALID_TYPES = ["movie", "series"];

router.get("/", getMovies);

router.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      tmdb_id: Joi.number().required(),
      title: Joi.string().required(),
      genre: Joi.string().allow("").default(""),
      type: Joi.string()
        .valid(...VALID_TYPES)
        .required(),
      status: Joi.string()
        .valid(...VALID_STATUSES)
        .required(),
      imageUrl: Joi.string().uri().allow("").default(""),
    }),
  }),
  createMovie,
);

router.patch(
  "/:movieId",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      movieId: Joi.string().hex().length(24).required(),
    }),
    [Segments.BODY]: Joi.object().keys({
      status: Joi.string()
        .valid(...VALID_STATUSES)
        .required(),
    }),
  }),
  updateMovieStatus,
);

router.delete(
  "/:movieId",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      movieId: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteMovie,
);

module.exports = router;
