import xss from 'xss-clean';

function customXssClean(req, res, next) {
  // Sanitize body
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    }
  }
  // Sanitize params
  if (req.params) {
    for (const key in req.params) {
      if (typeof req.params[key] === 'string') {
        req.params[key] = xss(req.params[key]);
      }
    }
  }
  // Do NOT sanitize req.query here to avoid the error

  next();
}

export default customXssClean;
