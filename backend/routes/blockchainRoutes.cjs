const express = require('express');
const router = express.Router();
const digitalSignatureController = require('../controllers/digitalSignatureController.cjs');

router.post('/verify-signature', digitalSignatureController.verifyDigitalSignature);
// Route to fetch blocks for a user
router.post('/get-blocks', digitalSignatureController.getBlocks);

// Route to update a specific block
router.post('/update-block', digitalSignatureController.updateBlock);

module.exports = router;