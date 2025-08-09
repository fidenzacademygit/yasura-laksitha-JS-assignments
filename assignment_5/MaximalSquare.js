function maximalSquare(strArr) {
    if (!strArr) return;

    const matrix = create2DMatrix(strArr);
    if (!isValid(matrix)) return;

    let maxValue = 0;
    const rows = matrix.length;
    const cols = matrix[0].length;
    const helper = Array.from({length: rows + 1}, () => new Array(cols + 1).fill(0));

    for (let i = 1; i <= rows; i++) {
        for (let j = 1; j <= cols; j++) {
            if (matrix[i - 1][j - 1] === 1) {
                helper[i][j] = Math.min(helper[i - 1][j - 1], helper[i][j - 1], helper[i - 1][j]) + 1
                maxValue = helper[i][j] > maxValue ? helper[i][j] : maxValue;
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

function isValid(matrix) {
    if (matrix.length === 0) return false;
    const expectedArrayLength = matrix[0].length;

    for (const array of matrix) {
        if (array.length !== expectedArrayLength) return false;

        for (const value of array) {
            if (typeof value != 'number') return false;
            if (Number(value) !== 0 && Number(value) !== 1) return false;
        }
    }
    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('btn-submit').addEventListener('click', () => {
        const input = document.getElementById('array-input').value;
        const result = maximalSquare(input);

        if (result !== undefined) {
            const {inputMatrix, helperMatrix, output} = result;

            document.getElementById('input-matrix').innerHTML = print2DMatrix(inputMatrix);
            document.getElementById('helper-matrix').innerHTML = print2DMatrix(helperMatrix);
            document.getElementById('final-output').textContent = output.toString();
        } else {
            document.getElementById('input-matrix').textContent = "";
            document.getElementById('helper-matrix').textContent = "";
            document.getElementById('final-output').textContent = "Invalid input";
        }

    })
})