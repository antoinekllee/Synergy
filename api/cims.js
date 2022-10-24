const fetch = require('node-fetch'); 

async function getTeacherIDs () // get list of all teacher IDs
{
    const response = await fetch ('http://localhost:3003/teachers'); 
    const data = await response.json(); 
    return data; 
}

async function getClasses (teacherID) // get list of classes for teacher
{
    const response = await fetch ('http://localhost:3004/classes'); 
    const data = await response.json (); 
    return data; 
}

async function getStudents (classCode) // get list of students for class
{
    const response = await fetch ('http://localhost:3002/students'); 
    const data = await response.json(); 
    return data; 
}

module.exports = { getTeacherIDs, getClasses, getStudents }; 