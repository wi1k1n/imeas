(function() {
    const DRAGMINDST = 1;  // minimum distance (manhattan) at which drag detection starts
    
    const cnv = document.getElementById('cnv_editor');
    const ctx = cnv.getContext ? cnv.getContext('2d') : null;
    if (!ctx) return console.error('Could not get canvas context. Exiting...');
    
    // Make canvas clearer
    const divCnv = document.getElementById('div_canvas');
    cnv.width = divCnv.clientWidth * 2;
    cnv.height = divCnv.clientHeight * 2;
    const w = cnv.width / 2, h = cnv.height / 2;
    ctx.scale(2, 2);

    let img = new Image;
    let imgOffset = {x: 0, y: 0};
    let imgScale = {x: 1.0, y: 1.0};
    // Draw welcome
    img.onload = function() {
        imgOffset.x = (w - img.width) / 2;
        imgOffset.y = (h - img.height) / 2;

        redrawImage();
    }
    img.src = 'data:image/png;base64,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';

    function onImageLoaded() {
        // reset manipulation options
        imgOffset = {x: 0, y: 0};
        imgScale = {x: 1.0, y: 1.0};

        // fit image into canvas size
        const rw = img.width * imgScale.x;  // render width
        if (rw > w) {
            const f = rw / w;
            imgScale.x /= f;
            imgScale.y /= f;
        }
        const rh = img.height * imgScale.y;  // render height
        if (rh > h) {
            const f = rh / h;
            imgScale.x /= f;
            imgScale.y /= f;
        }

        redrawImage();
    }

    function redrawImage() {
        ctx.clearRect(0, 0, w, h);

        ctx.drawImage(img, imgOffset.x, imgOffset.y, img.width * imgScale.x, img.height * imgScale.y);
    }

    // Canvas Processed Event Handlers
    let imgOffsetClick = {x: 0, y: 0};
    // let lastDragPos = {x: 0, y: 0};
    function cnvOnSingleClick(evt) {
        console.log('single click');
    }
    function cnvOnDragStart(evt) {
        // console.log('drag start');
        imgOffsetClick.x = downPos.x - imgOffset.x;
        imgOffsetClick.y = downPos.y - imgOffset.y;
        
        // console.log('drag started');
        // console.log('imgOffsetClick: ', imgOffsetClick);
        // console.log('imgOffset: ', imgOffset);
    }
    function cnvOnDrag(evt) {
        // console.log('drag');
        imgOffset.x = evt.x - imgOffsetClick.x;
        imgOffset.y = evt.y - imgOffsetClick.y;
        
        // console.log('imgOffset: ', imgOffset);
        // if (Math.abs(evt.x - lastDragPos.x) > 1 || Math.abs(evt.y - lastDragPos.y) > 1)
            redrawImage();
            
        // lastDragPos.x = evt.x;
        // lastDragPos.y = evt.y;
    }
    function cnvOnDrop(evt) {
        console.log('drop');
    }

    // Canvas event handlers
    let downPos = null;  // position of where mouseDown has been triggered
    let isDown = false;
    let isDragging = false;
    function cnvOnMouseDown(evt) {
        // console.log(evt);
        isDown = true;
        downPos = {x: evt.x, y: evt.y};
    }
    function cnvOnMouseUp(evt) {
        // console.log(evt);
        if (isDragging) {
            cnvOnDrop(evt);
        } else {
            cnvOnSingleClick(evt);
        }
        isDown = false;
        isDragging = false;
    }
    function cnvOnMouseMove(evt) {
        // console.log(evt);
        if (isDown) {
            if (!isDragging) {
                if (Math.abs(evt.x - downPos.x) > DRAGMINDST || Math.abs(evt.y - downPos.y) > DRAGMINDST) {
                    cnvOnDragStart(evt);
                    isDragging = true;
                }
            } else {
                cnvOnDrag(evt);
            }
        }
    }


    // function to show open file dialog
    function showOpenFileDialog() {
        $('#inp_file').trigger('click');
    }
    // when user selects file
    function inp_fileOnChange(e) {
        if (!e.target.files || !e.target.files.length) return;
        img.onload = onImageLoaded;
        img.src = URL.createObjectURL(e.target.files[0]);
    }


    (function initializeEventHandlers() {
        $('#inp_file').on('change', inp_fileOnChange);

        cnv.onmousedown = cnvOnMouseDown;
        cnv.onmouseup = cnvOnMouseUp;
        cnv.onmousemove = cnvOnMouseMove;
    })();

    (function initializeHotKeys() {
        // show open file dialog
        hotkeys('ctrl+o,esc', function (event, handler){
            switch (handler.key) {
                case 'ctrl+o':
                    event.preventDefault();
                    showOpenFileDialog();
                    break;
                case 'esc':
                    console.log('you pressed esc!');
                    break;
                default: console.log(event);
            }
        });
    })();
})();