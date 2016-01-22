var SnowMachine = function () {
	this.canvas = document.getElementById("canvas");
	this.ctx = this.canvas.getContext("2d");
	this.mp = 25;
	this.angle = 0;
	window.addEventListener('resize', this.resizeCanvas, false);	
	this.resizeCanvas();
};

SnowMachine.prototype.resizeCanvas = function () {
	var canvas = this.canvas;
	this.W = window.innerWidth;
	this.H = window.innerHeight;
	canvas.width = this.W;
	canvas.height = this.H;
};

SnowMachine.prototype.initCanvas = function () {
	this.particles = [];
	for(var i = 0; i < this.mp; i++) {
		this.particles.push({
			x: Math.random() * this.W,
			y: Math.random() * this.H,
			r: Math.random() * 4 + 1,
			d: Math.random() * this.mp
		});
	}
};

SnowMachine.prototype.draw = function () {
	var ctx = this.ctx;
	var W = this.W;
	var H = this.H;
	ctx.clearRect(0, 0, W, H);
	ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
	ctx.beginPath();
	for(var i = 0; i < this.mp; i++) {
		var p = this.particles[i];
		ctx.moveTo(p.x, p.y);
		ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
	}
	ctx.fill();
	this.update();
};

SnowMachine.prototype.update = function () {
	var particles = this.particles
	var W = this.W;
	var H = this.H;
	var mp = this.mp;
	this.angle += 0.01;

	for (var i = 0; i < mp; i++) {
		var p = particles[i];
		p.y += Math.cos(this.angle+p.d) + 1 + p.r/2;
		p.x += Math.sin(this.angle) * 2;
		
		//Sending flakes back from the top when it exits
		//Lets make it a bit more organic and let flakes enter from the left and right also.
		if(p.x > W+5 || p.x < -5 || p.y > H) {
			if(i%3 > 0) {
				//66.67% of the flakes 
				particles[i] = {x: Math.random()*W, y: -10, r: p.r, d: p.d};
			} else {
				//If the flake is exitting from the right
				if(Math.sin(this.angle) > 0) {
					//Enter from the left
					particles[i] = {x: -5, y: Math.random()*H, r: p.r, d: p.d};
				} else {
					//Enter from the right
					particles[i] = {x: W+5, y: Math.random()*H, r: p.r, d: p.d};
				}
			}
		}
	}
};

SnowMachine.prototype.start = function () {
	this.initCanvas();
	this.timer = setInterval(this.draw.bind(this), 33);
};

SnowMachine.prototype.stop = function () {
	if (this.timer) {
		window.clearInterval(this.timer);
		this.timer = null;
	}
};
