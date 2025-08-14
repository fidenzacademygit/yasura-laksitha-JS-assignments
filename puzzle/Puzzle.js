const TILE_SIZE = 100

let size = 3;
let solvedPuzzleState = generateSolvedPuzzle();
let currentPuzzleState = solvedPuzzleState.map(row => [...row]);
let emptyPosition = findEmptyPosition();
let isInitState = true;

function resetPuzzleState() {
    console.info("Reset puzzle state for: ", {size: size});

    solvedPuzzleState = generateSolvedPuzzle();
    currentPuzzleState = solvedPuzzleState.map(row => [...row]);
    emptyPosition = findEmptyPosition();
}

function generateSolvedPuzzle() {
    const solvedPuzzle = [];
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            if (i === size - 1 && j === size - 1) {
                row.push(null);
            } else {
                row.push(`${i}-${j}`);
            }
        }
        solvedPuzzle.push(row);
    }
    console.info("Generated solved puzzle state successfully");
    return solvedPuzzle;
}

function findEmptyPosition() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (currentPuzzleState[i][j] === null) {
                console.info(`Empty position found in `, {row: i, col: j});
                return {row: i, col: j};
            }
        }
    }
}

function isNeighbour(clickedTile) {
    const {row, col} = clickedTile;
    return row === emptyPosition.row && Math.abs(col - emptyPosition.col) === 1 ||
        col === emptyPosition.col && Math.abs(row - emptyPosition.row) === 1
}

function onTileClicked(tileId) {
    if (!tileId) return;
    console.info("TileId found in onTileClicked method ", tileId);

    if (isInitState) isInitState = false;
    const prevEmptyPosition = {...emptyPosition};

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

        console.info("Move:", {
            clickedTile,
            from: {...prevEmptyPosition},
            to: {row: clickedTile.row, col: clickedTile.col}
        });

        renderPuzzle(currentPuzzleState);
    }
}

function renderPuzzle(puzzleState) {
    console.info("Rendering the puzzle state: ", {size: size})

    const imageContainer = document.querySelector('.image-container');
    imageContainer.innerHTML = "";

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const div = document.createElement('div');
            const cellValue = puzzleState[i][j];

            div.setAttribute('data-row', i.toString());
            div.setAttribute('data-col', j.toString());

            if (!cellValue) {
                div.classList.add('empty');
            } else {
                const [row, col] = cellValue.split("-").map(Number);

                div.setAttribute('id', `slice-${cellValue}`);
                div.classList.add('image-slice');
                div.style.backgroundPosition = `${-col * TILE_SIZE}px ${-row * TILE_SIZE}px`;

                div.addEventListener('click', () => onTileClicked(`slice-${cellValue}`));
            }
            imageContainer.appendChild(div);
        }
    }
    console.info("Puzzle state rendered successfully");
    setPuzzleSolvedState();
}

function shuffle(attempt = 1) {
    isInitState = false;

    console.info("Shuffle attempt ", attempt)
    const tileArray = solvedPuzzleState.flat().filter(tile => tile !== null);

    for (let i = tileArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tileArray[i], tileArray[j]] = [tileArray[j], tileArray[i]];
    }

    const clonedPuzzle = Array.from({length: size}, () => new Array(size).fill(null));

    const emptyRow = Math.floor(Math.random() * size);
    const emptyCol = Math.floor(Math.random() * size);
    emptyPosition = {row: emptyRow, col: emptyCol};

    console.info("Empty tile placed at ", emptyPosition);

    let tileIndex = 0;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (i === emptyRow && j === emptyCol) {
                clonedPuzzle[i][j] = null;
            } else {
                clonedPuzzle[i][j] = tileArray[tileIndex++];
            }
        }
    }

    if (isPuzzleSolvable(clonedPuzzle)) {
        currentPuzzleState = clonedPuzzle;
        console.info("Puzzle is solvable. Shuffle finished");

        renderPuzzle(currentPuzzleState);
    } else {
        console.info("Puzzle is not solvable. Retrying...");
        shuffle(attempt + 1);
    }
}

function isPuzzleSolvable(puzzleState) {
    const flatPuzzle = puzzleState.flat().filter(str => str !== null);
    let inversionCount = 0;

    const tileNumbers = flatPuzzle.map(cellValue => {
        const [row, col] = cellValue.trim().split("-").map(Number);
        return row * size + col + 1;
    })

    for (let i = 0; i < tileNumbers.length - 1; i++) {
        for (let j = i + 1; j < tileNumbers.length; j++)
            if (tileNumbers[i] > tileNumbers[j]) inversionCount++;
    }

    if (size % 2 !== 0) return inversionCount % 2 === 0;

    const emptyRowFromBottom = size - 1 - findEmptyPosition().row;

    return emptyRowFromBottom % 2 === 0 ?
        inversionCount % 2 === 1 :
        inversionCount % 2 === 0;
}

function setPuzzleSolvedState() {
    const flatCurrent = currentPuzzleState.flat();
    const flatSolved = solvedPuzzleState.flat();
    const isSolved = flatSolved.every((value, index) => value === flatCurrent[index]);

    console.info("Checking if puzzle is solved:", {
        currentPuzzleState: flatCurrent,
        solvedPuzzleState: flatSolved,
        isSolved
    });

    if (isSolved) {
        if (!isInitState) {
            console.info("Puzzle is solved!");

            setTimeout(() => {
                alert("Puzzle solved");
                document.getElementById('state').textContent = "Puzzle Solved";
            }, 500);
        } else {
            document.getElementById('state').textContent = "Solve the Puzzle";
        }
        return true;
    }

    if (!isInitState) console.info("Puzzle not solved yet");

    document.getElementById('state').textContent = "Puzzle not Solved";
    return false;
}

function initDefaultProps() {
    isInitState = true;
    const documentElement = document.documentElement;
    const sizes = {
        5: {containerWidth: '510px', imgSize: '500px'},
        4: {containerWidth: '410px', imgSize: '400px'},
        3: {containerWidth: '310px', imgSize: '300px'},
    }

    const props = sizes[size] || sizes[3];

    documentElement.style.setProperty("--image-container-width", props.containerWidth);
    documentElement.style.setProperty("--image-size", props.imgSize);

    console.info("Set container width and image size: ", {
        containerWidth: props.containerWidth,
        imageSize: props.imgSize
    });

    resetPuzzleState();
}

function reset() {
    if (isInitState) return;

    isInitState = true;
    resetPuzzleState();
    renderPuzzle(solvedPuzzleState)
}

document.addEventListener('DOMContentLoaded', () => {
    renderPuzzle(solvedPuzzleState);
    document.getElementById('btn-shuffle').addEventListener('click', () => shuffle());

    document.getElementById('puzzle-type').addEventListener('change', () => {
        size = parseInt(document.getElementById('puzzle-type').value);
        initDefaultProps();
        renderPuzzle(solvedPuzzleState);
    })

    document.getElementById('btn-reset').addEventListener('click', () => reset());

})