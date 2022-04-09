// requires express module
const express = require('express');
const fs = require('fs');
const path = require('path');

// requires data file
const { animals } = require('./data/animals');

// create variable for different Ports
const PORT = process.env.PORT || 3001;

// 'instantiates' the server
const app = express();

// parse incoming string or array data
app.use(express.urlencoded({extended:true}));
// parse incoming JSON data
app.use(express.json());
// link front end files to webpage
app.use(express.static('public'));

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

// returns animal object based on id
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
};

function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    // this will add our animals array to animals.json
    fs.writeFileSync(
        // we save info in directory of file code is running
        // to the animals.json file
        path.join(__dirname, './data/animals.json'),
        // the array data must be stringified 
        // null means we do not edit our existing data
        // 2 means we create space between values
        JSON.stringify({animals: animalsArray}, null, 2)
    );
    return animal;
};

// we must validate our data before it is added to array
function validateAnimal(animal) {
    // if the new data doesnt have a name
    // or if new data name is not of type string
    // we will return falsy value
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
    }

// creates route we can request data from
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        // we call our query function within get method
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    // if we get an id result then we show it
    if (result) {    
        res.json(result);
    }
    // if no id result send error code
    else {
        res.send(404);
    }
});

// we link to root directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})

// post method for sending data
app.post('/api/animals', (req, res) => {
    // set new animal id based on array length
    req.body.id = animals.length.toString();
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    }
    else {
        // add animal to json file and animals array
        const animal = createNewAnimal(req.body, animals);
        // req.body is incoming content
        res.json(animal);
    }
});

// add listen method to express function
// anonymous function console.logs message 
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});