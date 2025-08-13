const solvedPuzzleState = [
    ['0-0', '0-1', '0-2'],
    ['1-0', '1-1', '1-2'],
    ['2-0', '2-1', null],
];

let currentPuzzleState = [
    ['0-0', '0-1', '0-2'],
    ['1-0', '1-1', '1-2'],
    ['2-0', '2-1', null],
];

let emptyPosition = {row: 2, col: 2};

function isNeighbour(clickedTile) {
    const {row, col} = clickedTile;
    return row === emptyPosition.row && Math.abs(col - emptyPosition.col) === 1 ||
        col === emptyPosition.col && Math.abs(row - emptyPosition.row) === 1
}

function onTileClicked(tileId) {
    const tile = document.getElementById(tileId);
    const clickedTile = {
        row: parseInt(tile.getAttribute('data-row')),
        col: parseInt(tile.getAttribute('data-col')),
    }

    if (isNeighbour(clickedTile)) {
        const temp = currentPuzzleState[clickedTile.row][clickedTile.col];
        currentPuzzleState[clickedTile.row][clickedTile.col] = null;
        currentPuzzleState[emptyPosition.row][emptyPosition.col] = temp;

        emptyPosition = {clickedTile};
        renderPuzzle(currentPuzzleState);
    }
}

function renderPuzzle(puzzleState) {
    const imageContainer = document.querySelector('.image-container');
    imageContainer.innerHTML = "";

    const rows = 3;
    const cols = 3;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const div = document.createElement('div');
            const cellValue = puzzleState[i][j];

            div.setAttribute('data-row', i.toString());
            div.setAttribute('data-col', j.toString());
            div.setAttribute('id', `slice-${cellValue}`)

            if (!cellValue) {
                div.classList.add('empty');
                emptyPosition = {row: i, col: j};
            } else {
                const [row, col] = cellValue.split("-").map(Number);
                const sliceNumber = row * 3 + col + 1;

                div.classList.add('image-slice', `slice-${sliceNumber}`);
                div.addEventListener('click', () => onTileClicked(`slice-${cellValue}`));
            }

            imageContainer.appendChild(div);
        }
    }
}

function shuffle() {
    const cols = 3;
    const rows = 3;

    const clonedPuzzle = Array.from({length: rows}, () => new Array(cols).fill(null));
    const cellValueSet = new Set();

    const emptyRow = Math.floor(Math.random() * rows);
    const emptyCol = Math.floor(Math.random() * cols);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (i === emptyRow && j === emptyCol) {
                clonedPuzzle[i][j] = null;
                emptyPosition = {row: emptyRow, col: emptyCol};
                continue;
            }

            let cellValue = `${Math.floor(Math.random() * rows)}-${Math.floor(Math.random() * cols)}`;

            while (cellValueSet.has(cellValue)) {
                cellValue = `${Math.floor(Math.random() * 3)}-${Math.floor(Math.random() * 3)}`;
            }

            clonedPuzzle[i][j] = cellValue;
            cellValueSet.add(cellValue);
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

function isPuzzleSolved() {
    const flatCurrentPuzzleStateStr = currentPuzzleState.flat().join(",");
    const flatSolvedPuzzleStateStr = solvedPuzzleState.flat().join(",");

    return flatSolvedPuzzleStateStr === flatCurrentPuzzleStateStr;
}

document.addEventListener('DOMContentLoaded', () => {
    renderPuzzle(solvedPuzzleState);

    document.getElementById('btn-shuffle').addEventListener('click', () => shuffle());
    document.getElementById('btn-check').addEventListener('click', () => {
        const result = isPuzzleSolved();
        const element = document.getElementById('state');

        element.textContent = result ? "Puzzle Solved" : "Puzzle Unsolved";
    });
})