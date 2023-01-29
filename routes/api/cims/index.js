const express = require ("express"); 
const cimsController = require ('../../../controllers/cims'); 

const router = express.Router (); 

// router.get ("/teacherIDs", cimsController.getTeacherIDs); 
router.post ("/classes", cimsController.getClasses); 
router.post ("/students", cimsController.getStudents); 

module.exports = router; 