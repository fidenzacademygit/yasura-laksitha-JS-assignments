function chessboardTraveling(str) {
    const positions = extractPositions(str);

    if (!validateCoordination(positions)) return -1;

    const verticalSteps = Math.abs(Number(positions[0].y) - Number(positions[1].y));
    const horizontalSteps = Math.abs(Number(positions[0].x) - Number(positions[1].x));

    return verticalSteps + horizontalSteps;
}

function validateCoordination(positions) {
    if (positions.length !== 2) return false;

    for (const pos of positions) {
        if (pos.x < 1 || pos.x > 8) return false;
        if (pos.y < 1 || pos.y > 8) return false;
    }

    return true;
}

function extractPositions(str) {
    if (typeof str != 'string') return [];

    const regex = /\((\d+) (\d+)\)/g;
    const matches = [...str.matchAll(regex)];

    if (str.replace(/\s+/g, '') !== matches.map(m => m[0].replace(/\s+/g, '')).join(''))
        return [];

    return matches.map(match => {
        const x = Number(match[1]);
        const y = Number(match[2]);

        return {x, y};
    })
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-submit').addEventListener('click', () => {
        const input = document.getElementById('input').value;
        const result = chessboardTraveling(input);

        document.getElementById('output').textContent = result === -1 ? "Invalid input" : result;
    })
})