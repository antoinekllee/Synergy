import { useRef, useState } from 'react'; 

import Group from './components/Group'; 

function App() 
{
  const teachers = ["kem", "tzu", "lmg", "gma", "awa", "vrb", "att", "dak"]; 
  const teacherList = <datalist id="teacherList">{teachers.map (id => <option value={id} key={id} />)}</datalist>; 

  const [groups, setGroups] = useState ([]); 

  const teacherIDInputRef = useRef (); 
  const groupSizeInputRef = useRef (); 

  const submitHandler = async(event) => 
  {
    event.preventDefault (); 

    const teacherID = teacherIDInputRef.current.value; 
    const groupSize = groupSizeInputRef.current.value; 

    const groupingData = 
    {
      teacherID, 
      groupSize
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

  return (
    <div>
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="teacherList">Teacher ID</label>
          <input list="teacherList" placeholder="Teacher ID" required ref={teacherIDInputRef}/>
          { teacherList }
        </div>

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
    </div>
  );
}

export default App;
