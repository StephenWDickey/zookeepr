// requires express module
const express = require('express');

// requires data file
const { animals } = require('./data/animals');

// create variable for different Ports
const PORT = process.env.PORT || 3001;

// 'instantiates' the server
const app = express();

// create function for queries
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        // we save personality traits to array
        // if query returns string, add it to array
        // otherwise save array to variable 
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        }
        else {
            personalityTraitsArray = query.personalityTraits;
        }
        // create for loop
        personalityTraitsArray.forEach(trait => {
            filteredResults = filteredResults.filter( animal => animal.personalityTraits.indexOf(trait) !== -1);
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
};

// creates route we can request data from
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        // we call our query function within get method
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// add listen method to express function
// anonymous function console.logs message 
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});