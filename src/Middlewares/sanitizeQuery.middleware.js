function sanitizeQuery(req, res, next) {
  for (const key in req.query) {
    if (Object.hasOwnProperty.call(req.query, key)) {
      const sanitizedKey = key.replace(/\$/g, '_').replace(/\./g, '_');
      if (sanitizedKey !== key) {
        req.query[sanitizedKey] = req.query[key];
        delete req.query[key];
      }
    }
  }
  next();
}module.exports = {
  
  sanitizeQuery,

};