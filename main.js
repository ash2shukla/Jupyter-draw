define([
    'jquery',
    'base/js/dialog',
    'base/js/events',
    'base/js/namespace',
    'notebook/js/celltoolbar',
    'notebook/js/codecell',
], function (
    $,
    dialog,
    events,
    Jupyter,
    celltoolbar,
    codecell
) {
    "use strict";

    function redraw(context, clickX, clickY, clickDrag, config){
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        
        context.strokeStyle = config.color == undefined ? "#df4b26": config.color;
        context.lineJoin = config.lineJoin == undefined ? "round": config.lineJoin;
        context.lineWidth = config.width == undefined ? 5: config.width;
                    
        for(var i=0; i < clickX.length; i++) {	
            context.beginPath();
            if(clickDrag[i] && i){
            context.moveTo(clickX[i-1], clickY[i-1]);
            }else{
                context.moveTo(clickX[i]-1, clickY[i]);
            }
            context.lineTo(clickX[i], clickY[i]);
            context.closePath();
            context.stroke();
        }
    }

    events.on('execute.CodeCell',
        function(event, data) {
            let cell_text = data.cell.get_text();
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
                var paint;

                function addClick(x, y, dragging)
                {
                    clickX.push(x);
                    clickY.push(y);
                    clickDrag.push(dragging);
                }

                canvas.onmousedown = function(e){
                    var bound = canvas.getBoundingClientRect();
                    let x = (e.clientX - bound.left) / (bound.right - bound.left) * canvas.width;
                    let y = (e.clientY - bound.top) / (bound.bottom - bound.top) * canvas.height;

                    paint = true;
                    addClick(x, y);
                    redraw(context, clickX, clickY, clickDrag, config);
                };

                canvas.onmousemove = function(e){
                    if(paint){
                        var bound = canvas.getBoundingClientRect();
                        let x = (e.clientX - bound.left) / (bound.right - bound.left) * canvas.width;
                        let y = (e.clientY - bound.top) / (bound.bottom - bound.top) * canvas.height;
                        addClick(x, y, true);
                        redraw(context, clickX, clickY, clickDrag, config);
                    }
                };
                canvas.onmouseup = function(e){
                    paint = false;
                };

                canvas.onmouseleave = function(e){
                    paint = false;
                };


                var clearButton = document.createElement('button');
                clearButton.innerHTML = 'clear';
                clearButton.onclick = function () {
                    clickX = Array();
                    clickY = Array();
                    clickDrag = Array();
                    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
                }
                
                data.cell.output_area.element.append(canvas);
                data.cell.output_area.element.append(clearButton);   
            }
    });

    var load_ipython_extension = function() {
        
    }   
    return {
        load_ipython_extension : load_ipython_extension
    }
});