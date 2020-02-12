'use strict;'



function onInit() {
    renderImages();
    renderCanvas();
    resizeCanvas();
    renderLines();
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


function renderImages(){
    var images = getImgsForDisplay();
    let strHtml = '';
    for (let img of images){
        strHtml += `<img onclick="onSelectImage(${img.id})" src="images/${img.id}.jpg" alt="${img.keywords}"></img>`;
    }
    elImgCon = document.querySelector('.images-container');
    elImgCon.innerHTML = strHtml;
}

function onSelectImage(id){
    selectImage(id);
}

function onChangeFontSize(diff){
    changeFont(diff);
}

function onMoveText(text){
    moveText(text);
}

function onSwitchLine(){
    switchLine();
}

function onAddLine(){
    addLine();
}

function onDeleteLine(){
    deleteLine();
}