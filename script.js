function onLoad() {
	myWorld = new World(
		new Force(- Math.PI / 2, 10),
		new Line(
			new Position(10, 10), new Position(10, 90)
		)
	);
}

class World {
	constructor(force, path) {
		this.force = force;
		this.path = path;
	}
}

class Force {
	constructor(direction, value) {
		this.direction = direction;
		this.value = value;
	}
}

class Line {
	constructor(start, end) {
		this.start = start;
		this.end = end;
	}
}

class Circle {
	constructor(center, radius, start, end) {
		this.center = center;
		this.radius = radius;
		this.start = start;
		this.end = end;
	}
}

class Position {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Token {
	constructor(path, progression, friction) {
		this.path = path;
		this.progression = progression;
		this.velocity = 0;
		this.friction = friction;
	}
}

function printPaths(world) {

}
