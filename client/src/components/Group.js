function Group (props)
{
    const namesList = <ul>{props.names.map ((name) => <li>{name}</li>)}</ul>; 

    return <div>
        { namesList }
    </div>; 
}

export default Group; 