import mongoSanitize from 'express-mongo-sanitize';

export function sanitizeBodyParams(req, res, next) {
  req.body = mongoSanitize(req.body);
  req.params = mongoSanitize(req.params);
  next();
}
