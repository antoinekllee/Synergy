import { useContext } from 'react'; 

import PageContext from '../store/PageContext';
import PartitionContext from '../store/PartitionContext';

import classes from './PartitionPage.module.css'; 

import GroupPanel from '../components/GroupPanel'; 

function PartitionPage ()
{
    const { setOnOptionsPage} = useContext (PageContext); 
    const { partition } = useContext (PartitionContext); 

    return <div>
        <h1>GROUPS</h1>
        <div className={classes.container}>
            { partition.map((group, index) => <GroupPanel students={group} key={index} />) }
        </div>
        {/* <button onClick={() => setOnOptionsPage (true)}>OPTIONS</button> */}
    </div>; 
}

export default PartitionPage; 