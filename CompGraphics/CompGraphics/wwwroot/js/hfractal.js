var i = document.getElementById('N').value;

var isDashed = false;
const radioButtons = document.querySelectorAll('input[name="style"]');
for (const radioButton of radioButtons) {
    if (radioButton.checked) {
        if (radioButton.value == "dashed")
            isDashed = true;

    }
}

var colorPicker = document.getElementById("colorPicker");

var x = document.getElementById("X");
var y = document.getElementById("Y");

let depth = 1;

const canvas = document.getElementById("c")
const context = c.getContext("2d")
context.strokeStyle = "red";
var center = {
    x: canvas.width / 2.0,
    y: canvas.height / 2.0
}

const sqrt2 = Math.sqrt(2)
const len = canvas.width / sqrt2 / sqrt2 / sqrt2/sqrt2

const hTree = (point, len, depth) => {
    if (depth === 0) {
        return
    }

    // намалювати горизонтальну лінію
    const h1 = { x: point.x - len / 2.0, y: point.y }
    const h2 = { x: point.x + len / 2.0, y: point.y }
    drawLine(h1, h2)
    // намалювати вертикальні лінії
    len = len / sqrt2

    const v1 = { x: h1.x, y: h1.y - len / 2.0 }
    const v2 = { x: h1.x, y: h1.y + len / 2.0 }
    drawLine(v1, v2)

    const v3 = { x: h2.x, y: h2.y - len / 2.0 }
    const v4 = { x: h2.x, y: h2.y + len / 2.0 }
    drawLine(v3, v4)

    //обрахунок нових довжини та глибини для рекурсивної функції
    depth--
    len = len / sqrt2
   
    hTree(v1, len, depth)
    hTree(v2, len, depth)
    hTree(v3, len, depth)
    hTree(v4, len, depth)
}

const drawLine = (from, to) => {
    var isDashed = false;
    var isDots = false;
    var isSolid = false;
    const radioButtons = document.querySelectorAll('input[name="style"]');
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            if (radioButton.value == "dashed")
                isDashed = true;
            if (radioButton.value == "dots")
                isDots = true;
            if (radioButton.value == "solid")
                isSolid = true;
        }
    }
    if (isDashed) context.setLineDash([7, 4]);
    if (isDots) context.setLineDash([2, 2]);
    if (isSolid) context.setLineDash([]);

    context.beginPath()
    context.moveTo(from.x, from.y)
    context.lineTo(to.x, to.y)
    context.stroke()

}
const paint = () => {
    context.clearRect(0, 0, canvas.width, canvas.height)
    hTree(center, len, depth)
}

const b = document.getElementById("build")
b.addEventListener("click", () => {
        var n = document.getElementById("N");
        depth = n.value;

        if (depth < 0) depth = 0;
        else if (depth > 7) depth == 7;
        depth++;

        const radioButtons = document.querySelectorAll('input[name="style"]');
        for (const radioButton of radioButtons) {
            if (radioButton.checked) {
                if (radioButton.value == "dashed")
                    isDashed = true;
            }
        }

        var colorPicker = document.getElementById("colorPicker");
        context.strokeStyle = colorPicker.value;
        var newX = document.getElementById("X").value;
        var newY = document.getElementById("Y").value;
        let dx = (canvas.width / 2 - newX);
        let dy = (canvas.height / 2 - newY);
        center = {
            x: dx,
            y: dy
        };

        paint()
})

paint()
async function downloadCanvas(el) {
    const imageURI = canvas.toDataURL("image/jpg",1);
    el.href = imageURI;
};
