import classes from './Layout.module.css'

function Layout (props)
{
    return <div className={classes.container}>
        {props.children}
    </div>
}

export default Layout; 