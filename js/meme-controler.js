'use strict;'

var isPageMeme;

function onInit() {
    renderImages();
    renderCanvas();
    renderLines();
    init();
    setTimeout(resizeAllGridItems, 100);
}

function renderCanvas() {
    var canvas = document.querySelector('.editor-canvas');
    var ctx = canvas.getContext('2d');
    setCanvas(canvas);
    setCtx(ctx);
}

function mouseDown(e){
    console.log(e);
}

function resizeCanvas() {
    var elContainer = document.querySelector('.editor-container');
    gCanvas.width = ((elContainer.offsetWidth / 2) > 500) ? 500 : elContainer.offsetWidth / 2;
    gCanvas.height = elContainer.offsetHeight;
}

function renderImages(isMemePage = false) {
    let images = (isMemePage) ? getMemeImgs() : getImgsForDisplay();
    let selector = (isMemePage) ? '.images-memes-container' : '.images-container';
    isPageMeme = isMemePage;

    if (isMemePage) {
        var strHtml = images.map(img => {
            return `<img class="item" src="${img.url}" alt="${img.keywords}"></img>`;
        });
    } else {
        var strHtml = images.map(img => {
            return `<img class="item" onclick="onSelectImage(${img.id})" src="images/${img.id}.jpg" alt="${img.keywords}"></img>`;
        });
    }

    let elImgCon = document.querySelector(selector);
    elImgCon.innerHTML = strHtml.join(' ');
    resizeAllGridItems();
}

function renderLines() {
    var lines = getLineForDisplay();
    lines.forEach(line => {
        setCtxContent(line);
        gCtx.strokeText(line.txt, line.x, line.y);
        gCtx.fillText(line.txt, line.x, line.y);
    })
}

function onSelectImage(id) {
    changePage('editor');
    document.querySelector('.nav-link.open').classList.remove('open');
    selectImage(id);
}

function onChangeFontSize(diff) {
    changeFont(diff);
}

function onMoveText(text) {
    moveText(text);
}

function onSwitchLine() {
    switchLine();
}

function onAddLine() {
    addLine();
}

function onDeleteLine() {
    deleteLine();
}

function onToggleMenu(elBtn, isBack = false) {
    if (isBack) return changePage(elBtn);
    var elActiveLink = document.querySelector('.nav-link.open');
    if (elActiveLink) elActiveLink.classList.remove('open');
    elBtn.classList.toggle('open');
    changePage(elBtn.innerText);
}

function changePage(pageName) {
    var elEditContainer = document.querySelector('.editor-container');
    var elImgGall = document.querySelector('.images-gallery');
    var elImgCon = document.querySelector('.images-container');
    var elImgMemeCon = document.querySelector('.images-memes-container');

    switch (pageName) {
        case 'Memes':
            elEditContainer.style = 'display: none;';
            elImgCon.style = 'display: none;';
            elImgGall.style = 'display: grid;';
            elImgMemeCon.style = 'display: grid;';
            renderImages(true);
            break;
        case 'Gallery':
            document.querySelector('.meme-text').value = '';

            elEditContainer.style = 'display: none;';
            elImgMemeCon.style = 'display: none;';
            elImgGall.style = 'display: grid;';
            elImgCon.style = 'display: grid;';

            document.querySelector('.gallery').classList.add('open');
            renderImages();
            break;
        case 'editor':
            elImgGall.style = 'display: none;';
            elImgCon.style = 'display: none;';
            elEditContainer.style = 'display: flex;';
    }
}

function onAlignText(value, isClicked) {
    alignText(value, isClicked);
}

function downloadCanvas(elLink) {
    const data = gCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'meme.jpg';
}

function onSearchImg(val) {
    searchImg(val);
}

function openMenu() {
    document.body.classList.toggle('menu-open');
}

function onPickColor() {
    var val = document.querySelector('.font-color').value;
    console.log(val)
    pickColor(val);
}

function resizeGridItem(item) {
    var selector = (isPageMeme) ? 'images-memes-container' : 'images-container';
    grid = document.getElementsByClassName(selector)[0];
    rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
    rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
    rowSpan = Math.ceil((item.offsetHeight + rowGap) / (rowHeight + rowGap));
    item.style.gridRowEnd = "span " + rowSpan;
}

function resizeAllGridItems() {
    allItems = document.getElementsByClassName("item");
    for (x = 0; x < allItems.length; x++) {
        resizeGridItem(allItems[x]);
    }
}

function resizeInstance(instance) {
    item = instance.elements[0];
    resizeGridItem(item);
}

function onSaveMeme() {
    saveMemeToLocal();
}


