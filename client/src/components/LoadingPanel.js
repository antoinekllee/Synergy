import classes from './LoadingPanel.module.css'; 

function LoadingPanel ()
{
    return <div className={classes.container}>
        <p className={classes.loadingText}>LOADING...</p>
    </div>
}

export default LoadingPanel; 