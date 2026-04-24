const Game = require("../models/game");
const {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} = require("../errors/index");

const getGames = async (req, res, next) => {
  try {
    const games = await Game.find({ owner: req.user._id });
    return res.json(games);
  } catch (err) {
    return next(err);
  }
};

const createGame = async (req, res, next) => {
  const { rawg_id, title, genre, platform, status, imageUrl, playtime } =
    req.body;

  try {
    const game = await Game.create({
      rawg_id,
      title,
      genre,
      platform,
      status,
      imageUrl,
      playtime,
      owner: req.user._id,
    });

    return res.status(201).json(game);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError(err.message));
    }
    return next(err);
  }
};

const updateGameStatus = async (req, res, next) => {
  const { gameId } = req.params;
  const { status } = req.body;

  try {
    const game = await Game.findById(gameId).select("+owner");

    if (!game) {
      return next(new NotFoundError("Juego no encontrado"));
    }

    if (game.owner.toString() !== req.user._id) {
      return next(
        new ForbiddenError("No tienes permiso para modificar este juego"),
      );
    }

    game.status = status;
    await game.save();

    return res.json(game);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError(err.message));
    }
    return next(err);
  }
};

const deleteGame = async (req, res, next) => {
  const { gameId } = req.params;

  try {
    const game = await Game.findById(gameId).select("+owner");

    if (!game) {
      return next(new NotFoundError("Juego no encontrado"));
    }

    if (game.owner.toString() !== req.user._id) {
      return next(
        new ForbiddenError("No tienes permiso para eliminar este juego"),
      );
    }

    await game.deleteOne();
    return res.json({ message: "Juego eliminado correctamente" });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getGames,
  createGame,
  updateGameStatus,
  deleteGame,
};
