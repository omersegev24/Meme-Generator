'use strict;'

var gCanvas,
    gCtx,
    gAddLine = 0,
    gText,
    gSearch,
    gFilter = '',
    gMemeImgs = [],
    gMove = false;



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
            x: 0,
            width: 0
        }
    ]
};

function init() {
    gText = document.querySelector('.meme-text');
    gText.addEventListener('keydown', drawMeme);
    gText.addEventListener('keyup', drawMeme);
    gText.addEventListener('change', drawMeme);

    gCanvas.addEventListener('mousedown', (ev) => {
        mouseEventHandle('down', ev);
    });
    gCanvas.addEventListener('mousemove', (ev) => {
        mouseEventHandle('move', ev);
    });
    gCanvas.addEventListener('mouseup', (ev) => {
        mouseEventHandle('up', ev);
    });
    gCanvas.addEventListener('mouseout', (ev) => {
        mouseEventHandle('out', ev);
    });

    gCanvas.addEventListener("touchstart", function (ev) {
        touchMoveHandle(ev);
    }, false);
    gCanvas.addEventListener("touchmove", function (ev) {
        touchMoveHandle(ev);
    }, false);
    gCanvas.addEventListener("touchend", function () {
        gCanvas.touchmove = null;
    }, false);
}

function getMousePos(gCanvas, ev) {
    var rect = gCanvas.getBoundingClientRect();
    return {
        x: ev.clientX - rect.left,
        y: ev.clientY - rect.top
    };
}
function getTouchPos(canvasDom, touchEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
        x: touchEvent.touches[0].clientX - rect.left,
        y: touchEvent.touches[0].clientY - rect.top
    };
}

function touchMoveHandle(ev){
    var { x, y } = getTouchPos(gCanvas, ev);
        gMeme.lines[gMeme.selectedLineIdx].x = x;
        gMeme.lines[gMeme.selectedLineIdx].y = y;
        drawMeme();
}

function mouseEventHandle(mouse, ev) {
    if (mouse === 'down') {
        // gMeme.lines[gMeme.selectedLineIdx].align = 'custome';
        var { offsetX, offsetY } = ev;

        ///////TODO: fix line align center////// 

        var clickedLine = gMeme.lines.find(line => {
            return offsetX > line.x
                && offsetX < line.x + line.width
                && offsetY > line.y
                && offsetY < line.y + line.size
        })
        if (clickedLine) {
            gMove = true;
        }
    }
    if (mouse === 'up' || mouse === 'out') {
        gMove = false;
    }
    if (mouse === 'move') {
        if (gMove) {
            
            var pos = getMousePos(gCanvas, ev);
            gMeme.lines[gMeme.selectedLineIdx].x = pos.x;
            gMeme.lines[gMeme.selectedLineIdx].y = pos.y;
            drawMeme();
        }
    }
}

function creatImg(id, ...keyWords) {
    var img = {
        id: id,
        url: `images/${id}.jpg`,
        keywords: [...keyWords]
        // lines:{}
    }
    return img;
}

function creatImgs() {
    let i = 1
    var images = [];
    while (i !== 25) {
        keys = gKeys[i - 1];
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

    if (line.align === 'custome') return;
    alignText(line.align);
}

function getLineForDisplay() {
    if (!gMeme.lines.length) return;
    return gMeme.lines;
}

function getImgsForDisplay() {
    if (!gFilter) return gImgs;
    var images = gImgs.filter(img => img.keywords[0].includes(gFilter));
    return images;
}

function getMemeImgs() {
    var val = localStorage.getItem('Memes');
    var obj = JSON.parse(val);
    // gMeme.lines[obj.id] = obj.lines;

    return obj;
}

function saveMemeToLocal() {
    var img = gImgs[gMeme.selectedImgId - 1];
    img.url = gCanvas.toDataURL("image/jpeg");
    img.width = gCanvas.width;
    img.height = gCanvas.height
    gMemeImgs.push(img);
    localStorage.setItem('Memes', JSON.stringify(gMemeImgs));
}

function downloadgCanvas(elLink) {
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
        gMeme.lines[gMeme.selectedLineIdx].width = testWidth;

        if (testWidth < gCanvas.width) line = testLine;
        else {
            lines.push(line);
            line = words[i] + ' ';
        }
    }
    lines.push(line);
    // for (let line in lines) {
    //     gCtx.strokeText(lines[line], x, y);
    //     gCtx.fillText(lines[line], x, y);
    renderLines();
    // }
}
function drawText(lines){
    lines.forEach((line,idx)=> {
        setCtxContent(line);
        gCtx.strokeText(line.txt, line.x, line.y);
        gCtx.fillText(line.txt, line.x, line.y);
        gMeme.lines[idx].width = Math.round(gCtx.measureText(line.txt).width);
    })
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
    else line.y = (gMeme.lines.length < 2) ? gCanvas.height - gCtx.lineHeight - 10 : gCanvas.height / 2;
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

function searchImg(val) {
    gFilter = val;
    renderImages();
    resizeAllGridItems();
}

function pickColor(val) {
    gMeme.lines[gMeme.selectedLineIdx].color = val;
    renderLines();
}

