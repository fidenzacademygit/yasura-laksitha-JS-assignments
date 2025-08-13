const solvedPuzzleState = [
    ['0-0', '0-1', '0-2'],
    ['1-0', '1-1', '1-2'],
    ['2-0', '2-1', null],
];
const ROWS = 3;
const COLS = 3;

let currentPuzzleState = solvedPuzzleState.map(row => [...row]);
let emptyPosition = {row: 2, col: 2};
let isInitState = true;

function isNeighbour(clickedTile) {
    const {row, col} = clickedTile;
    return row === emptyPosition.row && Math.abs(col - emptyPosition.col) === 1 ||
        col === emptyPosition.col && Math.abs(row - emptyPosition.row) === 1
}

function onTileClicked(tileId) {
    if (isInitState) isInitState = false;

    const tile = document.getElementById(tileId);
    const clickedTile = {
        row: parseInt(tile.getAttribute('data-row')),
        col: parseInt(tile.getAttribute('data-col')),
    }

    if (isNeighbour(clickedTile)) {
        [
            currentPuzzleState[clickedTile.row][clickedTile.col],
            currentPuzzleState[emptyPosition.row][emptyPosition.col]
        ] = [
            currentPuzzleState[emptyPosition.row][emptyPosition.col],
            currentPuzzleState[clickedTile.row][clickedTile.col],
        ]

        emptyPosition = {row: clickedTile.row, col: clickedTile.col};
        renderPuzzle(currentPuzzleState);
    }
}

function renderPuzzle(puzzleState) {
    const imageContainer = document.querySelector('.image-container');
    imageContainer.innerHTML = "";

    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            const div = document.createElement('div');
            const cellValue = puzzleState[i][j];

            div.setAttribute('data-row', i.toString());
            div.setAttribute('data-col', j.toString());

            if (!cellValue) {
                div.classList.add('empty');
            } else {
                const [row, col] = cellValue.split("-").map(Number);
                const sliceNumber = row * 3 + col + 1;

                div.setAttribute('id', `slice-${cellValue}`)
                div.classList.add('image-slice', `slice-${sliceNumber}`);
                div.addEventListener('click', () => onTileClicked(`slice-${cellValue}`));
            }

            imageContainer.appendChild(div);
        }
    }
    setPuzzleSolvedState();
}

function shuffle() {
    const tileArray = solvedPuzzleState.flat().filter(tile => tile !== null);

    for (let i = tileArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tileArray[i], tileArray[j]] = [tileArray[j], tileArray[i]];
    }

    const clonedPuzzle = Array.from({length: ROWS}, () => new Array(COLS).fill(null));

    const emptyRow = Math.floor(Math.random() * ROWS);
    const emptyCol = Math.floor(Math.random() * COLS);
    emptyPosition = {row: emptyRow, col: emptyCol};

    let tileIndex = 0;

    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            if (i === emptyRow && j === emptyCol) {
                clonedPuzzle[i][j] = null;
            } else {
                clonedPuzzle[i][j] = tileArray[tileIndex++];
            }
        }
    }

    if (isPuzzleSolvable(clonedPuzzle)) {
        currentPuzzleState = clonedPuzzle;
        renderPuzzle(currentPuzzleState);
    } else {
        shuffle();
    }
}

function isPuzzleSolvable(puzzleState) {
    const flatPuzzle = puzzleState.flat().filter(str => str !== null);
    let inversionCount = 0;

    const tileNumbers = flatPuzzle.map(cellValue => {
        const [row, col] = cellValue.trim().split("-").map(Number);
        return row * 3 + col + 1;
    })

    for (let i = 0; i < tileNumbers.length - 1; i++) {
        for (let j = i + 1; j < tileNumbers.length; j++)
            if (tileNumbers[i] > tileNumbers[j]) inversionCount++;
    }

    return inversionCount % 2 === 0;
}

function setPuzzleSolvedState() {
    const isSolved = currentPuzzleState.flat().every((value, index) => value === solvedPuzzleState.flat()[index])

    if (isSolved) {
        if (!isInitState) {
            setTimeout(() => {
                alert("Puzzle solved");
                document.getElementById('state').textContent = "Puzzle Solved"
            }, 500);
        } else {
            document.getElementById('state').textContent = "Solve the Puzzle"
        }
        return true;
    }

    document.getElementById('state').textContent = "Puzzle not Solved"
    return false;
}

document.addEventListener('DOMContentLoaded', () => {
    renderPuzzle(solvedPuzzleState);
    document.getElementById('btn-shuffle').addEventListener('click', () => shuffle());
})