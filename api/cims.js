const fetch = require('node-fetch'); 

async function getStudentsForTeacher (teacherID)
{
    const response = await fetch ('http://localhost:3002/students'); 
    const data = await response.json(); 
    console.log (data); 
    return data; 
}

module.exports = { getStudentsForTeacher }; 