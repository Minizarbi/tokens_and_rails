window.onload = function() {
	var tar = document.getElementById('tokens_and_rails');
	tar.width = document.body.clientWidth;
	tar.height = document.body.clientHeight;
	var context = tar.getContext('2d');
	var myWorld = new World(
		new Force(- Math.PI / 2, 10),
		new Line(
			new Position(60, 60), new Position(60, 260)
		)
	);
	myWorld.path.next = new Line(
		new Position(60, 260), new Position(160, 360)
	);
	myWorld.tokens = [new Token(50, myWorld.path, 0, 0)];

	printPaths(myWorld, context);
	printTokens(myWorld, context);

	/*
	setInterval(function() {
		myWorld.tokens[0].progression += 0.01;
		if (myWorld.tokens[0].progression >= 1) {
			myWorld.tokens[0].path = myWorld.tokens[0].path.next;
			myWorld.tokens[0].progression -= 1;
		}
		printTokens(myWorld, context);
	}, 1000 / 24);
	*/
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

function position(token) {
	if (token.path instanceof Line) {
		return new Position(
			token.path.start.x +
				(token.path.end.x - token.path.start.x) * token.progression, 
			token.path.start.y +
				(token.path.end.y - token.path.start.y) * token.progression);
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
