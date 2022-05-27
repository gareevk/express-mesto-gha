/* eslint-disable linebreak-style */
const allowedCors = require('../utils/allowedCors');

module.exports.corsValidation = (req, res, next) => {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  next();
};
