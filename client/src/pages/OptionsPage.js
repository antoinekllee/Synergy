import { useRef, useState, useCallback, useEffect, useContext } from 'react'; 

// import StudentPairPanel from '../components/StudentPairPanel';
import DatalistInput from 'react-datalist-input'; 
import StudentPairPanel from '../components/StudentPairPanel';

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
      pairedStudents, 
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

  const [affiliationPanelActive, setAfflilationPanelActive] = useState (false); 
  const [pairedStudents, setPairedStudents] = useState([]); 
  const [separatedStudents, setSeparatedStudents] = useState([]); 

  const toggleAffiliationPanel = () => 
  {
    setAfflilationPanelActive (!affiliationPanelActive); 
  }

  const updateAffiliations = (newPairedStudents, newSeparatedStudents) => 
  {
    setPairedStudents (newPairedStudents); 
    setSeparatedStudents (newSeparatedStudents)
  }

  const removeAffiliation = (isPair, index)  => 
  {
    let newAffiliations = isPair ? pairedStudents : separatedStudents; 
    newAffiliations.splice (index, 1); 

    if (isPair)
    {
			console.log ("REMOVING PAIR AT INDEX " + index); 
      setPairedStudents (newAffiliations); 
    }
    else
    {
      console.log ("REMOVING SEPARATED PAIR AT INDEX " + index); 
      setSeparatedStudents (newAffiliations); 
    }
  }

  return (
    <div className={classes.container}>
      <h1>SYNERGY</h1>

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
        <h2>Group Size</h2>
        <div className={classes.inputContainer}>
          <input type="number" id="groupSize" name="groupSize" min="2" max="6" defaultValue={5} ref={groupSizeInputRef} />
          <button onClick={runAlgorithmHandler}>Generate</button>
        </div>

        <button onClick={toggleAffiliationPanel}>SETTINGS</button>
      </div>}
      { affiliationPanelActive && <StudentPairPanel 
      // { true && <StudentPairPanel 
        students={students} 
        pairedStudents={pairedStudents}
        separatedStudents={separatedStudents}
        closeAffiliationPanel={toggleAffiliationPanel}
        removeAffiliation={removeAffiliation}
        updateAffiliations={updateAffiliations} /> }
    </div>
  );
}

export default OptionsPage;
