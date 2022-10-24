const api = require ('../api/cims'); 

const getTeacherIDs = async (req, res) => 
{
    const teachers = await api.getTeacherIDs (); 
    res.json (teachers); 
}

const getClasses = async (req, res) => 
{
    const { teacherID } = req.body; 
    const classes = await api.getClasses (teacherID); 
    res.json (classes); 
}

const getStudents = async (req, res) => 
{
    const { classCode } = req.body; 
    const students = await api.getStudents (classCode); 
    res.json (students); 
}

module.exports = { getTeacherIDs, getClasses, getStudents }; 