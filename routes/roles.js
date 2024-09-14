const { Router } = require('express');
const router = Router();
const {rolesGet, rolesPost,rolesPut, rolesDelete} =require ('../controllers/rol');

router.get('/', rolesGet);

router.post('/', rolesPost);

router.put('/:id', rolesPut);

router.delete('/:id', rolesDelete);

module.exports = router;