import { useContext } from 'react'; 

import PageContext from '../store/PageContext';
import PartitionContext from '../store/PartitionContext';

import GroupPanel from '../components/GroupPanel'; 

function PartitionPage ()
{
    const { onSettingsPage, setOnSettingsPage} = useContext (PageContext); 
    const { partition, setPartition } = useContext (PartitionContext); 

    return <div>
        <h1>GROUPS</h1>
        <h2>{ onSettingsPage }</h2>
        <p>GROUPS</p> 
        { partition.map((group, index) => <GroupPanel students={group} key={index} />) }

        <button onClick={() => setOnSettingsPage (true)}>SETTINGS</button>
    </div>; 
}

export default PartitionPage; 