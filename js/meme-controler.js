'use strict;'



function onInit() {
    renderImages();
    renderCanvas();
    renderLines();
    init();
}

function renderCanvas() {
    var canvas = document.querySelector('.editor-canvas');
    var ctx = canvas.getContext('2d');
    setCanvas(canvas);
    setCtx(ctx);
}

function resizeCanvas() {
    var elContainer = document.querySelector('.editor-container');
    gCanvas.width = ((elContainer.offsetWidth / 2) > 500) ? 500 : elContainer.offsetWidth / 2;
    gCanvas.height = elContainer.offsetHeight;
}

function renderImages() {
    var images = getImgsForDisplay();
    let strHtml = images.map(img => {
        return `<img class="item" onclick="onSelectImage(${img.id})" src="images/${img.id}.jpg" alt="${img.keywords[0]}"></img>`;
    });
    elImgCon = document.querySelector('.images-container');
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
    switch (pageName) {
        case 'Memes':
            // document.querySelector('.images-container').style = 'display: none;';
            break;
        case 'Gallery':
            document.querySelector('.editor-container').style = 'display: none;';
            document.querySelector('.images-gallery').style = 'display: grid;';
            document.querySelector('.gallery').classList.add('open');
            break;
        case 'editor':
            document.querySelector('.editor-container').style = 'display: flex;';
            document.querySelector('.images-gallery').style = 'display: none;';
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

function onSearchImg(val){
    searchImg(val);
}

function openMenu() {
    document.body.classList.toggle('menu-open');
}