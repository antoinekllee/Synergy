const express = require ("express"); 
// const personalityDataRoutes = require ("./personalityData"); 
const personalityDataController = require('../../controllers/personalityData'); 

const router = express.Router (); 

// router.use ("/personalityData", personalityDataRoutes); 
router.post ("/personalityData", personalityDataController.getPersonalityData); // not actually posting any data

module.exports = router; 