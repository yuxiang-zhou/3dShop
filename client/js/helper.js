





function resizeCanvas() //函数：获取尺寸
{
    //获取窗口宽度
    if (window.innerWidth)
       winWidth = window.innerWidth;
    else if ((document.body) && (document.body.clientWidth))
       winWidth = document.body.clientWidth;
    //获取窗口高度
    if (window.innerHeight)
       winHeight = window.innerHeight;
    else if ((document.body) && (document.body.clientHeight))
       winHeight = document.body.clientHeight;

    //通过深入Document内部对body进行检测，获取窗口大小
    if (document.documentElement  && document.documentElement.clientHeight &&
                                      document.documentElement.clientWidth)
    {
     winHeight = document.documentElement.clientHeight;
     winWidth = document.documentElement.clientWidth;
    }

    //结果输出至两个文本框
    // console.log(winHeight);
    // console.log(winWidth);
    $("#app").attr("style","height: "+winHeight+"px");
    var canvasHeight = winHeight * 5 / 12;
    var canvasWidth = winWidth * 5 / 12;
    var canvas = document.getElementById("canvas");
    canvas.height = canvasHeight;
    canvas.width = canvasWidth;

}


function addResizeEvent(selector){
	YUI().use('resize',function(Y){
		//handles resize function here
		var resize = new Y.Resize({
    		node: selector
    	});

    	resize.plug(Y.Plugin.ResizeConstrained, {
	        preserveRatio: true
    	});

    	resize.on("resize:resize",function (e) {
    		
    	})
	});		
}






               //调用函数，获取数值
window.onresize=resizeCanvas;

$(document).ready(function(){
    resizeCanvas();
    //varible for img id
    var imgcount = 0;
    var winWidth = 0;
    var winHeight = 0;

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    var canvasOffset = $("#canvas").offset();
    var offsetX = canvasOffset.left;
    var offsetY = canvasOffset.top;

    var startX;
    var startY;
    var isDown = false;


    var pi2 = Math.PI * 2;
    var resizerRadius = 5;
    var rr = resizerRadius * resizerRadius;
    var draggingResizer = {
        x: 0,
        y: 0
    };
    var imageX = 50;
    var imageY = 50;
    var imageWidth, imageHeight, imageRight, imageBottom;
    var draggingImage = false;
    var startX;
    var startY;
    var imgArray = new Array();

    //add event listners to thumbnails
    var thumbnail = document.getElementsByClassName("thumbnail");

    var myFunction = function() {
        addImage($(this).children()[0].src);
    };

    for(var i=0;i<thumbnail.length;i++){
        thumbnail[i].addEventListener('click', myFunction, false);
    }


    function addImage(src){
        console.log(src);
        var img = new Image();
        img.src = src;
        img.onload = function () {
            imageWidth = img.width;
            imageHeight = img.height;
            imageRight = imageX + imageWidth;
            imageBottom = imageY + imageHeight
            draw(true, false);
        }
        imgArray.push(img);  
    }


    //all kinds of helper functions
    function draw(withAnchors, withBorders) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (x in imgArray){
            // clear the canvas
            var img = imgArray[x];

            // draw the image
            ctx.drawImage(img, 0, 0, img.width, img.height, imageX, imageY, imageWidth, imageHeight);

            // optionally draw the draggable anchors
            if (withAnchors) {
                drawDragAnchor(imageX, imageY);
                drawDragAnchor(imageRight, imageY);
                drawDragAnchor(imageRight, imageBottom);
                drawDragAnchor(imageX, imageBottom);
            }

            // optionally draw the connecting anchor lines
            if (withBorders) {
                ctx.beginPath();
                ctx.moveTo(imageX, imageY);
                ctx.lineTo(imageRight, imageY);
                ctx.lineTo(imageRight, imageBottom);
                ctx.lineTo(imageX, imageBottom);
                ctx.closePath();
                ctx.stroke();
            }
        }

    }

    function drawDragAnchor(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, resizerRadius, 0, pi2, false);
        ctx.closePath();
        ctx.fill();
    }

    function anchorHitTest(x, y) {

        var dx, dy;

        // top-left
        dx = x - imageX;
        dy = y - imageY;
        if (dx * dx + dy * dy <= rr) {
            return (0);
        }
        // top-right
        dx = x - imageRight;
        dy = y - imageY;
        if (dx * dx + dy * dy <= rr) {
            return (1);
        }
        // bottom-right
        dx = x - imageRight;
        dy = y - imageBottom;
        if (dx * dx + dy * dy <= rr) {
            return (2);
        }
        // bottom-left
        dx = x - imageX;
        dy = y - imageBottom;
        if (dx * dx + dy * dy <= rr) {
            return (3);
        }
        return (-1);

    }


    function hitImage(x, y) {
        return (x > imageX && x < imageX + imageWidth && y > imageY && y < imageY + imageHeight);
    }


    function handleMouseDown(e) {
        startX = parseInt(e.clientX - offsetX);
        startY = parseInt(e.clientY - offsetY);
        draggingResizer = anchorHitTest(startX, startY);
        draggingImage = draggingResizer < 0 && hitImage(startX, startY);
    }

    function handleMouseUp(e) {
        draggingResizer = -1;
        draggingImage = false;
        draw(true, false);
    }

    function handleMouseOut(e) {
        handleMouseUp(e);
    }

    function handleMouseMove(e) {

        if (draggingResizer > -1) {

            mouseX = parseInt(e.clientX - offsetX);
            mouseY = parseInt(e.clientY - offsetY);

            // resize the image
            switch (draggingResizer) {
                case 0:
                    //top-left
                    imageX = mouseX;
                    imageWidth = imageRight - mouseX;
                    imageY = mouseY;
                    imageHeight = imageBottom - mouseY;
                    break;
                case 1:
                    //top-right
                    imageY = mouseY;
                    imageWidth = mouseX - imageX;
                    imageHeight = imageBottom - mouseY;
                    break;
                case 2:
                    //bottom-right
                    imageWidth = mouseX - imageX;
                    imageHeight = mouseY - imageY;
                    break;
                case 3:
                    //bottom-left
                    imageX = mouseX;
                    imageWidth = imageRight - mouseX;
                    imageHeight = mouseY - imageY;
                    break;
            }

            if(imageWidth<25){imageWidth=25;}
            if(imageHeight<25){imageHeight=25;}

            // set the image right and bottom
            imageRight = imageX + imageWidth;
            imageBottom = imageY + imageHeight;

            // redraw the image with resizing anchors
            draw(true, true);

        } else if (draggingImage) {

            imageClick = false;

            mouseX = parseInt(e.clientX - offsetX);
            mouseY = parseInt(e.clientY - offsetY);

            // move the image by the amount of the latest drag
            var dx = mouseX - startX;
            var dy = mouseY - startY;
            imageX += dx;
            imageY += dy;
            imageRight += dx;
            imageBottom += dy;
            // reset the startXY for next time
            startX = mouseX;
            startY = mouseY;

            // redraw the image with border
            draw(false, true);

        }


    }


    $("#canvas").mousedown(function (e) {
        handleMouseDown(e);
    });
    $("#canvas").mousemove(function (e) {
        handleMouseMove(e);
    });
    $("#canvas").mouseup(function (e) {
        handleMouseUp(e);
    });
    $("#canvas").mouseout(function (e) {
        handleMouseOut(e);
    });


	
});
