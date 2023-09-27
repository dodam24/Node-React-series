const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require("./models/User");

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json());
app.use(cookieParser());


const mongoose = require('mongoose')
mongoose
  .connect(config.mongoURI, {})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => res.send('Hello World!'))

app.post('/api/users/register', async (req, res) => {

  // 회원가입 할 때 필요한 정보들을 client에서 가져오면
  // 그 정보들을 데이터베이스에 넣어준다.

  try {
    // body parser를 통해 body에 담긴 정보를 가져온다.
    const user = new User(req.body)
    const userInfo = await user.save();
    res.status(200).json({
      success: true,
    })
  } catch (err) {
    res.json({ success: false, err })
  }
})

app.post('/api/users/login', async (req, res) => {
  try {
    // 요청된 이메일이 데이터베이스에 있는지 찾는다.
    const user = await User.findOne({ email: req.body.email })

    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "이메일에 해당하는 유저가 없습니다."
      });
    }

    // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인한다.
    const isMatch = await user.comparePassword(req.body.password);

    if(!isMatch) {
      return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })
    }

    // 비밀번호까지 맞다면 토큰을 생성한다. (JsonWebToken 라이브러리 이용)
    const userWithToken = await user.generateToken();

    // 쿠키에 토큰을 저장한다.
    res.cookie("x_auth", userWithToken.token)
      .status(200)  // 요청이 성공했음을 나타내는 성공 응답 상태 코드
      .json({ loginSuccess: true, userId: user._id });
  } catch (err) {
    return res.status(400).send(err);
  }
});

<<<<<<< HEAD
// role이 0이면 일반 유저     role이 0이 아니면 관리자
app.get('api/users/auth', auth, (req, res) => {

  // 여기까지 미들웨어를 통과해 왔다는 것은 Authentication이 True 라는 뜻
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

// 로그아웃 라우터 생성
app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id },
  { token: "" }
  , (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true
    })
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
=======

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
>>>>>>> 1a3b0811505fb9b551eebe08701e29ef3ab1e175
