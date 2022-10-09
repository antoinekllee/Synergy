const algorithm = async( students, groupSize ) => 
{
    const groups = [[]]; 

    for (let i = 0; i < students.length; i++)
    {
        if (groups[groups.length - 1].length >= groupSize)
            groups.push([]);

        groups[groups.length - 1].push((students[i].givenName === "" ? students[i].forename : students[i].givenName) + " " + students[i].surname); 
    }

    return groups; 
}

module.exports = { algorithm }; 