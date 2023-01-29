// import { useEffect, useState } from 'react'; 

import classes from './StudentList.module.css'; 

function StudentList (props) 
{
    const { students, includedStudents, toggleStudentIncluded } = props; 

    const list = <ul>{students.map ((student, index) => 
    {
        // console.log (students); 
        return <li key={index} className={includedStudents[index] ? classes.includedItem : classes.discludedItem} onClick={() => toggleStudentIncluded(index)}>{ student }</li>; 
    })}</ul>; 

    return <div>
        { list }
    </div>; 
}

export default StudentList; 