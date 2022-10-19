const algorithm = async(students, groupSize, connectedStudents, separatedStudents) => 
{
    console.log ("CONNECTED: "); 
    console.log (connectedStudents); 
    console.log ("SEPARATED: "); 
    console.log (separatedStudents); 

    console.log (">>>>>>>>>>>>>>>>>>>> Running Algorithm"); 
    const bestPartition = []; 
    let usedAgents = []; // all agents added to bestPartition thus far (for initial partition)

    const quantitativeDistribution = setQuantitativeDistribution (students.length, groupSize); 
    console.log (">>>>>>>>>>>>>>>>>>>> Set Quantitative Distribution:"); 
    console.log (quantitativeDistribution)
    
    // 1. INITIAL GREEDY SOLUTION
    quantitativeDistribution.forEach((distribution) => 
    {
        let combinations = getCombinations(students, distribution.teamSize); 
        combinations = combinations.sort ((team1, team2) => // sort descending based on calculated utility
        {
            const team1Utility = getUtility (team1); 
            const team2Utility = getUtility (team2); 

            if (team1Utility > team2Utility) return -1; 
            else if (team1Utility < team2Utility) return 1; 
            else return 0; 
        }); 

        let teamsRemaining = distribution.teamCount; 
        let index = 0; 

        while (teamsRemaining > 0 && index < combinations.length)
        {
            if (!combinations[index].some (agent => usedAgents.includes(agent)))
            {
                // console.log (">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> " + index); 
                // console.log ("Current combination: "); 
                // console.log (combinations [index].map(x => x.forename)); 
                
                bestPartition.push (combinations[index]); 
                usedAgents = usedAgents.concat(combinations[index]); 
                teamsRemaining--; 

                // console.log ("Used agents: "); 
                // console.log (usedAgents.map(x => x.forename)); 
            }

            index++; 
        }
    }); 

    console.log (">>>>>>>>>>>>>>>>>>>> Initial Greedy Solution:"); 
    console.log (bestPartition.map(group => group.map(agent => agent.forename))); 

    // 2. OPTIMISE SOLUTION (100 TIMES W/O IMPROVEMENT)

    let iterations = 0; 

    while (iterations < 100)
    {
        let firstIndex = Math.floor(Math.random() * bestPartition.length); 
        let secondIndex = Math.floor(Math.random() * bestPartition.length); 

        while (secondIndex == firstIndex && bestPartition.length > 1)
            secondIndex = Math.floor(Math.random() * bestPartition.length); 

        let firstTeam = bestPartition[firstIndex]; 
        let secondTeam = bestPartition[secondIndex]; 

        const originalUtility = getUtility (firstTeam) * getUtility (secondTeam); 

        const allAgents = firstTeam.concat (secondTeam); 

        let firstTeamCombinations = getCombinations (allAgents, firstTeam.length); // all possible combinations of first team's size
        let allSubPartitions = []; // all possible partitions given the 2 teams

        if (firstTeam.length == secondTeam.length) // if both teams same size, second half of combinations will be repeated/reverse of the first half
            firstTeamCombinations = firstTeamCombinations.slice(0, Math.ceil(firstTeamCombinations.length / 2)); 
        
        firstTeamCombinations.forEach (firstTeam => 
        {
            const secondTeam = allAgents.filter((agent) => !firstTeam.includes(agent)); 
            allSubPartitions.push ([firstTeam, secondTeam]); 
        }); 

        let bestSubPartition = []; 
        let bestSubPartitionUtility = 0; 

        allSubPartitions.forEach(partition => 
        {
            const partitionUtility = getUtility(partition[0]) * getUtility(partition[1]); 

            if (partitionUtility > bestSubPartitionUtility)
            {
                bestSubPartition = partition; 
                bestSubPartitionUtility = partitionUtility; 
            }
        });

        if (bestSubPartitionUtility > originalUtility)
        {
            bestPartition[firstIndex] = bestSubPartition[0]; 
            bestPartition[secondIndex] = bestSubPartition[1]; 

            console.log (">>>>>>>>>>>>>>>>>>>> Improved Partition"); 

            iterations = 0; 
        }

        iterations++; 
    }

    console.log (">>>>>>>>>>>>>>>>>>>> Final Partition:"); 
    console.log (bestPartition.map(group => group.map(agent => agent.forename))); 

    return bestPartition; 
}

const getUtility = (team) => 
{
    const diversity = standardDeviation(team.map(x => x.personality.sn)) * standardDeviation(team.map(x => x.personality.tf)); 
    // TODO: CHECK UTILITY FUNCTION WORKS
    
    const a = diversity / 3; // alpha
    const leadershipScores = team.map(agent => dotProduct([0, -a, -a, a], Object.values(agent.personality))); // leadership score (how likely is the agent to be a good leader) for each agent
    const leadership = leadershipScores.reduce((currentMax, value) => currentMax > value ? currentMax : value, 0); // use instead of Math.max // gets max value (above 0)

    const b = diversity; // beta = a * 3
    const introversionScores = team.map(agent => dotProduct([0, 0, b, 0], Object.values(agent.personality))); // introversion score (how introverted is each agent)
    const introversion = introversionScores.reduce((currentMax, value) => currentMax > value ? currentMax : value, 0); // use instead of Math.max // gets max value (above 0)

    const g = 0.25; // setting constant gamma to 0.25
    const femaleCount = team.reduce((currentFemaleCount, agent) => currentFemaleCount + (agent.sex === 'F' ? 1 : 0), 0);
    const genderBalance = g * Math.sin(Math.PI * (femaleCount / team.length)); 

    return diversity + leadership + introversion + genderBalance; 
}

const dotProduct = (arr1, arr2) => // dot product of 2 arrays which represent vectors
{
    return arr1.map((x, i) => arr1[i] * arr2[i]).reduce((m, n) => m + n);
}

const standardDeviation = (arr) => // sample standard deviaton calculation (not population std)
{
    const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length; 
    return Math.sqrt(arr.reduce((acc, val) => acc.concat((val - mean) ** 2), []).reduce((acc, val) => acc + val, 0) / (arr.length - 1));
};

// https://stackoverflow.com/questions/62854395/permutation-on-arrays-without-duplicate-and-fixed-length
const getCombinations = (arr, length) => // get all length sized combinations from array (no duplicates regardless of order)
{
    return arr.flatMap((v, i) => length > 1
        ? getCombinations(arr.slice(i + 1), length - 1).map(w => [v, ...w])
        : [[v]]
    );
}

const setQuantitativeDistribution = (studentCount, targetTeamSize) => 
{
    minTeamCount = Math.floor (studentCount / targetTeamSize); // minimum total number of teams
    extraAgents = studentCount % targetTeamSize; 

    let distribution = []; // list fo objects with teamCount and teamSize

    if (studentCount >= targetTeamSize)
    {
        if (extraAgents == 0)
            distribution.push({ teamCount: minTeamCount, teamSize: targetTeamSize }); 
        else if (extraAgents <= minTeamCount)
        {
            distribution.push ({ teamCount: extraAgents, teamSize: (parseInt (targetTeamSize) + 1) }); 
            distribution.push ({ teamCount: minTeamCount - extraAgents, teamSize: targetTeamSize }); 
        }
        else // extraAgents > minTeamCount
        {
            distribution.push ({ teamCount: minTeamCount, teamSize: targetTeamSize }); 
            distribution.push ({ teamCount: 1, teamSize: extraAgents }); 
            console.log ("LAST CASE"); 
        }
    }
    else
        distribution.push({ teamCount: 0, teamSize: 0 }); // TODO: throw error/warning

    return distribution; 
}

module.exports = { algorithm }; 