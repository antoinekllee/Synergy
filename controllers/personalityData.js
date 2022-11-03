const personalityDataModel = require ("../models/personalityData"); 

const { getStudents } = require ('../api/cims'); 
const { algorithm } = require ('../api/algorithm'); 

const getPersonalityData = async (req, res) => 
{
    const { teacherID, groupSize, pairedStudents, separatedStudents } = req.body; 

    const students = await getStudents (teacherID); 

    for (let student of students)
    {
        const personality = await personalityDataModel.findOne ({ email: new RegExp(`^${student.username}`) }); // find entry in personality db that has email beginning w/ username
        // TODO error if receive username that doesn't exist in collection/with no personality
        const { sn, tf, ei, pj } = personality; 
        student.personality = { sn, tf, ei, pj }; 
    }

    const groups = await algorithm (students, groupSize, pairedStudents, separatedStudents); 

    res.json (groups); 
}

module.exports = { getPersonalityData }; 