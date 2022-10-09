const personalityDataModel = require ("../models/personalityData"); 

const { getStudentsForTeacher } = require ('../api/cims'); 
const { algorithm } = require ('../api/algorithm'); 


const getPersonalityData = async (req, res) => 
{
    const { teacherID, groupSize } = req.body; 

    const students = await getStudentsForTeacher (teacherID); 

    for (let student of students)
    {
        const personality = await personalityDataModel.findOne ({ email: new RegExp(`^${student.username}`) }); // find entry in personality db that has email beginning w/ username
        // TODO error if receive username that doesn't exist in collection/with no personality
        student.sn = personality.sn; 
        student.tf = personality.tf; 
        student.ei = personality.ei; 
        student.pj = personality.pj; 
    }

    const groups = await algorithm (students, groupSize); 

    res.json (groups); 
}

module.exports = { getPersonalityData }; 