const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const passwordsController = require('../controllers/passwords');

router.get('/', auth, passwordsController.getPasswords);
router.get('/logs', auth, passwordsController.getAuditLogs);
router.post('/', auth, passwordsController.addPassword);
router.post('/:id/view', auth, passwordsController.viewPassword);
router.put('/:id', auth, passwordsController.editPassword);
router.delete('/:id', auth, passwordsController.deletePassword);

module.exports = router;