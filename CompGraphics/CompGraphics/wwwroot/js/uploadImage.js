var imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', handleImage, false);
const canvas = document.getElementById('canvas1');
var ctx = canvas.getContext('2d');
const canvas2 = document.getElementById('canvas2');
var ctx2 = canvas2.getContext('2d');
var imageData;

window.onload = function () {
    alert('Вибери фото зі свого пристрою для того, щоб почати роботу');
}

function handleImage(e) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = new Image();
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            var w = img.width;
            var h = img.height;
            var sizer = scalePreserveAspectRatio(w, h, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, w, h, 0, 0, w * sizer, h * sizer);
            canvas2.width = img.width;
            canvas2.height = img.height;
            ctx2.drawImage(img, 0, 0, w, h, 0, 0, w * sizer, h * sizer);
            imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
           // rgb2cmyk2rgb();
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
}

function scalePreserveAspectRatio(imgW, imgH, maxW, maxH) {
    return (Math.max((maxW / imgW), (maxH / imgH)));
}

async function downloadCanvas(el) {
    const imageURI = canvas.toDataURL("image/jpg", 1);
    el.href = imageURI;
};

async function downloadCanvas2(el) {
    const imageURI = canvas2.toDataURL("image/jpg", 1);
    el.href = imageURI;
};

function rgb2cmyk2rgb() {
    //data in cmyk
    //imageData in rgbo
    var data = imageData.data;
    for (var i = 0; i < data.length; i += 4) {
        var r = imageData.data[i];
        var g = imageData.data[i + 1];
        var b = imageData.data[i + 2];
        var c = 1 - (r / 255);
        var m = 1 - (g / 255);
        var y = 1 - (b / 255);
        var k = Math.min(c, Math.min(m, y));
        c = (c - k) / (1 - k);
        m = (m - k) / (1 - k);
        y = (y - k) / (1 - k);

        data[i] = c*100;
        data[i + 1] = m*100;
        data[i + 2] = y*100;
        data[i + 3] = k*100;
    }

    //cmyk to rgb
    for (var i = 0; i < imageData.data.length; i += 4) {
        var c = data[i];
        var m = data[i + 1];
        var y = data[i + 2];
        var k = data[i + 3];
        c = (c / 100);
        m = (m / 100);
        y = (y / 100);
        k = (k / 100);

        c = c * (1 - k) + k;
        m = m * (1 - k) + k;
        y = y * (1 - k) + k;

        var r = 1 - c;
        var g = 1 - m;
        var b = 1 - y;

        imageData.data[i] = r*255;
        imageData.data[i + 1] =g*255;
        imageData.data[i + 2] = b * 255;
        imageData.data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    ctx2.putImageData(imageData, 0, 0);
    rgb2hsv2rgb();
}

function rgb2hsv2rgb() {
    var data = imageData.data;
    //rgb to hsv
    for (var i = 0; i < data.length; i += 4) {
        var r = imageData.data[i];
        var g = imageData.data[i + 1];
        var b = imageData.data[i + 2];
        r = r / 255.0;
        g = g / 255.0;
        b = b / 255.0;

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, v = max;

        var d = max - min;
        s = max == 0 ? 0 : d / max;

        if (max == min) {
            h = 0; // achromatic
        } else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }
        data[i] = h*100;
        data[i + 1] = s*100;
        data[i + 2] = v*100;
    }

    //hsv to rgb
    for (var i = 0; i < imageData.data.length; i += 4) {
        var newImageData = imageData;
        var h = data[i]/100;
        var s = data[i + 1]/100;
        var v = data[i + 2]/100;

        var r, g, b;

        var check = Math.floor(h * 6);
        var f = h * 6 - check;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);

        switch (check % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }

        imageData.data[i] = r * 255;
        imageData.data[i + 1] = g * 255;
        imageData.data[i + 2] = b * 255;
        imageData.data[i + 3] = 255;
    }
    ctx2.putImageData(imageData, 0, 0);
}


function init() {
    slider = document.getElementById('BlueSlider');
    blueValue = document.getElementById('BlueValue');
    slider.addEventListener('change', function (event) {
        var newImageData;

        blueValue.innerText = event.currentTarget.value;

        ctx2.putImageData(imageData, 0, 0);

        newImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        applySaturation(
            newImageData.data,
            parseInt(slider.value, 10)
        );

        ctx2.putImageData(newImageData, 0, 0);
    });
}

function applySaturation(data, saturation) {
    for (var i = 0; i < data.length; i += 4) {
        var hsv = rgbToHsv(data[i], data[i + 1], data[i + 2]);
        if (hsv[0] >= 0.50 && hsv[0] <= 0.75) {
            var rgb = hsvToRgb(hsv[0], saturation/100 , hsv[2]);
            data[i] = rgb[0];
            data[i + 1] = rgb[1];
            data[i + 2] = rgb[2];
        }
    }
}

window.addEventListener('load', init);

function rgbToHsv(r, g, b) {
    r /= 255, g /= 255, b /= 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return [h, s, v];
}
function hsvToRgb(h, s, v) {
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    return [r * 255, g * 255, b * 255];
}
function rgbToCmyk(r, g, b) {
    var c = 1 - (r / 255);
    var m = 1 - (g / 255);
    var y = 1 - (b / 255);
    var k = Math.min(c, Math.min(m, y));
    c = (c - k) / (1 - k);
    m = (m - k) / (1 - k);
    y = (y - k) / (1 - k);

    return [c * 100, m * 100, y * 100, k*100];
}


const hoveredColorRGB = document.getElementById("RGBValue");
const hoveredColorCMYK = document.getElementById("CMYKValue");
const hoveredColorHSV = document.getElementById("HSVValue");
//const selectedColor = document.getElementById("selected-color");

function pick(event, destRGB, destCMYK, destHSV ) {
    const bounding = canvas.getBoundingClientRect();
    const x = event.clientX - bounding.left;
    const y = event.clientY - bounding.top;
    if (x > canvas.clientWidth || y > canvas.clientHeight) {
        const bounding = canvas2.getBoundingClientRect();
        const x = event.clientX - bounding.left;
        const y = event.clientY - bounding.top;
        const pixel = ctx2.getImageData(x, y, 1, 1);
        const data = pixel.data;
        const rgb = ` ${data[0]}, ${data[1]}, ${data[2]}`;
        var hsvData = rgbToHsv(data[0], data[1], data[2]);
        var hsv = ` ${Math.round(hsvData[0] * 360)}, ${Math.round(hsvData[1] * 100)}, ${Math.round(hsvData[2] * 100)}`;
        var cmykData = rgbToCmyk(data[0], data[1], data[2]);
        var cmyk = ` ${Math.round(cmykData[0])}, ${Math.round(cmykData[1])}, ${Math.round(cmykData[2])}, ${Math.round(cmykData[3])}`;
        if (x < canvas2.clientLeft || y < canvas2.clientTop) cmyk = ` 0, 0, 0, 0`;
        destRGB.innerText = rgb;
        destHSV.innerText = hsv;
        destCMYK.innerText = cmyk;
        return;

        if (x > canvas2.clientWidth || y > canvas2.clientHeight)
        return;
    }

    const pixel = ctx.getImageData(x, y, 1, 1);
    const data = pixel.data;

    const rgb = ` ${data[0]}, ${data[1]}, ${data[2]}`;
    var hsvData = rgbToHsv(data[0], data[1], data[2]);
    var hsv = ` ${Math.round(hsvData[0] * 360)}, ${Math.round(hsvData[1] * 100)}, ${Math.round(hsvData[2] * 100)}`;
    var cmykData = rgbToCmyk(data[0], data[1], data[2]);
    var cmyk = ` ${Math.round(cmykData[0])}, ${Math.round(cmykData[1])}, ${Math.round(cmykData[2])}, ${Math.round(cmykData[3])}`;

    if (x < canvas.clientLeft || y < canvas.clientTop) cmyk = ` 0, 0, 0, 0`;

    destRGB.innerText = rgb;
    destHSV.innerText = hsv;
    destCMYK.innerText = cmyk;

    return;
}

window.addEventListener("mousemove", (event) => pick(event, hoveredColorRGB, hoveredColorCMYK, hoveredColorHSV));

