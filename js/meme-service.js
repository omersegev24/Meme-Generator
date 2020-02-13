'use strict;'

var gCanvas;
var gCtx;
var gAddLine = 0;
var gText;
var gSearch;
var gFilter = '';




var gKeywords = { 'happy': 12, 'funny puk': 1 };

var gKeys = [
    ['toys', 'kids', 'toystory'],
    ['girl', 'dance', 'mountains'],
    ['donald', 'president', 'usa'],
    ['dogs', 'puppies', 'lali'],
    ['baby', 'kids', 'beach'],
    ['dogs', 'baby', 'bed'],
    ['cats', 'laptop', 'sleep'],
    ['wizerd', 'man', 'smile'],
    ['kids', 'smile', 'funny'],
    ['sunshine', 'man', 'zadik'],
    ['angry', 'man', 'person'],
    ['person', 'explaine', 'man'],
    ['bold', 'man', 'seated'],
    ['kids', 'dance', 'smile'],
    ['donald', 'president', 'usa'],
    ['kids', 'bigeyes', 'funny'],
    ['dogs', 'puppies', 'funny'],
    ['obama', 'president', 'usa'],
    ['man', 'basketball', 'players'],
    ['man', 'movies', 'leonardo'],
    ['man', 'movies', 'lorens'],
    ['man', 'stark', 'gameofthrones'],
    ['womens', 'tvshow', 'opra'],
    ['man', 'movie', 'starwars'],
    ['putin', 'president', 'russia']
];

var gImgs = creatImgs();

var gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'PUT TEXT HERE...',
            size: 20,
            align: 'center',
            color: 'white',
            y: 10,
            x: 0
        }
    ]
};

function init() {
    gText = document.querySelector('.meme-text');
    gText.addEventListener('keydown', drawMeme);
    gText.addEventListener('keyup', drawMeme);
    gText.addEventListener('change', drawMeme);
}

function creatImg(id, ...keyWords) {
    var img = {
        id: id,
        url: `images/${id}.jpg`,
        keywords: [...keyWords]
    }
    return img;
}

function creatImgs() {
    let i = 1
    var images = [];
    while (i !== 25) {
        keys = gKeys[i];
        images.push(creatImg(i, keys));
        i++;
    }
    return images;
}

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
    gCtx.textAlign = line.align;
    gCtx.textBaseline = 'top';
    alignText(line.align);
}

function getLineForDisplay(){
    if (!gMeme.lines.length) return;
    return gMeme.lines;
}

function getImgsForDisplay() {
    if(!gFilter) return gImgs;
    var images = gImgs.filter(img => img.keywords[0].includes(gFilter));
    return images;
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

function drawMeme() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    var img = new Image();
    var currImg = getImageByID(gMeme.selectedImgId);
    if (currImg) {
        img.src = currImg.url;
        if (img.width > window.innerWidth) img.width = window.innerWidth;
        gCanvas.height = img.height;
        gCanvas.width = img.width;
        gCtx.drawImage(img, 0, 0, img.width, img.height);
    }
    var text = document.querySelector('.meme-text').value;
    text = text.toUpperCase();
    
    if (text === '') text = 'PUT TEXT HERE...';
    var currLine = gMeme.lines[gMeme.selectedLineIdx];

    currLine.txt = text;
    setCtxContent(currLine);
    wrapText(text, currLine.x, currLine.y);
}

function wrapText(text, x, y) {
    var lines = [];
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
        txt: 'TEXT HERE...',
        size: 30,
        align: 'center',
        color: 'white',
        y: 0,
        x: gCanvas.width / 2
    };
    if (gMeme.lines.length === 0) line.y = 10;
    line.y = (gMeme.lines.length < 2) ? gCanvas.height - gCtx.lineHeight - 10 : gCanvas.height / 2;
debugger;
    gMeme.lines.push(line);
    drawMeme();
    gAddLine++;
}

function deleteLine() {
    var lineIdx = gMeme.selectedLineIdx
    if (lineIdx === 0) return;
    gMeme.lines.splice(lineIdx, 1);
    lineIdx--;
    document.querySelector('.meme-text').value = gMeme.lines[lineIdx].txt;
    gMeme.selectedLineIdx = lineIdx;
    gAddLine--;
    drawMeme();
}

function alignText(val, isClicked = false) {
    gMeme.lines[gMeme.selectedLineIdx].align = val;
    if (val === 'left') gMeme.lines[gMeme.selectedLineIdx].x = 10;
    if (val === 'center') gMeme.lines[gMeme.selectedLineIdx].x = gCanvas.width / 2;
    if (val === 'right') gMeme.lines[gMeme.selectedLineIdx].x = gCanvas.width - 10;
    if (isClicked) drawMeme();
    // drawMeme();
}

function searchImg(val){
    gFilter = val;
    renderImages();
    resizeAllGridItems();
}
