/*
Since the origin in top left, we invert the trigonometric rotation
*/
window.onload = function() {
	var canvas;

	canvas = document.getElementById('tokens');
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
	var tcontext = canvas.getContext('2d');
	canvas = document.getElementById('rails');
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
	var rcontext = canvas.getContext('2d');

	var myWorld = new World(
		new Force(Math.PI / 2, 1000), // Force down, so positive
		new Line(
			new Position(60, 60), new Position(60, 260)
		)
	);
	myWorld.path.next = new Line(
		new Position(60, 260), new Position(160, 360)
	);
	myWorld.path.next.previous = myWorld.path;
	myWorld.tokens = [new Token(50, myWorld.path, 0, 0.1)];

	printPaths(myWorld, rcontext); // We just have to do it once
	printTokens(myWorld, tcontext);	

	setInterval(function() {
		updateVelocity(myWorld.tokens[0], myWorld, 1 / 60);
		updatePosition(myWorld.tokens[0], 1 / 60);
		printTokens(myWorld, tcontext);
	}, 1000 / 60);

	document.getElementById('tokens').onclick = function() {
		updateVelocity(myWorld.tokens[0], myWorld, 1);
		updatePosition(myWorld.tokens[0], 1);
		printTokens(myWorld, tcontext);
		console.log(myWorld.tokens[0].velocity);
	}
};


function Force(direction, value) {
	this.direction = direction;
	this.value = value;
}

function Position(x, y) {
	this.x = x;
	this.y = y;
}

function hasNext(path) {
	return (typeof path.next != 'undefined');
}

function hasPrevious(path) {
	return (typeof path.previous != 'undefined');
}

function Line(start, end) {
	this.start = start;
	this.end = end;
	var distx = end.x - start.x,
		disty = end.y - start.y;
	this.length = Math.sqrt(distx * distx + disty * disty);
}

function Circle(center, radius, start, end) {
	this.center = center;
	this.radius = radius;
	this.start = start;
	this.end = end;
}

function Token(size, path, progression, friction) {
	this.size = size;
	this.path = path;
	this.progression = progression;
	this.velocity = 0;
	this.friction = friction;
}

function updateVelocity(token, world, time) {
	var pathDir = Math.atan(
		(token.path.end.y - token.path.start.y) /
		(token.path.end.x - token.path.start.x)
	);
	token.velocity += time * world.force.value * Math.cos(world.force.direction - pathDir);
	token.velocity *= (1 - time * token.friction);
}

function updatePosition(token, time) {
	var finished = true;
	token.progression += token.velocity * time;
	while (true) {
		if (token.progression > token.path.length) {
			if (hasNext(token.path)) {
				token.progression -= token.path.length;
				token.path = token.path.next;
			} else {
				token.velocity = - token.velocity;
				token.progression -= token.progression - token.path.length;
			}
		} else if (token.progression < 0) {
			if (hasPrevious(token.path)) {
				token.progression += token.path.previous.length;
				token.path = token.path.previous;
			} else {
				token.velocity = - token.velocity;
				token.progression = - token.progression;
			}
		}
		break;
	}
}

function position(token) {
	if (token.path instanceof Line) {
		return new Position(
			token.path.start.x +
				(token.path.end.x - token.path.start.x) * token.progression / token.path.length, 
			token.path.start.y +
				(token.path.end.y - token.path.start.y) * token.progression / token.path.length);
	} else {
		return 0;
	}
}

function World(force, path) {
	this.force = force;
	this.path = path;
}

function printPaths(world, context) {
	var p;
	for (p = world.path; hasNext(p); p = p.next) {
		if (p instanceof Line) {
			printLine(p, context);
		}
	}
	if (p instanceof Line) {
		printLine(p, context);
	}
}

function printLine(line, context) {
	context.moveTo(line.start.x, line.start.y);
	context.lineTo(line.end.x, line.end.y);
	context.stroke();
	console.log('Line : ' + line.length);
}

function printTokens(world, context) {
	context.clearRect(0, 0, 1000, 1000);
	for (var i = 0; i < world.tokens.length; i++) {
		printToken(world.tokens[i], context);
	}
}

function printToken(token, context) {
	var p = position(token);
	context.beginPath();
	context.arc(p.x, p.y, token.size / 2, 0, 2 * Math.PI);
	context.stroke();
}
