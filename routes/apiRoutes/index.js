const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes');

// we use the imported animal routes
router.use(animalRoutes);

module.exports = router;