/*
var CanvasDemo = function() {
	var YD = YAHOO.util.Dom;
	var YE = YAHOO.util.Event;
	var canvas1;
	var img = [];
	return {
		init: function() {
			canvas1 = new Canvas.Element();
			canvas1.init('canvid1',  { width: 589, height: 589});			
			img[img.length] = new Canvas.Img('img1', {});
			img[img.length] = new Canvas.Img('img2', {});
			img[img.length] = new Canvas.Img('img3', {});
			//img[img.length] = new Canvas.Img('bg', {});
			img[img.length] = new Canvas.Img('img4', {});
			img[img.length] = new Canvas.Img('img5', {});
		
			
			
			
			
			
			// @param array of images ToDo: individual images
			
			canvas1.addImage(img[0]);
			canvas1.addImage(img[1]);
			canvas1.addImage(img[2]);
			//canvas1.setCanvasBackground(img[3]);
			canvas1.addImage(img[4]);
			
		
			
			
			
			
			this.initEvents();
		},
		initEvents: function() {
			YE.on('togglebg','click', this.toggleBg, this, true);
			YE.on('showcorners','click', this.showCorners, this, true);
			YE.on('togglenone','click', this.toggleNone, this, true);
			YE.on('toggleborders','click', this.toggleBorders, this, true);
			YE.on('togglepolaroid','click', this.togglePolaroid, this, true);
			YE.on('pngbutton','click', function() { this.convertTo('png') }, this, true);
			YE.on('jpegbutton','click', function() { this.convertTo('jpeg') }, this, true);
		},
		switchBg: function() {
			canvas1.fillBackground = (canvas1.fillBackground) ? false : true;							
			canvas1.renderAll();
		},
		
		//! insert these functions to the library. No access to _aImages should be done from here
		showCorners: function() {
			this.cornersvisible = (this.cornersvisible) ? false : true;
			for (var i = 0, l = canvas1._aImages.length; i < l; i += 1) {
				canvas1._aImages[i].setCornersVisibility(this.cornersvisible);
			}
			canvas1.renderAll();
		},
		toggleNone: function() {
			for (var i = 0, l = canvas1._aImages.length; i < l; i += 1) {
				canvas1._aImages[i].setBorderVisibility(false);
			}
			canvas1.renderAll();
		},
		toggleBorders: function() {
			for (var i = 0, l = canvas1._aImages.length; i < l; i += 1) {
				canvas1._aImages[i].setBorderVisibility(true);
			}
			canvas1.renderAll();
		},
		togglePolaroid: function() {
			for (var i = 0, l = canvas1._aImages.length; i < l; i += 1) {
				canvas1._aImages[i].setPolaroidVisibility(true);
			}
			canvas1.renderAll();
		},
		convertTo: function(format) {
			var imgData = canvas1.canvasTo(format);
			window.open(imgData, "_blank");
		},
		whatever: function(e, o) {
			// console.log(e);
			// console.log(o);
		}
	}
}();

YAHOO.util.Event.on(window, 'load', CanvasDemo.init, CanvasDemo, true);
*/
var winWidth = 0;
var winHeight = 0;

function findDimensions() //函数：获取尺寸
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
}

function resizeCanvas(){
	findDimensions();
	//console.log($("#app").attr("style"));
	$("#app").attr("style","height: "+winHeight+"px");
	//console.log(winHeight);
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
	//varible for img id
	var imgcount = 0;

	resizeCanvas();
	YUI().use('dd-delegate', 'dd-constrain','event',function(Y) {
	    
		// --------------drag and drop functions here---------------------
	    var del = new Y.DD.Delegate({
	        container: '#canvas',
	        nodes: '.yui3-resize-wrapper'
	    });
	    del.dd.plug(Y.Plugin.DDConstrained, {
        	constrain2node: '#canvas'
    	});
    	//----------------------------------------------------------------

    	//event listeners,handle add Image function when image is clicked-

    	var clickableimg = Y.all(".thumbnail");

    	clickableimg.on("click",function(e){
    		var src = e.target._node.src;
    		if (!src){
    			src = $(e.target._node).children().attr("src");
    		}
    		$("#canvas").append("<img class='canvasimg' id='img"+imgcount+"' src='"+src+"'/>");
    		var imgid = "#img"+imgcount;
    		addResizeEvent(imgid);
    		imgcount++;
    	});

    	var jpegbutton = Y.one("#jpegbutton");

    	jpegbutton.on("click",function(e){
    		console.log("i am here");
        // html2canvas(document.querySelector("#app"), {canvas: canvas}).then(function(canvas) {
        //     console.log('Drew on the existing canvas');
        // });
        html2canvas($("#canvascontainer"),{
        	onrendered: function(canvas) {
        		var imageurl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");   
                window.location.href=imageurl; // it will save locally  
        		console.log(imageurl);
        	}
        })
    	});


	});



	
});
