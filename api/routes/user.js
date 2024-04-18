const express = require('express');
const router = express.Router();
const userControler = require('../controllers/userController')
const checkAuth = require('../middleware/check-auth')


router.post('/signup', userControler.user_signup)


router.post('/login', userControler.user_login )

router.get('/', checkAuth, userControler.get_all_users)


router.delete('/:userId', checkAuth, userControler.user_deletion)


module.exports = router;