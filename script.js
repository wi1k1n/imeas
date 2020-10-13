hotkeys('ctrl+o,esc', function (event, handler){
    switch (handler.key) {
        case 'ctrl+o':
            event.preventDefault();
            // console.log('you pressed ctrl+o!');
            showOpenFileDialog();
            break;
        case 'esc':
            console.log('you pressed esc!');
            break;
        default: console.log(event);
    }
});

function showOpenFileDialog() {
    $('#inp_file').trigger('click');
}
$('#inp_file').on('change', (e) => {
    if (!e.target.files || !e.target.files.length) return;
    img.onload = () => drawImage();
    img.src = URL.createObjectURL(e.target.files[0]);
});

let img = new Image;
const cnv = document.getElementById('cnv_editor');
const ctx = cnv.getContext ? cnv.getContext('2d') : null;

function drawImage() {
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, cnv.width, cnv.height);
}