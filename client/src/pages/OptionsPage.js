import { useRef, useState, useCallback, useEffect, useContext } from 'react'; 

import DatalistInput from 'react-datalist-input'; 
import StudentPairPanel from '../components/StudentPairPanel';

// import classes from './OptionsPage.module.css'; 

import PageContext from '../store/PageContext';
import PartitionContext from '../store/PartitionContext';
import LoadingContext from '../store/LoadingContext';
import StudentList from '../components/StudentList';

function OptionsPage() 
{ 
  const { setOnOptionsPage } = useContext (PageContext); 
  const { setPartition } = useContext (PartitionContext);  
  const { setIsLoading } = useContext (LoadingContext); 

  // const teacherIds = ["kem", "tzh", "lmg", "gma", "awa", "vrb", "att", "dak", "awj"]; 

  // const teacherIdOptions = teacherIds.map((id) => ({ id: id, value: id })); // format into items for dropdown

  // Loading classes when teacher ID selected
  // let teacherId = ""; 
  const [teacherId, setTeacherId] = useState(null); 
  const [classItems, setClassItems] = useState([]); // CLASS ITEMS: class options for dropdown (all classes taught by teacher with teacherID)

  const teacherIdInputRef = useRef(); 
  const updateTeacherIdHint = () => 
  {
    
  }
  
  const teacherSelectHandler = () => 
  {   
    // SL CLASS: 11SCOM3C2E
    // HL CLASS: 11HCOM3C2E

    const getClasses = async() => 
    {
      setIsLoading(true); 

      const teacherIdInput = teacherIdInputRef.current.value; 

      if (teacherIdInput.length <= 2)
      {
        console.log ("Invalid teacher id"); 
        return; 
      }

      const response = await fetch ("/api/cims/classes", // get students for selected teacher's class
      { 
        body: JSON.stringify ({ teacherId: teacherIdInput }), // send over text representation of json object 
        headers: { "Content-Type": "application/json" }, // let server know to turn plain text back into json object
        method: "POST"
      }); 
      const data = await response.json(); // array of classes 

      // console.log(data)

      if (data.length > 0)
      {
        setTeacherId(teacherIdInput);                               
        const classItems = data.map ((className) => ({ id: className.classId, value: className.classCode, classId: className.classId })) // value is displayed in dropdown, classId is passed to backend
        // console.log (classItems.map(item => item.value)) // array of class codes
        // console.log(">>>>>>>>>>>>>>>> CLASS ITEMS: ")
        // console.log(classItems);
        setClassItems (classItems); 
      }
      else
      {
        setTeacherId(null); 
        setClassItem(null); 
        setPairedStudents([]); 
        setSeparatedStudents([]); 
      }

      setIsLoading(false); 
    }

    getClasses (); 
  }

  const [classItem, setClassItem] = useState (null); // class item including class code and class id
  // const [studentItems, setStudentItems] = useState([]); // array of all students given selected class code
  const [students, setStudents] = useState([]); // array of all students given selected class
  const [includedStudents, setIncludedStudents] = useState([]); // array of bools indicating whether a student is 

  const selectClassHandler = useCallback((classItem) => 
  {
    // setClassId (classCode.classId); 
    setClassItem(classItem); 
  }, []); 

  useEffect (() => 
  {
    if (classItem === null)
      return; 

    const getStudents = async() => 
    {
      setIsLoading(true); 

      let response = await fetch ("/api/cims/students", // get students for selected class
      { 
        body: JSON.stringify ({ classId: classItem.classId }), // send over text representation of json object 
        headers: { "Content-Type": "application/json" }, // let server know to turn plain text back into json object
        method: "POST"
      }); 
      let data = await response.json(); 

      const classCode = classItem.value; // checking if SL class code with existing/matching HL class, hl students to be added too

      let hasHlMatch = false; 
      let hlClassId = ""; 

      if (classCode[2] === "S") // given an SL class
      {
        let hlClassCode = classCode.substring(0, 2) + "H" + classCode.substring(3); 

        const classIds = classItems.map(item => item.value); 
        const hlMatchIndex = classIds.indexOf(hlClassCode); 

        hasHlMatch = hlMatchIndex !== -1; 
        if (hasHlMatch)
          hlClassId = classItems[hlMatchIndex].classId; 
      }

      if (hasHlMatch)
      {
        response = await fetch ("/api/cims/students", // get students for matching hl class
        { 
          body: JSON.stringify ({ classId: hlClassId }), // send over text representation of json object 
          headers: { "Content-Type": "application/json" }, // let server know to turn plain text back into json object
          method: "POST"
        }); 
        const newData = await response.json(); // new students
        data = data.concat(newData); 
      }

      setStudents(data); 
      setIncludedStudents(Array(data.length).fill(true)); 
      
      setIsLoading(false); 
    }

    getStudents(); 
  }, [classItem]); 

  const getStudentName = (student) => 
  {
    return (!('givenName' in student) || student.givenName === '') ? student.forename : student.givenName; 
  }

  const getStudentItems = (students) => // format as item for dropdown
  {
    return students.map ((student) => ({ id: student.username, value: getStudentName(student), student })) // some student objects don't have property givenName
  }

  // Running algorithm  
  const groupSizeInputRef = useRef (); 
  const runAlgorithmHandler = async() => 
  {
    const groupSize = groupSizeInputRef.current.value; 

    if (groupSize > includedStudents.filter(x => x == true).length)
    {
      console.log ("Group size too large"); 
      return; 
    }

    setIsLoading (true); 


    const algorithmData = 
    {
      // classId: classItem.classId, 
      students, 
      groupSize, 
      includedStudents, 
      pairedStudents, 
      separatedStudents
    }

    console.log(algorithmData)

    const response = await fetch ("/api/personalityData", 
    { 
      body: JSON.stringify (algorithmData), // send over text representation of json object 
      headers: { "Content-Type": "application/json" }, // let server know to turn plain text back into json object
      method: "POST"
    }); 
    const data = await response.json(); // returns an empty array if invalid teacher id

    console.log (">>>>>>>>>>>>>>>>>>˘"); 
    console.log (data); 
    console.log (">>>>>>>>>>>>>>>>>>˘"); 

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

  const toggleStudentIncluded = (index) => // toggle whether a student is included in 
  {
    let newIncludedStudents = includedStudents; 
    newIncludedStudents[index] = !newIncludedStudents[index]; 

    setIncludedStudents ([...newIncludedStudents]); // spread array so react component re-renders
  }

  return (
    <div>
      {/* <DatalistInput 
        placeholder="Teacher ID (e.g. kem)"
        onSelect={(id) => teacherSelectHandler(id)}
        items={teacherIdOptions}
      /> */}

      <input type="text" id="teacherId" name="Teacher ID (e.g. kem)" maxLength={3} onChange={updateTeacherIdHint} ref={teacherIdInputRef} />
      <button onClick={teacherSelectHandler}>Select</button>

      {teacherId && <DatalistInput // TODO: automatically select current class being taught (from CIMS); add (current) to name in dropdown list
        placeholder="Class"
        onSelect={(classItem) => selectClassHandler (classItem)}
        items={classItems}
        value=""
      />}

  
      {classItem && <div>
        <StudentList students={students.map(student => getStudentName(student))} includedStudents={includedStudents} toggleStudentIncluded={toggleStudentIncluded} />
        {/* <StudentList students={studentItems.map(student => student.value)} includedStudents={includedStudents} toggleStudentIncluded={toggleStudentIncluded} /> */}
        <h2>Group Size</h2>
        <div>
          <input type="number" id="groupSize" name="groupSize" min="2" max="6" defaultValue={5} ref={groupSizeInputRef} />
          <button onClick={runAlgorithmHandler}>Generate</button>
        </div>

        <button onClick={toggleAffiliationPanel}>SETTINGS</button>
      </div>}
      { affiliationPanelActive && <StudentPairPanel 
      // { true && <StudentPairPanel 
        studentItems={getStudentItems(students)} 
        pairedStudents={pairedStudents}
        separatedStudents={separatedStudents}
        closeAffiliationPanel={toggleAffiliationPanel}
        updateAffiliations={updateAffiliations} /> }
    </div>
  );
}

export default OptionsPage;
