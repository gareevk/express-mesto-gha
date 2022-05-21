const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../middlewares/UnauthorizedError')

module.exports = async (req, res, next) => {
  const {authorization} = req.headers;
  console.log(authorization);

  if ( !authorization || !authorization.startsWith('Bearer')) {
    next( new UnauthorizedError('Необходима авторизация'));
    //return res.status(401).send( {message: 'Необходима авторизация'} );
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = await jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    next( new UnauthorizedError('Необходима авторизация'));
    //return res.status(403).send( {message: 'Необходима авторизация'} );
  }
  //console.log(payload);
  req.user = payload;

  next();
};