function setfont() {
    var clientWidth = document.body.clientWidth || document.documentElement.clientWidth;
    if (clientWidth > 750) {
        clientWidth = 750;
    }
    document.documentElement.style.fontSize = clientWidth / 7.5 + 'px';
}
setfont();
window.addEventListener('resize', setfont);