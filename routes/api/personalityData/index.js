const express = require ("express"); 
const personalityDataController = require ('../../../controllers/personalityData.js'); 

const router = express.Router (); 

router.post ("/getPersonalityData", personalityDataController.getPersonalityData); // not actually posting any data

module.exports = router; 