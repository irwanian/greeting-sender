const router = require('express').Router();
const { validate } = require('../utils/validator');
const UserSchema = require('../validator_schema/user');

router.post('/', validate(UserSchema.postCreateUser), require('../methods/user/post_create_user').postCreateUser);
router.delete('/:id', validate(UserSchema.deleteUser), require('../methods/user/delete_user').deleteUser);
router.put('/:id', validate(UserSchema.putUpdateUser), require('../methods/user/put_update_user').putUpdateUser);

module.exports = router;