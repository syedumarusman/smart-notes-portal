const Router = require('koa-router');
const handler = require('../controllers/user');
const auth = require('../utils/authMiddleware')

const router = new Router({
    prefix: '/user'
})

router.post('/login', handler.loginUser);

router.get('/', handler.getAll);

router.get('/:userId', handler.getUser);

router.post('/', handler.create);

router.put('/:userId', handler.update);

router.post('/resetPassword', handler.resetPassword);

router.delete('/:userId', auth(['admin']),  handler.remove );

module.exports = router.routes();