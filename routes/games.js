const router = require("express").Router();
const { celebrate, Joi, Segments } = require("celebrate");
const {
  getGames,
  createGame,
  updateGameStatus,
  deleteGame,
} = require("../controllers/games");

const VALID_STATUSES = ["playing", "completed", "backlog", "dropped"];

router.get("/", getGames);

router.post(
  "/",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      rawg_id: Joi.number().required(),
      title: Joi.string().required(),
      genre: Joi.string().allow("").default(""),
      platform: Joi.string().allow("").default(""),
      status: Joi.string()
        .valid(...VALID_STATUSES)
        .required(),
      imageUrl: Joi.string().uri().allow("").default(""),
      playtime: Joi.number().min(0).default(0),
    }),
  }),
  createGame,
);

router.patch(
  "/:gameId",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      gameId: Joi.string().hex().length(24).required(),
    }),
    [Segments.BODY]: Joi.object().keys({
      status: Joi.string()
        .valid(...VALID_STATUSES)
        .required(),
    }),
  }),
  updateGameStatus,
);

router.delete(
  "/:gameId",
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      gameId: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteGame,
);

module.exports = router;
