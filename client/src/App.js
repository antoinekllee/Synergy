import { useRef, useState, useCallback, useEffect } from 'react'; 

import './App.css';

import Group from './components/Group'; 
import StudentPairPanel from './components/StudentPairPanel';

import DatalistInput from 'react-datalist-input'; 
// import 'react-datalist-input/dist/styles.css';

function App() 
{ 
  // Loading teacher IDs
  const [isLoading, setIsLoading] = useState (true); 
  const [loadedTeachers, setLoadedTeachers] = useState([]); 
    
  useEffect (() => 
  {
      setIsLoading (true); 

      fetch ('http://localhost:3003/teachers') // move to call from backend
          .then (response => 
          {
              return response.json (); 
          }).then (data => 
          {
            const formattedTeachers = data.map((teacher) => ({ id: teacher.id, value: teacher.id })); 

            setIsLoading (false); 
            setLoadedTeachers (formattedTeachers); 
          }); 
  }, []); 

  // TODO: dropdown of classes taught by teacher, automatically selects current class

  // Loading students when teacher ID selected
  const [teacherID, setTeacherID] = useState(); 
  const [loadedClasses, setLoadedClasses] = useState([]); 
  const [loadedStudents, setLoadedStudents] = useState([]); 

  const teacherSelectHandler = useCallback(async(id) => // async function to update array of students to provide options (students who should/should not be grouped together)
  {
    setTeacherID(id.value); 

    // const response = await fetch ('http://localhost:3002/students'); // should get students from this teacher's class
    // const data = await response.json(); 

    // const formattedStudents = data.map ((student) => ({ id: student.givenName === '' ? student.forename : student.givenName, value: student.givenName === '' ? student.forename : student.givenName, student }))

    const response = await fetch ('http://localhost:3004/classes'); // should get students from this teacher's class
    const data = await response.json(); 

    const formattedClasses = data.map ((className) => ({ id: className.classCode, value: className.classCode }))

    setLoadedClasses (formattedClasses); 
  }, []); 

  const [selectedClass, setSelectedClass] = useState (null); 

  const selectClassHandler = async (classCode) => 
  {
    setSelectedClass (classCode); 

    // TODO: load students based on selectedClass

    const response = await fetch ('http://localhost:3002/students'); // should get students from this teacher's class
    const data = await response.json(); 

    const formattedStudents = data.map ((student) => ({ id: student.givenName === '' ? student.forename : student.givenName, value: student.givenName === '' ? student.forename : student.givenName, student }))

    setLoadedStudents (formattedStudents); 
  }

  // Select two students (who must be together/separated)
  const [selectedConnectedStudent1, setSelectedConnectedStudent1] = useState(null); 
  const [selectedConnectedStudent2, setSelectedConnectedStudent2] = useState(null); 

  const [selectedSeparatedStudent1, setSelectedSeparatedStudent1] = useState(null); 
  const [selectedSeparatedStudent2, setSelectedSeparatedStudent2] = useState(null); 

  const [connectedStudents, setConnectedStudents] = useState([]); 
  const [separatedStudents, setSeparatedStudents] = useState([]); 

  const addConnectedStudentPair = () => // bool for whether students are connected or separate
  {
    if (selectedConnectedStudent1 === null || selectedConnectedStudent2 === null)
    {
      console.log ("PAIR CONTAINS NULL STUDENT"); 
      return; 
    }

    if (selectedConnectedStudent1 === selectedConnectedStudent2)
    {
      console.log ("INVALID PAIR"); 
      return; 
    }

    if (pairExists (connectedStudents, [selectedConnectedStudent1, selectedConnectedStudent2]) || pairExists (connectedStudents, [selectedConnectedStudent2, selectedConnectedStudent1]))
    {
      console.log ("PAIR ALREADY EXISTS"); 
      return; 
    }

    let temp = connectedStudents; 
    temp.push ([selectedConnectedStudent1, selectedConnectedStudent2]); 
    setConnectedStudents (temp); 

    console.log ("AFTER"); 
    console.log (connectedStudents); 
  }

  const addSeparatedStudentPair = () => // bool for whether students are connected or separate
  {
    if (selectedSeparatedStudent1 === null || selectedSeparatedStudent2 === null)
    {
      console.log ("PAIR CONTAINS NULL STUDENT"); 
      return; 
    }

    if (selectedSeparatedStudent1 === selectedSeparatedStudent2)
    {
      console.log ("INVALID PAIR"); 
      return; 
    }

    if (pairExists (separatedStudents, [selectedSeparatedStudent1, selectedSeparatedStudent2]) || pairExists (separatedStudents, [selectedSeparatedStudent2, selectedSeparatedStudent1]))
    {
      console.log ("PAIR ALREADY EXISTS"); 
      return; 
    }

    let temp = separatedStudents; 
    temp.push ([selectedSeparatedStudent1, selectedSeparatedStudent2]); 

    setSeparatedStudents (temp); 
  }

  const pairExists = (pairArr, newPair) => // check if student pair (together/separated) already registered
  {
    const pairString = JSON.stringify(newPair); // convert to string to be compared
    return pairArr.some ((pair) => JSON.stringify (pair) === pairString); 
  }

  // Running algorithm
  const [groups, setGroups] = useState ([]); 
  const groupSizeInputRef = useRef (); 
  const runAlgorithmHandler = async(event) => 
  {
    event.preventDefault (); 

    const groupSize = groupSizeInputRef.current.value; 

    console.log ("Running algorithm on class " + teacherID + " with group size " + groupSize); 

    const groupingData = 
    {
      teacherID, 
      groupSize, 
      connectedStudents, 
      separatedStudents
    }

    const response = await fetch ("/api/personalityData/getPersonalityData", 
    { 
      body: JSON.stringify (groupingData), // send over text representation of json object 
      headers: { "Content-Type": "application/json" }, // let server know to turn plain text back into json object
      method: "POST"
    }); 
    const data = await response.json(); 

    setGroups (data); 
  }

  if (isLoading)
  {
      return <section>
          <p>Loading...</p>
      </section>; 
  }

  return (
    <div className='container'>
      <h1>SETTINGS</h1>

      {/* <h2>Teacher ID</h2> */}
      <DatalistInput 
        // isExpandedStyle={inline}
        placeholder="Teacher ID"
        onSelect={(id) => teacherSelectHandler(id)}
        items={loadedTeachers}
      />

      {/* <h2>Class</h2> */}
      <DatalistInput // should automatically select current class being taught (from CIMS) 
        placeholder="Class"
        onSelect={(classCode) => selectClassHandler (classCode)}
        items={loadedClasses}
      />
  
      {/* TODO: Only show once class is selected */}
      <h3>Pair Students</h3>
      <DatalistInput 
        placeholder="Student 1"
        onSelect={(student) => setSelectedConnectedStudent1 (student.student)}
        items={loadedStudents}
      />
      <DatalistInput 
        placeholder="Student 2"
        onSelect={(student) => setSelectedConnectedStudent2 (student.student)}
        items={loadedStudents}
      />
      <button onClick={addConnectedStudentPair}>Pair</button>
      
      <h3>Separate Students</h3>
      <DatalistInput 
        placeholder="Student 1"
        onSelect={(student) => setSelectedSeparatedStudent1 (student.student)}
        items={loadedStudents}
      />
      <DatalistInput 
        placeholder="Student 2"
        onSelect={(student) => setSelectedSeparatedStudent2 (student.student)}
        items={loadedStudents}
      />
      <button onClick={addSeparatedStudentPair}>Separate</button>

      <form onSubmit={runAlgorithmHandler}>
        <div>
          <label htmlFor="groupSize">Group Size</label>
          <input type="number" id="groupSize" name="groupSize" min="2" max="6" defaultValue={5} ref={groupSizeInputRef} />
        </div>

        <div>
          <button>Generate</button>
        </div>
      </form>

      <p>GROUPS</p> 
      { groups.map((group, index) => <Group students={group} key={index} />) }

      <p>CONNECTED PAIRS</p>
      <StudentPairPanel pairs={connectedStudents} />
      {/* { connectedStudents.map((pair, index) => <StudentPairPanel pair={pair} key={index} />) } */}

      { connectedStudents }

      <p>SEPARATED PAIRS</p>
      <StudentPairPanel pairs={separatedStudents} />
    </div>
  );
}

export default App;
