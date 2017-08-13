$(function()
{
	init();
});

//init js vars

//canvas variables
var ctx;
var bg;
var canvas;
var WIDTH;
var HEIGHT;
var MAX_WIDTH = 1960;
var MAX_HEIGHT = 1080;
//timer variables
var interval_id;

//background object
var background;

//snow
var snowflakes = new Array();
var SNOW_COUNT = 100
var MAX_SNOW_COUNT = 150;
var TWO_PI = Math.PI*2;
var ANGLE = 0;
var WIND_MULTIPLIER = 1.5;

//mouse variables
var mouse_clicks = 0;
var mouse_down = false;
var mouseX;
var mouseY;

var TIME_INTERVAL = 30;

function init()
{
	initCanvas();
	initMouse();
	startTimer();
}

function randomFromInterval(from,to)
{
		if(from == to)
		{
			return to;
		}
    return Math.floor(Math.random()*(to-from+1)+from);
}

/*************************************************************************
*                      Canvas Initialize
*************************************************************************/
function initCanvas()
{
	canvas = document.createElement("canvas");
	background_canvas = document.createElement("canvas");
	canvas.id = "canvas";
	background_canvas.id = 'background_canvas';
	$('body').prepend(canvas);
	ctx = canvas.getContext('2d');
	// the window is resized.
	window.addEventListener('resize', resizeCanvas, false);
  // Draw canvas border for the first time.
  resizeCanvas();
}

function resizeCanvas()
{
	WIDTH = $("#canvas").parent().innerWidth();
	HEIGHT = $("#canvas").parent().innerHeight();
	canvas.width = WIDTH;
    canvas.height = HEIGHT;
	background_canvas.width = WIDTH;
	background_canvas.height = HEIGHT;
	//STAR_COUNT = 1;
	SNOW_COUNT = Math.round(MAX_SNOW_COUNT * (WIDTH * HEIGHT)/(MAX_WIDTH * MAX_HEIGHT)); //adjusting star density to be 100 stars per 1960 x 1080 resolution
	initSnowFlakes();
}


/*************************************************************************
*                      Timer Initialize                                  *
*************************************************************************/
function startTimer()
{
	interval_id = setInterval(mainloop, TIME_INTERVAL);
}

function stopTimer()
{
	clearInterval(interval_id);
}

function timeCounter()
{
	if(millisec >= 99)
		{
			millisec = 0;
			seconds++;
		}
		else
		{
			millisec++;
		}
}

function clear()
{
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

/*************************************************************************
*                      Timer Initialize                                  *
*************************************************************************/
function initSnowFlakes()
{
	for(var i = 0; i < SNOW_COUNT; i++)
	{
		snowflakes[i] = new circle();
		snowflakes[i].reset();
		snowflakes[i].s.randomy = false;
	}
}
function circle()
{
	this.s =
	{
		duration:8000,
		xdrift: 0,
		ydrift: 0,
		dx: 0,
		dy: 4,
		rmin:1,
		rmax:6,
		rt:1,
		xdef:0,
		ydef:0,
		horizon: 0,
		randomx:true,
		randomy: true,
		blink:true
	};

	this.reset = function() {
		this.x = (this.s.randomx) ? randomFromInterval(0,WIDTH) : this.s.xdef;
		this.y = (this.s.randomy) ? randomFromInterval(0,HEIGHT) : this.s.ydef;

		this.r = randomFromInterval(this.s.rmin, this.s.rmax);
		this.ratio = (this.r/this.s.rmax);
		this.dx = this.s.dx;
		this.cr = Math.floor(this.r * this.ratio);
		this.dy = Math.round(this.cr/2) + 1;
	}

	this.resetPosition = function()
	{
		this.x = randomFromInterval(0,WIDTH);
		this.y = 0;
	}

	this.draw = function() {
		if(this.y >= HEIGHT + this.r)
		{
			this.resetPosition();
		}

		ctx.moveTo(this.x, this.y);
		ctx.arc(this.x,this.y,this.r,0,TWO_PI,true);
		//g = ctx.createRadialGradient(this.x,this.y,0,this.x,this.y, this.cr);
		//g.addColorStop(0.0, 'rgba(255,255,255, 1)');
		//g.addColorStop(this.stop, 'rgba(77,101,181, 0.7)');
		//g.addColorStop(1.0, 'rgba(77,101,181,0)');
		//ctx.fillStyle = g;
	}

	this.move = function() {

		this.x += this.dx;
		this.y += this.dy;

	}

	this.getX = function() { return this.x; }
	this.getY = function() { return this.y; }
}
/*************************************************************************
*                      Lines                                              *
*************************************************************************/
function initMouse()
{
	$(document).click(function(e){
		/*
		if(!music_play)
		{
			audio.play();
			music_play = true;
		}
		*/
		mouse_down = true;
		mouseY = e.pageY;
		mouseX = e.pageX;
		if(mouse_clicks == 1)
		{


		}

	});

}

/*************************************************************************
*                      Game Loop                                         *
*************************************************************************/
function mainloop()
{
	clear();
	//draw stars
	ctx.fillStyle = "rgba(255,255,255, 0.6)";
	ctx.beginPath();
	for(i=0; i < SNOW_COUNT;i++)
	{
		snowflakes[i].draw();
		snowflakes[i].move();
	}
	ctx.fill();

	windMovement();

}


/******************************************************
 *              Wind Movement                         *
 *****************************************************/

	var angle = 0;
	function windMovement()
	{
		angle += 0.01;
		for(var i = 0; i < SNOW_COUNT; i++)
		{
			var snow = snowflakes[i];

			snow.dx = Math.sin(angle) * WIND_MULTIPLIER;

			//Sending flakes back from the top when it exits
			//Lets make it a bit more organic and let flakes enter from the left and right also.
			if(snow.x > WIDTH+5 || snow.x < -5 || snow.y > HEIGHT)
			{
				if(snow.y > HEIGHT)
				{
					snowflakes[i].resetPosition();
				}
				else
				{
					//If the flake is exitting from the right
					if(Math.sin(angle) > 0)
					{
						//Enter from the left
						snowflakes[i].x = -5;
					}
					else
					{
						snowflakes[i].x = WIDTH + 5;
					}
				}
			}
		}
	}
