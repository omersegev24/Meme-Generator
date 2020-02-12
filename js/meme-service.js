'use strict;'

var gCanvas;
var gCtx;
var gAddLine = 0;



var gKeywords = { 'happy': 12, 'funny puk': 1 };
var gImgs = [
    {
        id: 1,
        url: 'images/1.jpg',
        keywords: ['trump']
    },
    {
        id: 2,
        url: 'images/2.jpg',
        keywords: ['puppies']
    },
];

var gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    lines: [{
        txt: 'PUT TEXT HERE...',
        size: 20,
        align: 'left',
        color: 'white',
        y: 10
    }]
};

function setCanvas(canvas) {
    gCanvas = canvas;
}

function setCtx(ctx) {
    gCtx = ctx;
}

function setCtxContent(line) {
    gCtx.lineWidth = 4;
    gCtx.lineHeight = line.size + 5;
    gCtx.font = `${line.size}px Impact`;
    gCtx.strokeStyle = 'black';
    gCtx.fillStyle = line.color;
    gCtx.textAlign = 'center';
    gCtx.textBaseline = 'top';
}

function renderLines() {
    var x = gCanvas.width / 2;
    gMeme.lines.map(line => {
        setCtxContent(line);
        gCtx.strokeText(line.txt, x, line.y);
        gCtx.fillText(line.txt, x, line.y);
    })
}

function getImgsForDisplay() {
    return gImgs;
}

function downloadCanvas(elLink) {
    const data = gCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'Meme'
}
function getImageByID(id) {
    let img = gImgs.find(img => img.id === id);
    return img;
}

function selectImage(id) {
    gMeme.selectedImgId = id;
    drawMeme();
}


var topText = document.querySelector('.meme-text');
topText.addEventListener('keydown', drawMeme);
topText.addEventListener('keyup', drawMeme);
topText.addEventListener('change', drawMeme);


function drawMeme() {

    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    var img = new Image();
    var currImg = getImageByID(gMeme.selectedImgId);
    if (currImg) {
        img.src = currImg.url;
        gCanvas.width = img.width;
        gCanvas.height = img.height;
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        // scaleToFit(img);
    }

    var text = document.querySelector('.meme-text').value;
    text = text.toUpperCase();
    x = gCanvas.width / 2;

    var currLine = gMeme.lines[gMeme.selectedLineIdx];

    if (text === '') text = 'PUT TEXT HERE...';

    currLine.txt = text;
    setCtxContent(currLine);
    wrapText(text, x, currLine.y);
}


function wrapText(text, x, y) {
    var lines = [];
    var y = y;
    var line = '';
    if (text === '') return;
    var words = text.split(' ');

    for (var i = 0; i < words.length; i++) {
        var testLine = (i === 0) ? words[i] : line + ' ' + words[i];
        var metrics = gCtx.measureText(testLine);
        var testWidth = metrics.width;

        if (testWidth < gCanvas.width) line = testLine;
        else {
            lines.push(line);
            line = words[i] + ' ';
        }
    }
    lines.push(line);
    for (var line in lines) {
        gCtx.strokeText(lines[line], x, y);
        gCtx.fillText(lines[line], x, y);
        renderLines();
    }
}

function changeFont(diff) {
    gMeme.lines[gMeme.selectedLineIdx].size += diff;
    drawMeme();
}
function moveText(text) {
    gMeme.lines[gMeme.selectedLineIdx].y += (text === 'down') ? 1 : -1;
    drawMeme();
}
function switchLine() {
    var lineIdx = gMeme.selectedLineIdx;
    lineIdx += 1;
    if (lineIdx === gMeme.lines.length) lineIdx = 0;
    gMeme.selectedLineIdx = lineIdx;
    document.querySelector('.meme-text').value = gMeme.lines[lineIdx].txt;
    drawMeme();
}

function addLine() {
    if (gAddLine === 2) return;
    var line = {
        txt: 'PUT TEXT HERE...',
        size: 30,
        align: 'left',
        color: 'white',
        y: 0
    };
    if (gMeme.lines.length < 2) {
        line.y = gCanvas.height - gCtx.lineHeight - 10;
    } else {
        line.y = gCanvas.height / 2;
    }
    gMeme.lines.splice(1, 0, line);
    drawMeme();
    gAddLine++;
}

function deleteLine(){
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    gMeme.selectedLineIdx--;
    drawMeme();
}

// function scaleToFit(img) {
//     // get the scale
//     var scale = Math.min(gCanvas.width / img.width, gCanvas.height / img.height);
//     // get the top left position of the image
//     var x = (gCanvas.width / 2) - (img.width / 2) * scale;
//     var y = (gCanvas.height / 2) - (img.height / 2) * scale;

//     gCtx.drawImage(img, x, y, img.width * scale, img.height * scale);
// }