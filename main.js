define([
    'require',
    'jquery',
    'base/js/events',
    'base/js/namespace',
], function (
    requirejs,
    $, 
    events,
    Jupyter,
) {
    "use strict";

    function redraw(context, clickX, clickY, clickDrag, clickColor, clickWidth, config){
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        context.lineJoin = config.lineJoin == undefined ? "round": config.lineJoin;
                    
        for(var i=0; i < clickX.length; i++) {	
            context.beginPath();
            if(clickDrag[i] && i){
            context.moveTo(clickX[i-1], clickY[i-1]);
            }else{
                context.moveTo(clickX[i]-1, clickY[i]);
            }
            context.lineTo(clickX[i], clickY[i]);
            context.closePath();
            context.strokeStyle = clickColor[i];
            context.lineWidth = clickWidth[i];
            context.stroke();
        }
    }

    events.on('execute.CodeCell',
        function(event, data) {
            initialize();
            let cell_text = data.cell.get_text().split('\n')[0];
            if (cell_text.startsWith('#jupyter_draw')) {
                var config;
                if (cell_text.search('=') != -1) {
                    config = JSON.parse(cell_text.split('=')[1]);
                } else {
                    config = {};
                }
                var canvasWidth = data.cell.output_area.element[0].clientWidth;
                var canvasHeight = config.height;
                var canvas = document.createElement('canvas');
                canvas.setAttribute('width', canvasWidth);
                canvas.setAttribute('height', canvasHeight);
                if(typeof G_vmlCanvasManager != 'undefined') {
                    canvas = G_vmlCanvasManager.initElement(canvas);
                }
                var context = canvas.getContext("2d");
                var clickX = new Array();
                var clickY = new Array();
                var clickDrag = new Array();
                var clickColor = new Array();
                var clickWidth = new Array();
                var paint;

                function addClick(x, y, dragging)
                {
                    clickX.push(x);
                    clickY.push(y);
                    clickDrag.push(dragging);
                    clickColor.push(config.color == undefined ? '#000000' : config.color);
                    clickWidth.push(config.width == undefined ? 5: config.width);
                }

                canvas.onmousedown = function(e){
                    var bound = canvas.getBoundingClientRect();
                    let x = (e.clientX - bound.left) / (bound.right - bound.left) * canvas.width;
                    let y = (e.clientY - bound.top) / (bound.bottom - bound.top) * canvas.height;

                    paint = true;
                    addClick(x, y);
                    redraw(context, clickX, clickY, clickDrag, clickColor, clickWidth, config);
                };

                canvas.onmousemove = function(e){
                    if(paint){
                        var bound = canvas.getBoundingClientRect();
                        let x = (e.clientX - bound.left) / (bound.right - bound.left) * canvas.width;
                        let y = (e.clientY - bound.top) / (bound.bottom - bound.top) * canvas.height;
                        addClick(x, y, true);
                        redraw(context, clickX, clickY, clickDrag, clickColor, clickWidth, config);
                    }
                };
                canvas.onmouseup = function(e){
                    paint = false;
                };

                canvas.onmouseleave = function(e){
                    paint = false;
                };


                var clearButton = document.createElement('button');
                clearButton.setAttribute('class', 'button');
                clearButton.innerHTML = 'clear';
                clearButton.onclick = function () {
                    clickX = Array();
                    clickY = Array();
                    clickDrag = Array();
                    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
                }
                
                var eraserButton = document.createElement('button');
                eraserButton.setAttribute('class', 'button');
                eraserButton.innerHTML = 'eraser';
                eraserButton.onclick = function () {
                    config.preColor = config.color;
                    config.color = '#FFFFFF'; 
                }

                var penButton = document.createElement('button');
                penButton.innerHTML = 'pen';
                penButton.setAttribute('class', 'button');
                penButton.onclick = function () {
                    config.color = colorInput.value;
                }
                
                var colorInput = document.createElement('input');
                colorInput.setAttribute('type', 'color');
                colorInput.setAttribute('class', 'button');
                colorInput.setAttribute('style', 'width: -webkit-fill-available; padding: 0px');
                colorInput.setAttribute('value', config.color == undefined ? '#000000' : config.color);
                colorInput.onchange = function() {
                    config.color = colorInput.value;
                }
                
                var sizeInput = document.createElement('input');
                sizeInput.setAttribute('type', 'number');
                sizeInput.setAttribute('min', 1);
                sizeInput.setAttribute('max', 100);
                sizeInput.setAttribute('value', 5);
                sizeInput.setAttribute('class', 'button');
                sizeInput.onchange = function() {
                    config.width = sizeInput.value;
                }

                var controlDiv = document.createElement('div');
                controlDiv.setAttribute('class', 'cpanel');
                controlDiv.appendChild(clearButton);
                controlDiv.appendChild(eraserButton);
                controlDiv.appendChild(penButton);
                controlDiv.appendChild(colorInput);
                controlDiv.appendChild(sizeInput);

                var toggleButton = document.createElement('input');
                toggleButton.setAttribute('type', 'checkbox');
                toggleButton.checked = true;
                toggleButton.setAttribute('class', 'up');
                
                toggleButton.onchange = function() {
                    if (toggleButton.checked) {
                        controlDiv.setAttribute('style', 'display:block');
                    } else {
                        controlDiv.setAttribute('style', 'display:none');
                    }
                }
                
                var drawPanel = document.createElement('div');
                drawPanel.setAttribute('style', 'display:flex;')

                drawPanel.appendChild(controlDiv);
                drawPanel.appendChild(canvas);

                data.cell.output_area.element.append(drawPanel);
                data.cell.output_area.element.append(toggleButton);
            }
    });

    function initialize() {
        $('<link/>')
            .attr({
                rel: 'stylesheet',
                type: 'text/css',
                href: requirejs.toUrl('./draw.css')
            })
            .appendTo('head');
    }

    var load_ipython_extension = function() {
        return Jupyter.notebook.config.loaded.then(initialize);
    }   
    return {
        load_ipython_extension : load_ipython_extension
    }
});