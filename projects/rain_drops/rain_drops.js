$(function()
{
	init();
	run();
});

function init()
{
	initCanvas();
}

var canvas;
/*************************************************************************
*                      Canvas Initialize
*************************************************************************/
function initCanvas()
{
	canvas = document.createElement("img");
	canvas.id = "canvas";

	$('body').prepend(canvas);
	// the window is resized.
	window.addEventListener('resize', resizeCanvas, false);
  // Draw canvas border for the first time.
  resizeCanvas();
}

function resizeCanvas()
{
	WIDTH = $("#canvas").parent().outerWidth();
	HEIGHT = $("#canvas").parent().outerHeight();
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
}


function run()
{
  var image = document.getElementById('canvas');
  image.onload = function() {
			var engine = new RainyDay({
								     image: this
                    });
								    engine.rain([ [1, 2, 500] ]);
								    engine.rain([ [1, 2, 0.88], [5, 5, 0.9], [6, 2, 1] ], 150);
                };
                image.crossOrigin = 'anonymous';
                image.src = 'halloween.jpg';
}