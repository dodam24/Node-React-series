const { User } = require('../models/User');

let auth = (req, res, next) => {

  // 인증 처리를 하는 곳

  // 클라이언트 쿠키에서 토큰을 가져온다.
  let token = req.cookies.x_auth;

  // 토큰을 복호화(decode)한 후, 유저를 찾는다.
  User.findByToken(token, (err, user) => {
    if(err) throw err;
    if(!user) return res.js({ isAuth: false, error: true })

    // user가 있으면 request에 token과 user값을 넣어준다.
    req.token = token;
    req.user = user;
    next();
  })
}

module.exports = { auth };