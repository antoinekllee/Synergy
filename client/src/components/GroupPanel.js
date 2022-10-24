function Group (props)
{
    const namesList = <ul>{props.students.map ((student) => <li key={student.username}>{(student.givenName === "" ? student.forename : student.givenName) + " " + student.surname}</li>)}</ul>; 

    return <div>
        { namesList }
    </div>; 
}

export default Group; 