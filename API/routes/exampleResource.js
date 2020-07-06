const express = require('express');
const { getResources, getResource } = require('../controllers/exampleResource');

const router = express.Router();

router.route('/').get(getResources);
router.route('/:id').get(getResource);

module.exports = router;
