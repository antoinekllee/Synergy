const fetch = require('node-fetch'); 

const { CIMSAPI_KEY } = process.env; 

// async function getTeacherIDs () // get list of all teacher IDs
// {
//     const response = await fetch ('http://localhost:3003/teachers'); 
//     const data = await response.json(); 
//     console.log ("FETCHING TEACHERS"); 
//     return data; 
// }

async function getClasses (teacherId) // get list of classes for teacher
{
    // const response = await fetch ('http://localhost:3004/classes'); 
    const response = await fetch ('https://webapps.uwcsea.edu.sg/StudentTimetableApi/api/Timetable/ListClasses', {
        method: "POST", 
        headers: {
            "Content-Type": "application/json", 
            "Authorization": "Basic " + CIMSAPI_KEY
        }, 
        body: JSON.stringify({ TeacherId: teacherId })
    }); 

    const data = await response.json (); 
    console.log ("FETCHING CLASSES FOR TEACHER ID " + teacherId); 
    // console.log (data); 
    return data; 
}

async function getStudents (classId) // get list of students for class
{
    // const response = await fetch ('http://localhost:3002/students'); 
    const response = await fetch ('https://webapps.uwcsea.edu.sg/StudentTimetableApi/api/Timetable/ListStudents', {
        method: "POST", 
        headers: {
            "Content-Type": "application/json", 
            "Authorization": "Basic " + CIMSAPI_KEY
        }, 
        body: JSON.stringify({ ClassId: classId }) 
    }); 

    const data = await response.json(); 
    // console.log ("FETCHING STUDENTS FOR CLASS " + classId); 
    // console.log(data.students); 
    return data.students; 
}

module.exports = { getClasses, getStudents }; 