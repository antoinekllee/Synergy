const express = require ("express"); 
const personalityDataRoutes = require ("./personalityData"); 

const router = express.Router (); 

router.use ("/personalityData", personalityDataRoutes); 

module.exports = router; 