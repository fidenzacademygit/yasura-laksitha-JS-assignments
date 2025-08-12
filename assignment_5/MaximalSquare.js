function maximalSquare(strArr) {
    if (!isValidInput(strArr)) return;

    strArr = strArr.trim();

    const matrix = create2DMatrix(strArr);
    if (!isValidMatrix(matrix)) return;

    let maxValue = 0;
    const rows = matrix.length;
    const cols = matrix[0].length;
    const helper = Array.from({length: rows + 1}, () => new Array(cols + 1).fill(0));

    for (let i = 1; i <= rows; i++) {
        for (let j = 1; j <= cols; j++) {
            if (matrix[i - 1][j - 1] === 1) {
                helper[i][j] = Math.min(helper[i - 1][j - 1], helper[i][j - 1], helper[i - 1][j]) + 1
                maxValue = Math.max(helper[i][j], maxValue);
            } else {
                helper[i][j] = 0;
            }
        }
    }

    return {
        inputMatrix: matrix,
        helperMatrix: helper,
        output: maxValue * maxValue
    };
}

function findMaxValuePositions(maxValue, helper) {
    const positionSet = new Set();
    const cols = helper[0].length;

    for (let i = 1; i < helper.length; i++) {
        for (let j = 1; j < cols; j++) {
            if (helper[i][j] === Math.sqrt(maxValue))
                positionSet.add(`${i-1},${j-1}`);
        }
    }
    return positionSet;
}

function markMaximalSquares(positionSet, matrix, maxValue) {
    const limit = Math.sqrt(maxValue);
    const borderColors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#33FFF5"];
    let markedMatrix = matrix.map(row => [...row]);
    let colorIndex = 0;

    for (const coordinationStr of positionSet) {
        const coordination = coordinationStr.split(",").map(Number);

        const startArrayIndex = coordination[0];
        const startElementIndex = coordination[1];
        const endArrayIndex = startArrayIndex - (limit - 1);
        const endElementIndex = startElementIndex - (limit - 1)

        const color = borderColors[colorIndex++ % borderColors.length];

        for (let i = startArrayIndex; i >= endArrayIndex; i--) {
            for (let j = startElementIndex; j >= endElementIndex; j--) {
                markedMatrix[i][j] = `<span style="background-color:${color}; 
                                            display:inline-block;
                                            padding: 2px;
                                            margin: 1px;">
                    ${markedMatrix[i][j]}
                </span>`;
            }
        }
    }
    return markedMatrix;
}

function isValidInput(strArr) {
    const regex = /^"([01]+)"(\s*,\s*"([01]+)")*$/;
    return strArr && regex.test(strArr);
}

function print2DMatrix(arr) {
    let result = "";

    for (const array of arr) {
        for (const value of array) {
            result += value + " ";
        }
        result += "<br>";
    }
    return result;
}

function create2DMatrix(str) {
    let rows = str.split(",").map(row => row.trim().replace(/"/g, ""));
    return rows.map(row => row.split("").map(ele => Number(ele)));
}

function isValidMatrix(matrix) {
    if (matrix.length === 0) return false;
    const expectedArrayLength = matrix[0].length;

    for (const array of matrix)
        if (array.length !== expectedArrayLength) return false;

    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('btn-submit').addEventListener('click', () => {
        const input = document.getElementById('array-input').value;
        const result = maximalSquare(input);

        if (result !== undefined) {
            const {inputMatrix, helperMatrix, output} = result;
            const positions = findMaxValuePositions(output, helperMatrix);
            const markedMatrix = markMaximalSquares(positions, inputMatrix, output);

            document.getElementById('input-matrix').innerHTML = print2DMatrix(inputMatrix);
            document.getElementById('helper-matrix').innerHTML = print2DMatrix(helperMatrix);
            document.getElementById('final-output').textContent = output.toString();
            document.getElementById('marked-matrix').innerHTML = print2DMatrix(markedMatrix);

        } else {
            document.getElementById('marked-matrix').innerHTML = "";
            document.getElementById('input-matrix').textContent = "";
            document.getElementById('helper-matrix').textContent = "";
            document.getElementById('final-output').textContent = "Invalid input";
        }

    })
})