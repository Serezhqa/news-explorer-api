const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const articleRouter = require('./articles');
const checkPassword = require('../middlewares/check-password');
const { validateUserBody, validateAuthentication } = require('../middlewares/validators');
const NotFoundError = require('../errors/not-found-error');

router.post('/signup', validateUserBody, checkPassword, createUser);
router.post('/signin', validateAuthentication, checkPassword, login);
router.use(auth);
router.use('/users', userRouter);
router.use('/articles', articleRouter);
router.use('/*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
