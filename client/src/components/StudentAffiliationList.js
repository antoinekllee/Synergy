import classes from './StudentAffiliationList.module.css'; 

function StudentAffiliationList (props)
{
    const pairList = <ul>{props.pairs.map ((pair, index) => 
    {
        const name1 = pair[0].givenName === '' ? pair[0].forename : pair[0].givenName; 
        const name2 = pair[1].givenName === '' ? pair[1].forename : pair[1].givenName; 

        return <li key={index} className={classes.item} onClick={() => props.removeAffiliation (props.isPair, index)}>{name1} and {name2}</li>; // remove item on click, pass in function from props
    })}</ul>; 

    return <div>
        { pairList }
    </div>; 
}

export default StudentAffiliationList; 