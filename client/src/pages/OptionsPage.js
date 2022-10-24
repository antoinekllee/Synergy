import { useRef, useState, useCallback, useEffect, useContext } from 'react'; 

import StudentPairPanel from '../components/StudentPairPanel';
import DatalistInput from 'react-datalist-input'; 

import classes from './OptionsPage.module.css'; 

import PageContext from '../store/PageContext';
import PartitionContext from '../store/PartitionContext';
import LoadingContext from '../store/LoadingContext';

function OptionsPage() 
{ 
  const { setOnOptionsPage } = useContext (PageContext); 
  const { setPartition } = useContext (PartitionContext);  
  const { setIsLoading } = useContext (LoadingContext); 

  // Loading teacher IDs
  const [teacherIDs, setTeacherIDs] = useState([]); // all teacher IDs (options)
  useEffect (() => 
  {
    const loadTeachers = async() => 
    {
      setIsLoading (true); 

      const response = await fetch ("/api/cims/teacherIDs"); 
      const data = await response.json(); 

      const teacherItems = data.map((teacher) => ({ id: teacher.id, value: teacher.id })); // format into items for dropdown
      setTeacherIDs (teacherItems); 

      setIsLoading (false); 
    }

    loadTeachers (); 
  }, []); 

  // Loading classes when teacher ID selected
  const [selectedTeacherID, setSelectedTeacherID] = useState(null); 
  const [classes, setClasses] = useState([]); // class options for dropdown (all classes taught by teacher with teacherID)

  const teacherSelectHandler = useCallback((id) => 
  {
    setSelectedTeacherID(id.value); 
    setSelectedClass (null); // hide options for pairing students
  }, []); 

  useEffect (() => // called when teacherID selected from dropdown
  {
    const getClasses = async() => 
    {
      const response = await fetch ("/api/cims/classes", // get students for selected teacher's class
      { 
        body: JSON.stringify ({ teacherID: selectedTeacherID }), // send over text representation of json object 
        headers: { "Content-Type": "application/json" }, // let server know to turn plain text back into json object
        method: "POST"
      }); 
      const data = await response.json(); 

      const classItems = data.map ((className) => ({ id: className.classCode, value: className.classCode }))
      setClasses (classItems); 
    }

    getClasses (); 
  }, [selectedTeacherID]); 

  const [selectedClass, setSelectedClass] = useState (null); // class code
  const [students, setStudents] = useState([]); // array of all students given selected class code

  const selectClassHandler = useCallback((classCode) => 
  {
    setSelectedClass (classCode.value); 
  }, []); 

  useEffect (() => 
  {
    const getStudents = async() => 
    {
      const response = await fetch ("/api/cims/students", // get students for selected class
      { 
        body: JSON.stringify ({ classCode: selectedClass }), // send over text representation of json object 
        headers: { "Content-Type": "application/json" }, // let server know to turn plain text back into json object
        method: "POST"
      }); 
      const data = await response.json(); 

      const studentItems = data.map ((student) => ({ id: student.givenName === '' ? student.forename : student.givenName, value: student.givenName === '' ? student.forename : student.givenName, student }))
      setStudents (studentItems); // student items for dropdown
    }

    getStudents(); 
  }, [selectedClass]); 

  // Select two students (who must be together/separated)
  const [selectedConnectedStudent1, setSelectedConnectedStudent1] = useState(null); 
  const [selectedConnectedStudent2, setSelectedConnectedStudent2] = useState(null); 

  const [selectedSeparatedStudent1, setSelectedSeparatedStudent1] = useState(null); 
  const [selectedSeparatedStudent2, setSelectedSeparatedStudent2] = useState(null); 

  const [connectedStudents, setConnectedStudents] = useState([]); 
  const [separatedStudents, setSeparatedStudents] = useState([]); 

  const addConnectedStudentPair = () => 
  {
    if (selectedConnectedStudent1 === null || selectedConnectedStudent2 === null)
    {
      console.log ("INVALID PAIR: CONTAINS NULL STUDENT"); 
      return; 
    }

    if (selectedConnectedStudent1 === selectedConnectedStudent2)
    {
      console.log ("INVALID PAIR: TWO OF SAME STUDENT"); 
      return; 
    }

    if (pairExists (connectedStudents, [selectedConnectedStudent1, selectedConnectedStudent2]) || pairExists (connectedStudents, [selectedConnectedStudent2, selectedConnectedStudent1]))
    {
      console.log ("INVALID PAIR: PAIR ALREADY EXISTS"); 
      return; 
    }

    let newConnectedStudents = connectedStudents; 
    newConnectedStudents.push ([selectedConnectedStudent1, selectedConnectedStudent2]); 
    setConnectedStudents (newConnectedStudents); 
  }

  const addSeparatedStudentPair = () => 
  {
    if (selectedSeparatedStudent1 === null || selectedSeparatedStudent2 === null)
    {
      console.log ("INVALID PAIR: CONTAINS NULL STUDENT"); 
      return; 
    }

    if (selectedSeparatedStudent1 === selectedSeparatedStudent2)
    {
      console.log ("INVALID PAIR: TWO OF SAME STUDENT"); 
      return; 
    }

    if (pairExists (separatedStudents, [selectedSeparatedStudent1, selectedSeparatedStudent2]) || pairExists (separatedStudents, [selectedSeparatedStudent2, selectedSeparatedStudent1]))
    {
      console.log ("INVALID PAIR: PAIR ALREADY EXISTS"); 
      return; 
    }

    let newSeparatedStudents = separatedStudents; 
    newSeparatedStudents.push ([selectedSeparatedStudent1, selectedSeparatedStudent2]); 
    setSeparatedStudents (newSeparatedStudents); 
  }

  const pairExists = (pairArr, newPair) => // check if student pair (together/separated) already registered
  {
    const pairString = JSON.stringify(newPair); // convert to string to be compared
    return pairArr.some ((pair) => JSON.stringify (pair) === pairString); 
  }

  // Running algorithm  
  const groupSizeInputRef = useRef (); 
  const runAlgorithmHandler = async() => 
  {
    setIsLoading (true); 

    const groupSize = groupSizeInputRef.current.value; 

    console.log ("Running algorithm on class " + selectedTeacherID + " with group size " + groupSize); 

    const algorithmData = 
    {
      teacherID: selectedTeacherID, 
      groupSize, 
      connectedStudents, 
      separatedStudents
    }

    const response = await fetch ("/api/personalityData", 
    { 
      body: JSON.stringify (algorithmData), // send over text representation of json object 
      headers: { "Content-Type": "application/json" }, // let server know to turn plain text back into json object
      method: "POST"
    }); 
    const data = await response.json(); 

    setPartition (data); // update partition context
    setOnOptionsPage (false); // go to groups page
    
    setIsLoading (false); 
  }

  return (
    <div className={classes.container}>
      <h1>SYNERGY</h1>

      {/* <h2>Class</h2> */}
      <DatalistInput 
        placeholder="Teacher ID"
        onSelect={(id) => teacherSelectHandler(id)}
        items={teacherIDs}
      />

      {selectedTeacherID && <DatalistInput // TODO: automatically select current class being taught (from CIMS); add (current) to name in dropdown list
        placeholder="Class"
        onSelect={(classCode) => selectClassHandler (classCode)}
        items={classes}
      />}
  
      {selectedClass && <div>
        <h3>Pair Students</h3> 
        <DatalistInput 
          placeholder="Student 1"
          onSelect={(student) => setSelectedConnectedStudent1 (student.student)}
          items={students}
        />
        <DatalistInput 
          placeholder="Student 2"
          onSelect={(student) => setSelectedConnectedStudent2 (student.student)}
          items={students}
        />
        <button onClick={addConnectedStudentPair}>Pair</button>
        
        <h3>Separate Students</h3>
        <DatalistInput 
          placeholder="Student 1"
          onSelect={(student) => setSelectedSeparatedStudent1 (student.student)}
          items={students}
        />
        <DatalistInput 
          placeholder="Student 2"
          onSelect={(student) => setSelectedSeparatedStudent2 (student.student)}
          items={students}
        />
        <button onClick={addSeparatedStudentPair}>Separate</button>

        <h3>Group Size</h3>
        <div className={classes.inputContainer}>
          <input type="number" id="groupSize" name="groupSize" min="2" max="6" defaultValue={5} ref={groupSizeInputRef} />
          <button onClick={runAlgorithmHandler}>Generate</button>
        </div>

        <p>CONNECTED PAIRS</p>
        <StudentPairPanel pairs={connectedStudents} />

        <p>SEPARATED PAIRS</p>
        <StudentPairPanel pairs={separatedStudents} />
      </div>}
    </div>
  );
}

export default OptionsPage;
