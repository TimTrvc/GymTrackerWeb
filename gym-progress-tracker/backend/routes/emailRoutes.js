const express = require('express');
const { getEmails, addEmail, deleteEmail } = require('../controllers/emailController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * GET / - Retrieve all emails.
 * POST / - Add a new email.
 * DELETE /:email - Delete an email by address.
 * (authMiddleware can be enabled for authentication.)
 */
router.get('/', /* authMiddleware, */ getEmails);
router.post('/', /* authMiddleware, */ addEmail);
router.delete('/:email', /* authMiddleware, */ deleteEmail);

module.exports = router;