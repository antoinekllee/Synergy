import classes from './GroupPanel.module.css'; 

function Group (props)
{
    const namesList = <ul className={classes.list}>{props.students.map ((student) => <li key={student.username} className={classes.listItem}>{((!('givenName' in student) || student.givenName === '') ? student.forename : student.givenName) + " " + student.surname}</li>)}</ul>; 
    
    const randomFromInterval = (min, max) =>  Math.floor(Math.random() * (max - min + 1) + min); // min and max inclusive
    const h = randomFromInterval(0, 360); 
    const s = randomFromInterval (45, 70) + "%"; 
    const v = randomFromInterval (65, 70) + "%"; 

    // console.log (h + ' ' + s + ' ' + v);  

    return <div className={classes.groupPanel} style={{ backgroundColor: `hsl(${h}, ${s}, ${v})` }}>
        { namesList }
    </div>; 
}

export default Group; 