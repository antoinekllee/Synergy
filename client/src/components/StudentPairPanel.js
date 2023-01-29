import { useEffect, useState } from 'react'; 

import classes from './StudentPairPanel.module.css'; 

import DatalistInput from 'react-datalist-input';

import StudentAffiliationList from './StudentAffiliationList';

function StudentPairPanel (props) 
{
  const [selectedStudent1, setSelectedStudent1] = useState (null); 
  const [selectedStudent2, setSelectedStudent2] = useState (null); 

  const [pairedStudents, setPairedStudents] = useState([]); 
  const [separatedStudents, setSeparatedStudents] = useState([]); 

  useEffect (() => 
  {
    setPairedStudents (props.pairedStudents); 
    setSeparatedStudents (props.separatedStudents); 
  }, [props.pairedStudents, props.separatedStudents])

  const addAffiliation = (isPair) => // isPair indicates whether students are a pair or separated
  {
    if ((isPair && pairedStudents.length >= 3) || (!isPair && separatedStudents.length >= 3))
    {
      console.log ("CAN'T HAVE MORE THAN 3 " + (isPair ? "PAIRS" : "SEPARATIONS")); 
      return; 
    }

    if ((selectedStudent1 === null) || (selectedStudent2 === null))
    {
      console.log ("INVALID PAIR: CONTAINS NULL STUDENT"); 
      return; 
    }

    if (selectedStudent1 === selectedStudent2)
    {
      console.log ("INVALID PAIR: TWO OF SAME STUDENT"); 
      return; 
    }

    const allAffiliations = pairedStudents.concat (separatedStudents); 
    if (pairExists (allAffiliations, [selectedStudent1, selectedStudent2]) || pairExists (allAffiliations, [selectedStudent2, selectedStudent1]))
    {
      console.log ("INVALID PAIR: PAIR ALREADY EXISTS"); 
      return; 
    }

    let newAffiliations = isPair ? pairedStudents : separatedStudents; 
    newAffiliations.push ([selectedStudent1, selectedStudent2]); 
    
    if (isPair)
      setPairedStudents ([...newAffiliations]); // spread array so react component re-renders
    else
      setSeparatedStudents ([...newAffiliations]); 
  }

  const pairExists = (pairArr, newPair) => // check if student pair (together/separated) already registered
  {
    const pairString = JSON.stringify(newPair); // convert to string to be compared
    return pairArr.some ((pair) => JSON.stringify (pair) === pairString); 
  }

  const removeAffiliation = (isPair, index)  => 
  {
    let newAffiliations = isPair ? pairedStudents : separatedStudents; 
    newAffiliations.splice (index, 1); 

    if (isPair)
    {
			console.log ("REMOVING PAIR AT INDEX " + index); 
      setPairedStudents ([...newAffiliations]); 
    }
    else
    {
      console.log ("REMOVING SEPARATED PAIR AT INDEX " + index); 
      setSeparatedStudents ([...newAffiliations]); 
    }
  }

  return <div className={classes.container}>
        <h1>AFFILIATIONS</h1>
        <p>Try to set as little restrictions as possible, as it may reduce the efficacy of the algorithm</p>
        <DatalistInput 
          placeholder="Student 1"
          onSelect={(student) => setSelectedStudent1 (student.student)}
          items={props.studentItems}
        />
        <DatalistInput 
          placeholder="Student 2"
          onSelect={(student) => setSelectedStudent2 (student.student)}
          items={props.studentItems}
        />
        <button onClick={() => addAffiliation(true)}>Pair</button>
        <button onClick={() => addAffiliation(false)}>Separate</button>

        <h2>PAIRED</h2>
        <StudentAffiliationList pairs={pairedStudents} isPair={true} removeAffiliation={removeAffiliation} /> {/* UPDATE AFFILIATION LIST WITH OLD PAIRS IF CLOSED THEN OPENED */}

        <h2>SEPARATED</h2>
        <StudentAffiliationList pairs={separatedStudents} isPair={false} removeAffiliation={removeAffiliation} />

        <button onClick={() => 
        {
            props.updateAffiliations(pairedStudents, separatedStudents); 
            props.closeAffiliationPanel (); 
        }}>CLOSE</button>
    </div>; 
}

export default StudentPairPanel; 