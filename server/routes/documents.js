const express = require('express');

const { getDocument } = require('../controllers/documents/docuseal');

const router = express.Router();

router.post('/document', getDocument);   

module.exports = router;