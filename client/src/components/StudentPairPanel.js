function StudentPairPanel (props)
{
    const pairList = <ul>{props.pairs.map ((pair, index) => 
    {
        const name1 = pair[0].givenName === '' ? pair[0].forename : pair[0].givenName; 
        const name2 = pair[1].givenName === '' ? pair[1].forename : pair[1].givenName; 

        return <li key={index}>{name1} and {name2}<button>-</button></li>; 
    })}</ul>; 

    return <div>
        { pairList }
    </div>; 

    // return <li>{props.pair[0].forename} and {props.pair[1].forename}</li>
}

export default StudentPairPanel; 