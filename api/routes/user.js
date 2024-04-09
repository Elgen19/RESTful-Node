const express = require('express');
const router = express.Router();
const userControler = require('../controllers/userController')


router.post('/signup', userControler.user_signup)


router.post('/login', userControler.user_login )

router.get('/', userControler.get_all_users)


router.delete('/:userId', userControler.user_deletion)


module.exports = router;