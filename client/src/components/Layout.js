import { React, useContext } from 'react'; 
// import InfoPanel from './InfoPanel';
import InfoPanelContext from '../store/InfoPanelContext';
import classes from './Layout.module.css'

function Layout (props)
{
    const { infoPanelActive, setInfoPanelActive } = useContext (InfoPanelContext); 

    return <div className={classes.container}>
        <h1>SYNERGY</h1>
        <button className={classes.infoButton} onClick={() => setInfoPanelActive(!infoPanelActive)}>Info</button>
        {props.children}
    </div>
}

export default Layout; 