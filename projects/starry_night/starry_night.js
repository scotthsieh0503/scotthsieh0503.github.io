$(function()
{
	init();
});

//init js vars

//canvas variables
var ctx;
var canvas;
var WIDTH;
var HEIGHT;
var MAX_WIDTH = 1960;
var MAX_HEIGHT = 1080;
//timer variables
var interval_id;

//background object
var background;

//stars
var stars = new Array();
var STAR_COUNT = 100;

//mouse variables
var mouse_clicks = 0;
var mouse_down = false;
var mouseX;
var mouseY;

//lines
var lines = new Array();
var LINE_COUNT = 0; //track how many lines are currently on screen
var temp_lines;
var connect_stars = new Array();

//shooting stars
var shooting_stars = new Array();
var SHOOTING_STAR_COUNT = 1;


//audio play
var music_play = false;
var audio;

var millisec = 0;
var seconds = 0;

var spawn_time = 1000;

function init()
{
	initCanvas();
	initBackground();
	initMouse();
	initLines();
	initShootingStars();
	startTimer();
	initAudio();
}

function randomFromInterval(from,to)
{
    return Math.floor(Math.random()*(to-from+1)+from);
}

/*************************************************************************
*                      Canvas Initialize
*************************************************************************/
function initCanvas()
{
	canvas = document.createElement("canvas")
	canvas.id = "canvas";
	$('body').prepend(canvas);

	ctx = canvas.getContext('2d');

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
	//STAR_COUNT = 1;
	STAR_COUNT = Math.round(150 * (WIDTH * HEIGHT)/(MAX_WIDTH * MAX_HEIGHT)); //adjusting star density to be 100 stars per 1960 x 1080 resolution
	initStars();
	initLines();
}

/*************************************************************************
*                      Background Initialize                             *
*************************************************************************/
function initBackground()
{
	background = new backgroundObj(canvas);
}

function backgroundObj(canvas)
{
	this.canvas = canvas;
	this.gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height)
	this.draw = function draw()
	{
		ctx.beginPath();
		ctx.rect(0, 0, this.canvas.width, this.canvas.height);
		ctx.fillStyle = this.gradient;
		ctx.closePath();
		ctx.fill();
	}
}
/*************************************************************************
*                      Audio Initialized                                 *
*************************************************************************/
function initAudio()
{
	var track_arr = new Array();
	track_arr[0] = "1.mp3";
	var track_index = 0;
	audio = new Audio();
	audio.id = "audio_player";
	audio.volume = 0.2;
	audio.src = track_arr[track_index];
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )
	{
		//audio.controls = "controls";
		audio.addEventListener('canplaythrough',function(){
        track.removeEventListener('canplaythrough');
        audioLoaded = true;
    },false);
		muisc_play = false;
	}
	$("#canvas").append(audio);
}


/*************************************************************************
*                      Timer Initialize                                  *
*************************************************************************/
function startTimer()
{
	interval_id = setInterval(mainloop, 25);
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
function initStars()
{
	for(var i = 0; i < STAR_COUNT; i++)
	{
		stars[i] = new star();
		stars[i].s.horizon = 150;
		stars[i].reset();
	}
}
function star()
{
	this.s =
	{	duration:8000,
		xmax:5, ymax:-2,
		rmax:10,
		rt:1,
		xdef:960,
		ydef:540,
		xdrift:0,
		ydrift: 0,
		horizon: 0,
		random:true,
		blink:true
	};

	this.reset = function() {
		this.x = (this.s.random ? Math.round(WIDTH*Math.random()) : this.s.xdef);
		this.y = (this.s.random) ? Math.round((HEIGHT-this.s.horizon)*Math.random()) : this.s.ydef;
		this.r = ((this.s.rmax-1)*Math.random()) + 1;
		this.dx = Math.round((Math.random()*this.s.xmax) * (Math.random() < .5 ? -1 : 1));
		this.dy = Math.round((Math.random()*this.s.ymax) * (Math.random() < .5 ? -1 : 1));
		this.half_life = (this.s.duration/50)*(this.r/this.s.rmax);
		this.rt = Math.random()*this.half_life;
		this.s.rt = Math.random()+1;
		this.stop = Math.random()*.2+.4;
		this.s.xdrift *= Math.random() * (Math.random() < .5 ? -1 : 1);
		this.s.ydrift *= Math.random() * (Math.random() < .5 ? -1 : 1);
	}

	this.fade = function() {
		this.rt += this.s.rt;
	}

	this.draw = function() {
		//controls whether or not if we are dimming or brighting the stars
		if(this.s.blink && (this.rt <= 0 || this.rt >= this.half_life))
		{
			this.s.rt = this.s.rt*-1;
		}
		//incase stars are stuck in a bad state we reset it
		else if(this.rt >= this.half_life)
		{
			this.reset()
		};
		var glow = 1-(this.rt/this.half_life); //controls transparency of the glow
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.r,0,Math.PI*2,true);
		ctx.closePath();
		var cr = this.r * glow;
		g = ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,(cr <= 0 ? 1 : cr));
		g.addColorStop(0.0, 'rgba(255,255,255,'+glow+')');
		g.addColorStop(this.stop, 'rgba(77,101,181,'+(glow*.6)+')');
		g.addColorStop(1.0, 'rgba(77,101,181,0)');
		ctx.fillStyle = g;
		ctx.fill();
	}

	this.move = function() {
		this.x += (this.rt/this.half_life)*this.dx;
		this.y += (this.rt/this.half_life)*this.dy;
		this.y += (this.rt/this.half_life)*this.dy;
		if(this.x > WIDTH || this.x < 0) this.dx *= -1;
		if(this.y > HEIGHT || this.y < 0) this.dy *= -1;
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
	
		if(!music_play)
		{
			audio.play();
			music_play = true;
		}
		
		mouse_down = true;
		mouseY = e.pageY;
		mouseX = e.pageX;
		if(mouse_clicks == 1)
		{


		}

	});

}

function initLines()
{
	lines = new Array();
	connect_stars = new Array();
	LINE_COUNT = 0;
	mouse_down = false;
	mouse_clicks = 0;
}

function line(x1, y1, x2 ,y2, width)
{
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.width = width;

	this.draw = function(){
		
	ctx.strokeStyle = "#EFEFEF";
	ctx.beginPath();
	ctx.lineWidth = this.width;
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2,y2);
	ctx.stroke();

	}

}

function connectStars(point_1, point_2)
{
	for(i = 0; i < LINE_COUNT; i++)
	{
		current_line = lines[i];
		if((current_line.x1 == point_1.x  && current_line.y1 ==  point_1.y && current_line.x2 == point_2.x  && current_line.y2 ==  point_2.y) ||
			(current_line.x1 == point_2.x  && current_line.y1 ==  point_2.y && current_line.x2 == point_1.x  && current_line.y2 ==  point_1.y)
		)
		{
			lines[i].disabled = !lines[i].disabled;
			return;
		}
	}

	lines[LINE_COUNT] = new line(point_1.x, point_1.y, point_2.x, point_2.y, 1);

	LINE_COUNT++;
}


/*************************************************************************
*                      Init Shooting Stars                               *
*************************************************************************/
function initShootingStars()
{
	for(i=0; i < SHOOTING_STAR_COUNT; i++)
	{
		shooting_stars[i] = new shootingStar();
		shooting_stars[i].reset();
	}
}

function shootingStar()
{
	this.s =
	{
		duration: 5000,
		xmax:2, ymax:5,
		strokeMax:3,
		rt:1,
		horizon: 100,
		random:true
	};


	this.reset = function() {
		this.x = randomFromInterval(0, WIDTH);
		this.y = randomFromInterval(0, 100);
		this.x2 = randomFromInterval(0, WIDTH);
		this.y2 = randomFromInterval(HEIGHT-this.s.horizon, HEIGHT);
		//width of the stroke
		this.r = ((this.s.strokeMax-1)*Math.random()) + 1;
		this.half_life = Math.round((this.s.duration/30)*(this.r/this.s.strokeMax));
		this.position = 0.0;
		this.star_drop = true;
	}


	this.fade = function() {
		if(this.position <= 1)
		{
			this.position += 0.05;
		}
		else
		{
			this.position = 0;
			this.star_drop = false;
		}
	}

	this.draw = function() {
		//if decay is greater than the half_life the star vanishes
		if(this.rt >= this.half_life)
		{
			this.reset()
		};

		var glow = 1-(this.rt/this.half_life); //controls transparency of the glow

		grd = ctx.createLinearGradient(this.x,this.y,this.x2,this.y2);
		grd.addColorStop(0.0, 'rgba(77,101,181,0)');
		grd.addColorStop(this.position, 'rgba(77,101,181,1)');
		grd.addColorStop(this.position, 'rgba(77,101,181,0)');
		ctx.strokeStyle = grd;

		ctx.beginPath();
		ctx.lineCap = 'butt';
		ctx.lineWidth = this.r;
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x2,this.y2);
		ctx.stroke();


	}

	//moving the star by changing the gradient of the star path
	this.move = function() {

	}

	this.getX = function() { return this.x; }
	this.getY = function() { return this.y; }




}




/*************************************************************************
*                      Game Loop                                         *
*************************************************************************/
function mainloop()
{
	clear();
	//draw back ground
	background.draw();

	//draw lines
	for(i=0; i < LINE_COUNT; i++)
	{
		if(!lines[i].disabled)
		{
			lines[i].draw();
		}

	}
	
	for(i=0; i < SHOOTING_STAR_COUNT; i++)
	{
		if(!shooting_stars[i].star_drop)
		{
			millisec++;
			if(millisec >= spawn_time)
			{
				shooting_stars[i].reset();
				spawn_time = randomFromInterval(900,1500);
				millisec = 0;
			}
		}
		else
		{
			shooting_stars[i].draw();
			shooting_stars[i].fade();
		}

		//shooting_stars[i].move();
	}

	//draw stars
	for(i=0; i < STAR_COUNT;i++)
	{
		stars[i].draw();
		stars[i].fade();

		//check if we click on a near by star and create a line if 2 stars are clicked
		if(mouse_down)
		{
			star_found = false;
			if((Math.abs(stars[i].x-mouseX)) <= 20 && (Math.abs(stars[i].y-mouseY) <= 20))
			{
				size = connect_stars.push(stars[i]);
				if(size > 1)
				{
					//first star
					start_point = connect_stars.shift();
					end_point = connect_stars[0];
					connectStars(start_point, end_point);
				}
				mouse_down = false;
			}
		}
	}
	//if we get to this point means the click was not on a star so we reset the connection
	if (mouse_down)
	{
		mouse_down = false;
		connect_stars = new Array();
	}
}

