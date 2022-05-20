const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  const {authorization} = req.headers;

  if ( !authorization || !authorization.startsWith('Bearer')) {
    return res.status(403).send( {message: 'Необходима авторизация'} );
  }
  //console.log(authorization);
  const token = authorization.replace('Bearer ', '');
  let payload;
  //console.log(token);
  try {
    payload = await jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return res.status(401).send( {message: 'Необходима авторизация'} );
  }
  //console.log(payload);
  req.user = payload;

  next();
};