const express = require ("express"); 
const personalityDataController = require ('../../../controllers/personalityData.js'); 

const router = express.Router (); 

router.post ("/getPersonalityData", personalityDataController.getPersonalityData); // use post to 

module.exports = router; 