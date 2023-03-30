var express = require('express');
var router = express.Router();
const {
  registerUser,
  loginUser,
  getMessage,
} = require('../controllers/usersController');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/message', getMessage);

module.exports = router;
