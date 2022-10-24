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
        let combinations = getCombinations(students, distribution.groupSize); 
        combinations = combinations.sort ((group1, group2) => // sort descending based on calculated utility
        {
            const group1Utility = getUtility (group1); 
            const group2Utility = getUtility (group2); 

            if (group1Utility > group2Utility) return -1; 
            else if (group1Utility < group2Utility) return 1; 
            else return 0; 
        }); 

        let groupsRemaining = distribution.groupCount; 
        let index = 0; 

        while (groupsRemaining > 0 && index < combinations.length)
        {
            if (!combinations[index].some (agent => usedAgents.includes(agent)))
            {
                // console.log (">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> " + index); 
                // console.log ("Current combination: "); 
                // console.log (combinations [index].map(x => x.forename)); 
                
                bestPartition.push (combinations[index]); 
                usedAgents = usedAgents.concat(combinations[index]); 
                groupsRemaining--; 

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

        let group1 = bestPartition[firstIndex]; 
        let group2 = bestPartition[secondIndex]; 

        const originalUtility = getUtility (group1) * getUtility (group2); 

        const allAgents = group1.concat (group2); 

        let group1Combos = getCombinations (allAgents, group1.length); // all possible combinations of first group's size
        let allSubPartitions = []; // all possible partitions given the 2 groups

        if (group1.length == group2.length) // if both groups same size, second half of combinations will be repeated/reverse of the first half
            group1Combos = group1Combos.slice(0, Math.ceil(group1Combos.length / 2)); 
        
        group1Combos.forEach (group1 => 
        {
            const group2 = allAgents.filter((agent) => !group1.includes(agent)); 
            allSubPartitions.push ([group1, group2]); 
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

const getUtility = (group) => 
{
    const diversity = standardDeviation(group.map(x => x.personality.sn)) * standardDeviation(group.map(x => x.personality.tf)); 
    // TODO: CHECK UTILITY FUNCTION WORKS
    
    const a = diversity / 3; // alpha
    const leadershipScores = group.map(agent => dotProduct([0, -a, -a, a], Object.values(agent.personality))); // leadership score (how likely is the agent to be a good leader) for each agent
    const leadership = leadershipScores.reduce((currentMax, value) => currentMax > value ? currentMax : value, 0); // use instead of Math.max // gets max value (above 0)

    const b = diversity; // beta = a * 3
    const introversionScores = group.map(agent => dotProduct([0, 0, b, 0], Object.values(agent.personality))); // introversion score (how introverted is each agent)
    const introversion = introversionScores.reduce((currentMax, value) => currentMax > value ? currentMax : value, 0); // use instead of Math.max // gets max value (above 0)

    const g = 0.25; // setting constant gamma to 0.25
    const femaleCount = group.reduce((currentFemaleCount, agent) => currentFemaleCount + (agent.sex === 'F' ? 1 : 0), 0);
    const genderBalance = g * Math.sin(Math.PI * (femaleCount / group.length)); 

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

const setQuantitativeDistribution = (studentCount, targetGroupSize) => 
{
    const minGroupCount = Math.floor (studentCount / targetGroupSize); // minimum total number of groups
    const extraAgents = studentCount % targetGroupSize; 

    let distribution = []; // list fo objects with groupCount and groupSize

    if (studentCount >= targetGroupSize)
    {
        if (extraAgents == 0)
            distribution.push({ groupCount: minGroupCount, groupSize: targetGroupSize }); 
        else if (extraAgents <= minGroupCount)
        {
            distribution.push ({ groupCount: extraAgents, groupSize: (parseInt (targetGroupSize) + 1) }); 
            distribution.push ({ groupCount: minGroupCount - extraAgents, groupSize: targetGroupSize }); 
        }
        else // extraAgents > minGroupCount
        {
            distribution.push ({ groupCount: minGroupCount, groupSize: targetGroupSize }); 
            distribution.push ({ groupCount: 1, groupSize: extraAgents }); 
            console.log ("LAST CASE"); 
        }
    }
    else
        distribution.push({ groupCount: 0, groupSize: 0 }); // TODO: throw error/warning

    return distribution; 
}

module.exports = { algorithm }; 