
const canvas = document.getElementById('canvas');
/** @type {CanvasRenderingContext2D} */
var ctx = canvas.getContext('2d');

var grid_size = 20;
var x_axis_distance_grid_lines = 15;
var y_axis_distance_grid_lines = 15;
var x_axis_starting_point = { number: 1, suffix: '' };
var y_axis_starting_point = { number: 1, suffix: '' };

var canvas_width = canvas.width;
var canvas_height = canvas.height;

async function downloadCanvas(el) {
    const imageURI = canvas.toDataURL("image/jpg", 1);
    el.href = imageURI;
};

function redrawCoordinates() {
    // Store the current transformation matrix

    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var num_lines_x = Math.floor(canvas_height / grid_size);
    var num_lines_y = Math.floor(canvas_width / grid_size);

    // Draw grid lines along X-axis
    for (var i = 0; i <= num_lines_x; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;

        // If line represents X-axis draw in different color
        if (i == x_axis_distance_grid_lines)
            ctx.strokeStyle = "#000000";
        else
            ctx.strokeStyle = "#e9e9e9";

        if (i == num_lines_x) {
            ctx.moveTo(0, grid_size * i);
            ctx.lineTo(canvas_width, grid_size * i);
        }
        else {
            ctx.moveTo(0, grid_size * i + 0.5);
            ctx.lineTo(canvas_width, grid_size * i + 0.5);
        }
        ctx.stroke();
    }

    // Draw grid lines along Y-axis
    for (i = 0; i <= num_lines_y; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;

        // If line represents X-axis draw in different color
        if (i == y_axis_distance_grid_lines)
            ctx.strokeStyle = "#000000";
        else
            ctx.strokeStyle = "#e9e9e9";

        if (i == num_lines_y) {
            ctx.moveTo(grid_size * i, 0);
            ctx.lineTo(grid_size * i, canvas_height);
        }
        else {
            ctx.moveTo(grid_size * i + 0.5, 0);
            ctx.lineTo(grid_size * i + 0.5, canvas_height);
        }
        ctx.stroke();
    }

    // Translate to the new origin. Now Y-axis of the canvas is opposite to the Y-axis of the graph. So the y-coordinate of each element will be negative of the actual
    ctx.translate(y_axis_distance_grid_lines * grid_size, x_axis_distance_grid_lines * grid_size);

    // Ticks marks along the positive X-axis
    for (i = 1; i < (num_lines_y - y_axis_distance_grid_lines); i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";

        // Draw a tick mark 6px long (-3 to 3)
        ctx.moveTo(grid_size * i + 0.5, -3);
        ctx.lineTo(grid_size * i + 0.5, 3);
        ctx.stroke();

        // Text value at that point
        ctx.font = '9px Arial';
        ctx.textAlign = 'start';
        ctx.fillText(x_axis_starting_point.number * i + x_axis_starting_point.suffix, grid_size * i - 2, 15);
    }

    // Ticks marks along the negative X-axis
    for (i = 1; i < y_axis_distance_grid_lines; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";

        // Draw a tick mark 6px long (-3 to 3)
        ctx.moveTo(-grid_size * i + 0.5, -3);
        ctx.lineTo(-grid_size * i + 0.5, 3);
        ctx.stroke();

        // Text value at that point
        ctx.font = '9px Arial';
        ctx.textAlign = 'end';
        ctx.fillText(-x_axis_starting_point.number * i + x_axis_starting_point.suffix, -grid_size * i + 3, 15);
    }

    // Ticks marks along the positive Y-axis
    // Positive Y-axis of graph is negative Y-axis of the canvas
    for (i = 1; i < (num_lines_x - x_axis_distance_grid_lines); i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";

        // Draw a tick mark 6px long (-3 to 3)
        ctx.moveTo(-3, grid_size * i + 0.5);
        ctx.lineTo(3, grid_size * i + 0.5);
        ctx.stroke();

        // Text value at that point
        ctx.font = '9px Arial';
        ctx.textAlign = 'start';
        ctx.fillText(-y_axis_starting_point.number * i + y_axis_starting_point.suffix, 8, grid_size * i + 3);
    }

    // Ticks marks along the negative Y-axis
    // Negative Y-axis of graph is positive Y-axis of the canvas
    for (i = 1; i < x_axis_distance_grid_lines; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#000000";

        // Draw a tick mark 6px long (-3 to 3)
        ctx.moveTo(-3, -grid_size * i + 0.5);
        ctx.lineTo(3, -grid_size * i + 0.5);
        ctx.stroke();

        // Text value at that point
        ctx.font = '9px Arial';
        ctx.textAlign = 'start';
        ctx.fillText(y_axis_starting_point.number * i + y_axis_starting_point.suffix, 8, -grid_size * i + 3);
    }
}

redrawCoordinates();

var rectangleArray = [[], [], [], []];
var rectangleCenter = [];

function getSquareFromDiagonal() {
    let squareDiagonalX1 = parseFloat($('#X1').val());
    let squareDiagonalY1 = parseFloat($('#Y1').val());
    let squareDiagonalX2 = parseFloat($('#X2').val());
    let squareDiagonalY2 = parseFloat($('#Y2').val());

    rectangleCenter[0] = (squareDiagonalX1 + squareDiagonalX2) / 2;
    rectangleCenter[1] = (squareDiagonalY1 + squareDiagonalY2) / 2;

    let s = rectangleArray[0] - squareDiagonalX1;
    let k = rectangleArray[1] - squareDiagonalY1;

    rectangleArray[0][0] = squareDiagonalX1;
    rectangleArray[0][1] = squareDiagonalY1;

    rectangleArray[1][0] = squareDiagonalX1;
    rectangleArray[1][1] = squareDiagonalY2;
    //rectangleArray[1][0] = rectangleCenter[0] - k;
    //rectangleArray[1][1] = rectangleCenter[1] + s;

    rectangleArray[2][0] = squareDiagonalX2;
    rectangleArray[2][1] = squareDiagonalY2;

    rectangleArray[3][0] = squareDiagonalX2;
    rectangleArray[3][1] = squareDiagonalY1;
    //rectangleArray[3][0] = rectangleCenter[0] + k;
    //rectangleArray[3][1] = rectangleCenter[1] - s;

    if ((squareDiagonalX1 - squareDiagonalX2) != (squareDiagonalY1 - squareDiagonalY2))
        document.getElementById('check').innerText = 'Зверни увагу, за заданими координатами побудований не квадрат.';
    else document.getElementById('check').innerText = '';
    return rectangleArray;
}

function drawRectangleArray(color) {
    ctx.beginPath();
    ctx.moveTo(rectangleArray[0][0] / x_axis_starting_point.number * grid_size, -rectangleArray[0][1] / y_axis_starting_point.number * grid_size);
    for (let i = 1; i < rectangleArray.length; i++) {
        ctx.lineTo(rectangleArray[i][0] / x_axis_starting_point.number * grid_size, -rectangleArray[i][1] / y_axis_starting_point.number * grid_size);
    }
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.stroke();
}


function applyTranslationOnArray(rectangleArray, translationX, translationY) {
    for (let i = 0; i < rectangleArray.length; i++) {
        rectangleArray[i][0] += translationX;
        rectangleArray[i][1] += translationY;
    }
    return rectangleArray;
}

function applyScale() {
    let scaleX = parseFloat($('#X').val());
    let scaleY = parseFloat($('#Y').val());
    let scaleMatrix = [
        [scaleX, 0],
        [0, scaleY]
    ];
   // let translationX = rectangleArray[0][0];
    // let translationY = rectangleArray[0][1];
    let translationX = rectangleCenter[0];
    let translationY = rectangleCenter[1];
    applyTranslationOnArray(rectangleArray, -translationX, -translationY)
    rectangleArray = multiplyMatrices(rectangleArray, scaleMatrix);
    applyTranslationOnArray(rectangleArray, translationX, translationY);

    rectangleCenter[0] = (rectangleArray[0][0] + rectangleArray[2][0]) / 2;
    rectangleCenter[1] = (rectangleArray[0][1] + rectangleArray[1][1]) / 2;


    return rectangleArray;
}

function applyAngle() {
    let angle = parseFloat($('#Degrees').val());
    let angleRadians = angle * Math.PI / 180;

    for (var i = 0; i < rectangleArray.length; i++) {
        var baseMatrix = [
            [rectangleArray[i][0], rectangleArray[i][1], 1]
        ];

        var firstMatrix = [
            [1, 0, 0],
            [0, 1, 0],
            [-1 * rectangleCenter[0], -1 * rectangleCenter[1], 1]
        ];

        var angleMatrix = [
            [Math.cos(angleRadians), Math.sin(angleRadians), 0],
            [-Math.sin(angleRadians), Math.cos(angleRadians), 0],
            [0, 0, 1]
        ]

        var thirdMatrix = [
            [1, 0, 0],
            [0, 1, 0],
            [rectangleCenter[0], rectangleCenter[1], 1]
        ];

        var mlt1 = multiplyMatrices(baseMatrix, firstMatrix);
        var mlt2 = multiplyMatrices(mlt1, angleMatrix);
        var mlt3 = multiplyMatrices(mlt2, thirdMatrix);
        var newX = mlt3[0][0];
        var newY = mlt3[0][1];

        rectangleArray[i][0] = newX;
        rectangleArray[i][1] = newY;
    }
    return rectangleArray;
}

function apply90AngleToDot(x,y) {
    let angleRadians = 90 * Math.PI / 180;
    var baseMatrix = [
        [x, y, 1]
    ];

    var firstMatrix = [
        [1, 0, 0],
        [0, 1, 0],
        [-1 * x, -1 * y, 1]
    ];

    var angleMatrix = [
        [Math.cos(angleRadians), Math.sin(angleRadians), 0],
        [-Math.sin(angleRadians), Math.cos(angleRadians), 0],
        [0, 0, 1]
    ]

    var thirdMatrix = [
        [1, 0, 0],
        [0, 1, 0],
        [x, y, 1]
    ];

    var mlt1 = multiplyMatrices(baseMatrix, firstMatrix);
    var mlt2 = multiplyMatrices(mlt1, angleMatrix);
    var mlt3 = multiplyMatrices(mlt2, thirdMatrix);
    var newX = mlt3[0][0];
    var newY = mlt3[0][1];
    var result = [newX, newY];
    return result;
}

const multiplyMatrices = (a, b) => {
    if (!Array.isArray(a) || !Array.isArray(b) || !a.length || !b.length) {
        throw new Error('arguments should be in 2-dimensional array format');
    }
    let x = a.length,
        z = a[0].length,
        y = b[0].length;
    if (b.length !== z) {
        // XxZ & ZxY => XxY
        throw new Error('number of columns in the first matrix should be the same as the number of rows in the second');
   }
    let productRow = Array.apply(null, new Array(y)).map(Number.prototype.valueOf, 0);
    let product = new Array(x);
    for (let p = 0; p < x; p++) {
        product[p] = productRow.slice();
    }
    for (let i = 0; i < x; i++) {
        for (let j = 0; j < y; j++) {
            for (let k = 0; k < z; k++) {
                product[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    return product;
}

$('.numberDiagonal').keyup(() => {
    redrawCoordinates();
    getSquareFromDiagonal();
    applyScale();
    applyAngle();
    drawRectangleArray('#dc6a10');
}
)

$('.numberScale').keyup(() => {
    redrawCoordinates();
    getSquareFromDiagonal();
    applyScale();
    applyAngle();
    drawRectangleArray('#dc6a10');
}
)

$('.numberAngle').keyup(() => {
    redrawCoordinates();
    getSquareFromDiagonal();
    applyScale();
    applyAngle();
    drawRectangleArray('#dc6a10');
}
)

function redrawRectangle() {
    redrawCoordinates();
    getSquareFromDiagonal();
    applyScale();
    applyAngle();
    drawRectangleArray('#dc6a10');
}

redrawRectangle();

function mouseWheel(event) {
    if (event.originalEvent.wheelDelta / 120 > 0) {
        grid_size = (grid_size + 3).between(1, 200) ? (grid_size + 3) : grid_size;
        x_axis_distance_grid_lines = canvas_width / grid_size / 2;
        y_axis_distance_grid_lines = canvas_height / grid_size / 2;
        x_axis_starting_point.number = (x_axis_starting_point.number - 2).between(1, 10, true) ? (x_axis_starting_point.number - 2) : x_axis_starting_point.number;
        y_axis_starting_point.number = (y_axis_starting_point.number - 2).between(1, 10, true) ? (y_axis_starting_point.number - 2) : y_axis_starting_point.number;
    }
    else {
        grid_size = (grid_size - 3).between(1, 200) ? (grid_size - 3) : grid_size;;
        x_axis_distance_grid_lines = canvas_width / grid_size / 2;
        y_axis_distance_grid_lines = canvas_height / grid_size / 2;
        x_axis_starting_point.number = (x_axis_starting_point.number + 2).between(1, 10, true) ? (x_axis_starting_point.number + 2) : x_axis_starting_point.number;
        y_axis_starting_point.number = (y_axis_starting_point.number + 2).between(1, 10, true) ? (y_axis_starting_point.number + 2) : y_axis_starting_point.number;
    }

    redrawRectangle();
    return false;
}

$(document).ready(function () {
    $('#canvas').bind('mousewheel', mouseWheel);
});

Number.prototype.between = function (a, b, inclusive) {
    var min = Math.min.apply(Math, [a, b]),
        max = Math.max.apply(Math, [a, b]);
    return inclusive ? this >= min && this <= max : this > min && this < max;
};

//var myInterval = null;
var isStopped = true;
var currentAngle;

function round() {
    if (parseFloat($('#Degrees').val()) + currentAngle > 360) {
        document.getElementById("Degrees").value = 360 - (parseFloat($('#Degrees').val()) + currentAngle);
    }

    document.getElementById("Degrees").value = parseFloat(parseFloat($('#Degrees').val()) + currentAngle);
    redrawRectangle();
}

let myInterval= null;

function interval() {

    if (myInterval==null) {
        currentAngle = parseFloat($('#Degrees').val());
        myInterval = setInterval(round, 500);
        document.querySelector('#intervalBtn').innerText = 'Зупинити';
        isStopped = false;
    } else {
        clearInterval(myInterval);
        myInterval = null;
        document.getElementById("Degrees").value = currentAngle;
        document.querySelector('#intervalBtn').innerText = 'Перевертати';
        redrawRectangle();
        isStopped = true;
    }
}