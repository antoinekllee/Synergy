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
        {/* <div className={classes.backgroundBlocker}></div> */}

        {/* <h1 className={classes.title}>TITLE 2</h1> */}

        <button className={classes.backButton} onClick={() => setOnOptionsPage(true)}>Back</button>
        <div className={classes.groupContainer}>
            { partition.map((group, index) => <GroupPanel students={group} key={index} />) }
        </div>
        {/* <button onClick={() => setOnOptionsPage (true)}>OPTIONS</button> */}
    </div>; 
}

export default PartitionPage; 