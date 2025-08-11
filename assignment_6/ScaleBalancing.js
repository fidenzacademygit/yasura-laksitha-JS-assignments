function scaleBalancing(strArr) {
    if (!isValidInput(strArr)) return;

    let result;
    const weightArray = extractWeights(strArr);

    if (!isValidWeights(weightArray)) return;

    let {left, right} = getWeights(weightArray[0][0], weightArray[0][1], weightArray[1]);

    if (left.length === 0 && right.length === 0) {
        result = "Not possible";
    } else if (left[0] === 0 && right[0] === 0) {
        result = "Equals";
    } else {
        left = left.sort((a, b) => a - b).join(",");
        right = right.sort((a, b) => a - b).join(",");

        result = `Left: ${left} | Right: ${right}`;
    }

    return {
        current: weightArray[0],
        available: weightArray[1],
        result: result
    };
}

function getWeights(left, right, availableWeights) {
    const diff = Math.abs(left - right);
    const  weightSet = new Set(availableWeights);

    //equal weights
    if (diff === 0) return {left: [0], right: [0]}

    //one weight on the lighter side
    if (weightSet.has(diff))
        return left < right ?
            {left: [diff], right: [0]} :
            {right: [diff], left: [0]}

    //2 weights on the lighter side
    const complementSet = new Set();
    for (const w of availableWeights) {
        const complement = diff - w;

        if (complementSet.has(complement))
            return left < right ?
                {left: [complement, w], right: [0]} :
                {right: [complement, w], left: [0]}

        complementSet.add(w);
    }

    //one weight on both sides
    const weightDifference = left - right;
    for (const weightRight of availableWeights) {
        const weightLeft = weightRight - weightDifference;

        if (weightSet.has(weightLeft) && weightRight !== weightLeft) {
            return weightDifference > 0 ?
                {left: [weightLeft], right: [weightRight]} :
                {right: [weightRight], left: [weightLeft]}
        }
    }
    return {left: [], right: []};
}

function extractWeights(strArr) {
    strArr = strArr.replace(/"/g, "");
    const regex = /\[(.+?)]/g
    const matches = [...strArr.matchAll(regex)];

    return matches
        .map(match => match[1].split(",")
            .map(num => Number(num.trim())));
}

function isValidWeights(weightArray) {
    if (weightArray.length !== 2) return false;

    for (const array of weightArray) {
        for (const ele of array) {
            if (Number.isNaN(ele)) return false
        }
    }
    return true;
}

function isValidInput(rawStr) {
    const strict = /^"\[\s*\d+\s*,\s*\d+\s*]"\s*,\s*"\[\s*\d+(?:\s*,\s*\d+)*\s*]"$/
    return rawStr && strict.test(rawStr);
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-submit').addEventListener('click', () => {
        const input = document.getElementById('scale-input').value;
        const data = scaleBalancing(input);

        if (data !== undefined) {
            const {current, available, result} = data;

            document.getElementById('current-state').textContent = current.toString();
            document.getElementById('available-weights').textContent = available.toString();
            document.getElementById('balanced-weights').textContent = result;
        } else {
            document.getElementById('current-state').textContent = "";
            document.getElementById('available-weights').textContent = "";
            document.getElementById('balanced-weights').textContent = "Invalid input";
        }
    })
})