const router = require("express").Router();
const { celebrate, Joi, Segments } = require("celebrate");
const { search } = require("../controllers/search");

router.get(
  "/",
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      q: Joi.string().min(1).max(100).required(),
    }),
  }),
  search,
);

module.exports = router;
