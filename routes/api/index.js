const express = require ("express"); 
const personalityDataController = require('../../controllers/personalityData'); 

const cimsRoutes = require ('./cims'); 

const router = express.Router (); 

// router.use ("/personalityData", personalityDataRoutes); 
router.post ("/personalityData", personalityDataController.getPersonalityData); // not actually posting any data
router.use ("/cims", cimsRoutes); 

module.exports = router; 