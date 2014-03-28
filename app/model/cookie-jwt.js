var jwt = require('jsonwebtoken');

module.exports = function(options) {
  if (!options || !options.secret) throw new Error('secret should be set');

  return function(req, res, next) {
    var token;
    
    if (req.cookies && req.cookies.token) 
    {
        token = req.cookies.token;
    } else {
      return next(new UnauthorizedError('credentials_required', { message: 'No token cookie was found' }));
    }

    jwt.verify(token, options.secret, options, function(err, decoded) {
      if (err) return next(new UnauthorizedError('invalid_token', err));

      req.user = decoded;
      next();
    });
  };
};

function UnauthorizedError (code, error) {
  Error.call(this, error.message);
  this.message = error.message;
  this.code = code;
  this.status = 401;
  this.inner = error;
}

UnauthorizedError.prototype = Object.create(Error.prototype);
UnauthorizedError.prototype.constructor = UnauthorizedError;