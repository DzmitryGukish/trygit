
function HttpError(status, message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, LoginError);
  this.status = status;
  this.message = message || http.STATUS_CODES[status] || "Error";
};
util.inherits(HttpError, Error);
HttpError.prototype.name = 'HttpError';


module.exports = HttpError;
