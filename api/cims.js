const fetch = require('node-fetch'); 

async function getStudentsForTeacher (teacherID) 
{
    const response = await fetch ('http://localhost:3002/students'); 
    const data = await response.json(); 
    return data; 
}

async function getTeacherIDs () // get list of all teacher IDs
{
    const response = await fetch ('http://localhost:3003/teachers'); 
    const data = await response.json(); 
    // console.log ("FOUND TEACHER IDS"); 
    // console.log (data); 
    return data; 
}

module.exports = { getStudentsForTeacher, getTeacherIDs }; 