import { React, useContext } from 'react'; 

import InfoPanelContext from '../store/InfoPanelContext';
import classes from './InfoPanel.module.css'; 

function InfoPanel (props)
{
    const { setInfoPanelActive } = useContext (InfoPanelContext); 

    return <div className={classes.container}>
        <div className={classes.body}>
            <h1>Info</h1>
            <ul className={classes.infoList}>
                <li>Partitions a class into optimally performing groups</li>
                {/* <li>Partitions a class into optimally performing groups</li> */}
                <li>Personalities are represented as a 4 dimensional vectors</li>
                <ol>
                    <li>{`Sensing vs Intuition (SN)`}</li>
                    <li>{`Thinking vs Feeling (TF)`}</li>
                    <li>{`Extroversion vs Introversion (EI)`}</li>
                    <li>{`Perception vs Judgement (PJ)`}</li>
                </ol>
                <li>Groups are generated based on four principles:</li>
                <ol>
                    <li>Cognitive Diversity</li>
                    <li>Leadership</li>
                    <li>Introversion</li>
                    <li>Gender Balance</li>
                </ol>
            </ul>
            <button className={classes.closeButton} onClick={() => setInfoPanelActive(false)}>x</button>
        </div>
    </div>
}

export default InfoPanel; 
