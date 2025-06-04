const mongoSanitize = require('express-mongo-sanitize');

function sanitizeBodyParams(req, res, next) {
  req.body = mongoSanitize(req.body);
  req.params = mongoSanitize(req.params);
  next();
}
module.exports = {
  sanitizeBodyParams,
};