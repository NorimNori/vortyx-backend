const Game = require("../models/game");
const Movie = require("../models/movies");

const search = async (req, res, next) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.json({ games: [], movies: [] });
  }

  const userId = req.user._id;
  const searchQuery = q.trim();

  try {
    const [games, movies] = await Promise.all([
      Game.find(
        {
          owner: userId,
          $text: { $search: searchQuery },
        },
        {
          score: { $meta: "textScore" },
        },
      ).sort({ score: { $meta: "textScore" } }),

      Movie.find(
        {
          owner: userId,
          $text: { $search: searchQuery },
        },
        {
          score: { $meta: "textScore" },
        },
      ).sort({ score: { $meta: "textScore" } }),
    ]);

    return res.json({ games, movies });
  } catch (err) {
    return next(err);
  }
};

module.exports = { search };
