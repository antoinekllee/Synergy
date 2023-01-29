const api = require ('../api/cims'); 

// const getTeacherIDs = async (req, res) => 
// {
//     const teachers = await api.getTeacherIDs (); 
//     res.status(200).json (teachers); 
// }

const getClasses = async (req, res) => 
{
    const { teacherId } = req.body; 

    if (!teacherId)
        res.status(404).json({ status: "ERROR", message: "Teacher ID required" }); 

    const classes = await api.getClasses (teacherId); 

    res.status(200).json (classes); 
}

const getStudents = async (req, res) => 
{
    const { classId } = req.body; 

    if (!classId)
        res.status(404).json({ status: "ERROR", message: "Class ID required" })

    const students = await api.getStudents (classId); 

    res.status(200).json (students); 
}

module.exports = { getClasses, getStudents }; 