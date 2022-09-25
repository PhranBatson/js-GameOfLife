let doGoOn = true;
let firstClick = true;
let generationalDelay = 500;
let patternsArray = [];

const rows = 30;
const cols = 60;

const startButton = document.querySelector('.js-start');
const stopButton = document.querySelector('.js-stop');
const plusButton = document.querySelector('.js-plus');
const minusButton = document.querySelector('.js-minus');
const info = document.querySelector('.js-info');
const heading = document.querySelector('.js-heading');
const tileContainer = document.querySelector('.js-container');

function nextGen(parents) {
    var children = new Array(rows);
    for (var i=0; i < rows; i++) {
        children[i]=new Array(cols);
    };

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            var address = [i, j];
            var howManyAbutt = countAbutt(parents, address);

            // This is where Conway's rules are applied
            if(parents[i][j] == 'alive' && (howManyAbutt <2 || howManyAbutt >3)) children[i][j] = 'dead';
            if(parents[i][j] == 'alive' && (howManyAbutt==2 || howManyAbutt==3)) children[i][j] = 'alive';
            if(parents[i][j] == 'dead'  && howManyAbutt==3) children[i][j] = 'alive';
            if(parents[i][j] == 'dead'  && howManyAbutt!=3) children[i][j] = 'dead';
        }
    }

    return children;
}

function countAbutt(array, address) {
    var howManyAbutt = 0;

    for (let i = address[0]-1; i <= address[0]+1; i++ ) {
        for (let j = address[1]-1; j <= address[1]+1; j++ ) {
            //protects from checking out of bounds
            if (
                i >= 0 && i < rows &&
                j >= 0 && j < cols &&
                array[i][j] == 'alive'
            )
            howManyAbutt++;
        }
    }

    //Don't count itself if it's alive
    if(array[address[0]][address[1]] == 'alive') howManyAbutt--;

    return howManyAbutt;
}

function putStatus(genArray) {
    var index = 1;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const tile = document.querySelector(`[data-id='${index}']`);
            if (genArray[i][j] == 'dead') { tile.classList.add('cell-dead'); tile.classList.remove('cell-alive') }
            else if (genArray[i][j] == 'alive') { tile.classList.add('cell-alive'); tile.classList.remove('cell-dead') }
            else { tile.classList.remove('cell-alive'); tile.classList.remove('cell-dead') }

            index++;
        }
    }

}

function getStatus() {
    var genArray = new Array(rows);
    for (var i=0; i < rows; i++) {
        genArray[i]=new Array(cols);
    }

    var index = 1;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const tile = document.querySelector(`[data-id='${index}']`);
            if (tile.classList.contains('cell-dead')) { genArray[i][j] = 'dead'; }
            else if (tile.classList.contains('cell-alive')) { genArray[i][j] = 'alive'; }
            else { genArray[i][j] = 'error'; }

            index++;
        }
    }

    return genArray;
}

function runGame() {
    info.classList.remove('hidden');
    tileContainer.classList.add('unclickable');
    heading.textContent = `You've started it.`;
    let genNow = [];

    console.log(patternsArray[1].name);

    //this if statement logs the relative pattern that's active when the start button is first clicked
    if(firstClick) {
        var index = 1;
        var pattern = [];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const tile = document.querySelector(`[data-id='${index}']`);
                if (tile.classList.contains('cell-alive')) { pattern.push(index) }
                index++;
            }
        }
        console.log(makePatternAbsolute(pattern));
        firstClick = false; 
    }

    //calculates the next generation with the current status
    genNow = nextGen(getStatus());
    putStatus(genNow);

    myTimeout = setTimeout(runGame, generationalDelay);

}

// this function stops the game
function stopGame() {
    clearTimeout(myTimeout);
    tileContainer.classList.remove('unclickable');
    info.classList.remove('hidden');
    heading.textContent = `You've stopped it.`;
}

// clicking on a cell toggles whether it is dead or alive
function cellClick(tile) {
    tile.classList.toggle('cell-dead');
    tile.classList.toggle('cell-alive');
}

function makePatternRelative(absolutePattern) {
    var relativePattern = [];
    for(let i = 0; i < absolutePattern.length; i++) {
        let outPoint = cols*(absolutePattern[i][1]-1) + absolutePattern[i][0]
        relativePattern.push(outPoint);
    }
    return relativePattern;
}

function makePatternAbsolute(relativePattern) {
    var absolutePattern = [];
    for(let i = 0; i < relativePattern.length; i++) {
        var yPointOut = Math.floor(relativePattern[i]/cols) + 1;
        var xPointOut = relativePattern[i] - (cols*(yPointOut-1));
        var absolutePoint = [xPointOut, yPointOut]
        absolutePattern.push(absolutePoint);
    }
    return absolutePattern;
}

function buildCells() {
    const howMany=rows*cols;

    let blinkerPattern = [[2,2], [3,2], [4,2]];
    let pulsarPattern = [[15,16],[16,16],[17,16],[21,16],[22,16],[23,16],[13,18],[18,18],[20,18],[25,18],[13,19],[18,19],[20,19], [ 25, 19 ], [ 13, 20 ], [ 18, 20 ], [ 20, 20 ], [ 25, 20 ], [ 15, 21 ], [ 16, 21 ], [ 17, 21 ], [ 21, 21 ], [ 22, 21 ], [ 23, 21 ], [ 15, 23 ], [ 16, 23 ], [ 17, 23 ], [ 21, 23 ], [ 22, 23 ], [ 23, 23 ], [ 13, 24 ], [ 18, 24 ], [ 20, 24 ], [ 25, 24 ], [ 13, 25 ], [ 18, 25 ], [ 20, 25 ], [ 25, 25 ], [ 13, 26 ], [ 18, 26 ], [ 20, 26 ], [ 25, 26 ], [ 15, 28 ], [ 16, 28 ], [ 17, 28 ], [ 21, 28 ], [ 22, 28 ], [ 23, 28 ] ];
    let pentadecathlonPattern = [ [ 20, 14 ], [ 20, 15 ], [ 19, 16 ], [ 21, 16 ], [ 20, 17 ], [ 20, 18 ], [ 20, 19 ], [ 20, 20 ], [ 19, 21 ], [ 21, 21 ], [ 20, 22 ], [ 20, 23 ] ];
    let gosperGliderGunPattern = [ [ 26, 2 ], [ 24, 3 ], [ 26, 3 ], [ 14, 4 ], [ 15, 4 ], [ 22, 4 ], [ 23, 4 ], [ 36, 4 ], [ 37, 4 ], [ 13, 5 ], [ 17, 5 ], [ 22, 5 ], [ 23, 5 ], [ 36, 5 ], [ 37, 5 ], [ 2, 6 ], [ 3, 6 ], [ 12, 6 ], [ 18, 6 ], [ 22, 6 ], [ 23, 6 ], [ 2, 7 ], [ 3, 7 ], [ 12, 7 ], [ 16, 7 ], [ 18, 7 ], [ 19, 7 ], [ 24, 7 ], [ 26, 7 ], [ 12, 8 ], [ 18, 8 ], [ 26, 8 ], [ 13, 9 ], [ 17, 9 ], [ 14, 10 ], [ 15, 10 ] ];
    let growForeverPattern = [ [ 23, 20 ], [ 21, 21 ], [ 23, 21 ], [ 24, 21 ], [ 21, 22 ], [ 23, 22 ], [ 21, 23 ], [ 19, 24 ], [ 17, 25 ], [ 19, 25 ] ];

    let relativePattern = makePatternRelative(pentadecathlonPattern);

    //create the div tiles based on how many rows*cols there are
    for (let i = 1; i <= howMany; i++) {
        var div = document.createElement('div');
        div.classList.add('tile', 'tile-cell', 'cell-dead');
        div.setAttribute('data-id', i);
        div.addEventListener('click', () => {
            const tile = document.querySelector(`[data-id='${i}']`);
            cellClick(tile);
        })

        if (relativePattern.includes(i)) {div.classList.add('cell-alive'); div.classList.remove('cell-dead')}

        tileContainer.appendChild(div);
    }

    // set grid-template-rows and grid-template-columns for CSS
    var tempString = '';
    for (let i = 1; i <=rows; i++) {
        tempString += '15px ';
    }
    tileContainer.style.gridTemplateRows = tempString;

    var tempString = '';
    for (let i = 1; i <=cols; i++) {
        tempString += '15px ';
    }
    tileContainer.style.gridTemplateColumns = tempString;
}

function fetchPatterns() {

    fetch('./patterns.json')
        .then(response => response.json())
        .then(data => patternsArray = data.patterns)
        .catch(err => console.log(err));
}

fetchPatterns()

startButton.addEventListener('click', runGame);
stopButton.addEventListener('click', stopGame);
plusButton.addEventListener('click', () => {generationalDelay-=100;})
minusButton.addEventListener('click', () => {generationalDelay+=100;})
window.onload = buildCells;