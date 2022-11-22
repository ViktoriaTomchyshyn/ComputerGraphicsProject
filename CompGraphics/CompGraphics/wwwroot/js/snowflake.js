var w = 400;
var h = 400;

var padding = 1;


var xScale = d3.scaleLinear()
    .domain([-.5, 1.5])
    .range([padding, w - padding]);

var yScale = d3.scaleLinear()
    .domain([-1, 1])
    .range([h - padding, padding]);

var svg = d3.select(".canvas").append("svg")
    .attr("width", w)
    .attr("height", h);


var layer1 = svg.append('g');
var layer2 = svg.append('g');
function step() {

    temp_dataset = dataset;

    dataset = [];

    dist = dist * (1 / 3);

    var len = temp_dataset.length;

    for (var i = 0; i < len; i++) {

        var x1 = temp_dataset[i][0];
        var y1 = temp_dataset[i][1];
        var x4 = temp_dataset[i][2];
        var y4 = temp_dataset[i][3];
        var x2 = x1 + ((1 / 3) * (x4 - x1));
        var y2 = y1 + ((1 / 3) * (y4 - y1));
        var x3 = x1 + ((2 / 3) * (x4 - x1));
        var y3 = y1 + ((2 / 3) * (y4 - y1));

        //крайні точки нових сегментів
        var x_new = x2 + (dist * Math.cos((Math.PI / 3) + temp_dataset[i][4]));
        var y_new = y2 + (dist * Math.sin((Math.PI / 3) + temp_dataset[i][4]));


        dataset.push([x1, y1, x2, y2, temp_dataset[i][4]]);
        dataset.push([x2, y2, x_new, y_new, (temp_dataset[i][4] + (Math.PI / 3))]);
        dataset.push([x_new, y_new, x3, y3, (temp_dataset[i][4] - (Math.PI / 3))]);
        dataset.push([x3, y3, x4, y4, temp_dataset[i][4]]);
    }

    var isDashed = false;
    var isDots = false;
    const radioButtons = document.querySelectorAll('input[name="style"]');
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            if (radioButton.value == "dashed")
                isDashed = true;
            if (radioButton.value == "dots")
                isDots = true;
        }
    }

    var colorPicker = document.getElementById("colorPicker");

    for (var i = 0; i < dataset.length; i++) {
        var line = layer2.append("line")
            .attr("x1", xScale(dataset[i][0]))
            .attr("y1", yScale(dataset[i][1]))
            .attr("x2", xScale(dataset[i][2]))
            .attr("y2", yScale(dataset[i][3]))
            .attr("stroke", colorPicker.value)
            .attr("stroke-width", "1.5px")
            .attr("fill", "none");
        if (isDashed) line.style("stroke-dasharray", ("7, 4"));
        if (isDots) line.style("stroke-dasharray", ("2, 2"));
    }
    var newX = document.getElementById("X").value;
    var newY = document.getElementById("Y").value;
    layer1.attr("transform", "translate(" + (-newX) + "," + (-newY) + ")");
    layer2.attr("transform", "translate(" + (-newX) + "," + (-newY) + ")");

}

var temp_dataset = [];

var dataset = [];
var dist = 1;

function start() {
    svg.selectAll("line").remove();
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
    dataset = [
        [0, 0, 1, 0, 0],
        [Math.cos(Math.PI / 3), Math.sin(Math.PI / 3), 0, 0, 4 * (Math.PI / 3)],
        [1, 0, Math.cos(Math.PI / 3), Math.sin(Math.PI / 3), (2 * (Math.PI / 3))]];
    dist = 1;
    var line = layer2.append("line")
        .attr("x1", xScale(dataset[0][0]))//0 0 1 0
        .attr("y1", yScale(dataset[0][1]))
        .attr("x2", xScale(dataset[0][2]))
        .attr("y2", yScale(dataset[0][3]))
        .attr("stroke", "red")
        .attr("stroke-width", "1.5px")
        .attr("fill", "none");
    if (isDashed) line.style("stroke-dasharray", ("3, 3"));
   var line = layer2.append("line")
        .attr("x1", xScale(dataset[1][0]))//1/2 sin(p/3) 0 0 
        .attr("y1", yScale(dataset[1][1]))
        .attr("x2", xScale(dataset[1][2]))
        .attr("y2", yScale(dataset[1][3]))
        .attr("stroke", "red")
        .attr("stroke-width", "1.5px")
        .attr("fill", "none");
    if (isDashed) line.style("stroke-dasharray", ("3, 3"));

    var line = layer2.append("line")
        .attr("x1", xScale(dataset[2][0]))//1
        .attr("y1", yScale(dataset[2][1]))//0
        .attr("x2", xScale(dataset[2][2]))// Math.cos(Math.PI / 3)
        .attr("y2", yScale(dataset[2][3]))
        .attr("stroke", "red")
        .attr("stroke-width", "1.5px")
        .attr("fill", "none");

    if (isDashed) line.style("stroke-dasharray", ("3, 3"));
    
}

start();

function build() {
   // if (validate()) {
        start();
        var i = document.getElementById('N').value;
        if (i == 0) start();
        for (var k = 0; k < i; k++) {
            svg.selectAll("line").remove();
            step();
        }

        var x = document.getElementById("X");
        var y = document.getElementById("Y");
        var newX = document.getElementById("X");
        var newY = document.getElementById("Y");
        x = canvas.width / 2.0 + newX;
        y = canvas.height / 2.0 - newY;

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + newX + ", " + newY + ")")
            .call(xAxis);
   // }
};

const createStyleElementFromCSS = () => {
    // JSFiddle's custom CSS is defined in the second stylesheet file
    const sheet = document.styleSheets[1];

    const styleRules = [];
    for (let i = 0; i < sheet.cssRules.length; i++)
        styleRules.push(sheet.cssRules.item(i).cssText);

    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(styleRules.join(' ')))

    return style;
};
const style = createStyleElementFromCSS();
const download = () => {
    // fetch SVG-rendered image as a blob object
    const svg = document.querySelector('svg');
    svg.insertBefore(style, svg.firstChild); // CSS must be explicitly embedded
    const data = (new XMLSerializer()).serializeToString(svg);
    const svgBlob = new Blob([data], {
        type: 'image/svg+xml;charset=utf-8'
    });
    style.remove(); // remove temporarily injected CSS

    // convert the blob object to a dedicated URL
    const url = URL.createObjectURL(svgBlob);
    // load the SVG blob to a flesh image object
    const img = new Image();
    img.addEventListener('load', () => {
        // draw the image on an ad-hoc canvas
        const bbox = svg.getBBox();

        const canvas = document.createElement('canvas');
        canvas.width = w * 4;
        canvas.height = h * 4;

        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0, w * 4, h * 4);

        URL.revokeObjectURL(url);
        // trigger a synthetic download operation with a temporary link
        const a = document.createElement('a');
        a.download = 'snowflake.png';
        document.body.appendChild(a);
        a.href = canvas.toDataURL();
        a.click();
        a.remove();
    });
    img.src = url;
};
/*

function validate() {
    var N = document.getElementById("N").value;
    var X = document.getElementById("X").value;
    var Y = document.getElementById("Y").value;

    if (N > 7 || N < 0) {
        alert("N має бути від 0 до 7");
        return false;
    } else if (X > 100 || X < 100 || Y > 100 || Y < 100) {
        alert("X та Y мають мати значення від -100 до 100");
        return false;
    }
}  
*/