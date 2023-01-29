const personalityDataModel = require ("../models/personalityData"); 

const { getStudents } = require ('../api/cims'); 
const { algorithm } = require ('../api/algorithm'); 

const getPersonalityData = async (req, res) => 
{
    try
    {
        let { students, groupSize, includedStudents, pairedStudents, separatedStudents } = req.body; 

        if (!students || !groupSize || !includedStudents || !pairedStudents || !separatedStudents)
        {
            return res.status (400).json ({
                status: "ERROR", 
                message: "Students, group size, paired students, and separated students are all required"
            })
        }

        students = students.filter((student, index) => includedStudents[index]); // remove students who are crossed out/not to be included

        for (let student of students)
        {
            let personality = await personalityDataModel.findOne ({ email: new RegExp(`^${student.username}`) }); // find entry in personality db that has email beginning w/ username

            if (!personality) // error if receive username that doesn't exist in collection/with no personality
            {
                console.log (`Can't find personality data for ${student.forename}`); 
                personality = { sn: 0, tf: 0, ei: 0, pj: 0 }
            }

            const { sn, tf, ei, pj } = personality; 
            student.personality = { sn, tf, ei, pj }; 
        }

        // console.log (students); 

        const groups = await algorithm (students, groupSize, pairedStudents, separatedStudents); 
        
        res.status(200).json(groups); // TODO: array of students without personality data (to display to frontend?)

        // res.json (groups); 
    }
    catch (error)
    {
        console.error (error); 

        res.status (500).json ({
            status: "ERROR", 
            message: "Server error"

        })
    }
}

module.exports = { getPersonalityData }; 