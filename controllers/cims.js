const api = require ('../api/cims'); 

const getTeacherIDs = async (req, res) => 
{
    const teachers = await api.getTeacherIDs (); 
    res.json (teachers); 
}

const getClasses = async (req, res) => 
{
    const { teacherId } = req.body; 
    const classes = await api.getClasses (teacherId); 
    res.json (classes); 
}

const getStudents = async (req, res) => 
{
    const { classId } = req.body; 
    const students = await api.getStudents (classId); 
    res.json (students); 
}

module.exports = { getTeacherIDs, getClasses, getStudents }; 