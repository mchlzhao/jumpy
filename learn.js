var Architect = synaptic.Architect;
var Network = synaptic.Network;

var FPS = 25;

var GENERATION_SIZE = 12;
var SELECT_SIZE = 4;

var DUCK_THRESHOLD = 0.45;
var JUMP_THRESHOLD = 0.55;

var MUTATION_FREQ = 0.1;

var gen = [];
var best = [];
var indNum = 0;
var genNum = 0;

for (var i = 0; i < GENERATION_SIZE; i++) {
	gen.push(new Architect.Perceptron(3, 4, 4, 1));
	gen[i] = mutate(gen[i], 1);
}

for (var i = 0; i < GENERATION_SIZE; i++) {
	best.push([i, 0]);
}

function randBetween(a, b) {
	return Math.floor(Math.random() * (b-a)) + a;
}

function makeMove() {
	var inputs = getInputs();
	var networkOutput = gen[indNum].activate([inputs.speed, inputs.next, inputs.size]);
	document.getElementById("outputvar").innerHTML = networkOutput;
	if (networkOutput < DUCK_THRESHOLD) {
		keyUpJump();
		keyDownDuck();
	} else if (networkOutput > JUMP_THRESHOLD) {
		keyUpDuck();
		keyDownJump();
	} else {
		keyUpJump();
		keyUpDuck();
	}
}

function testGen() {
	var hasRestarted = false;
	if (runner.activated && (!runner.paused || runner.crashed)) {
		var states = getStates();
		if (states.playing) {
			makeMove();
			best[indNum][1] = states.dist;
		} else {
			console.log("individual " + indNum + " travelled " + best[indNum][1]);
			indNum++;
			if (indNum >= GENERATION_SIZE) {
				nextGen();
				indNum = 0;
			}
			restart();
			hasRestarted = true;
			document.getElementById("indvar").innerHTML = "ind = " + indNum;
		}
	}
	if (hasRestarted) {
		setTimeout(testGen, 1000);
	} else {
		setTimeout(testGen, 1000/FPS);
	}
}

function nextGen() {
	best.sort(function (a, b) {
		return b[1] - a[1];
	});
	// console.log("best " + best);
	for (var i = 0; i < GENERATION_SIZE; i++) {
		var a = randBetween(0, SELECT_SIZE);
		var b = randBetween(0, SELECT_SIZE);
		while (a != b) {
			var b = randBetween(0, SELECT_SIZE);
		}
		gen[i] = crossOver(gen[best[a][0]], gen[best[b][0]]);
		gen[i] = mutate(gen[i], 30/(best[a][1] + best[b][1]) + 0.05);
	}
	best = [];
	for (var i = 0; i < GENERATION_SIZE; i++) {
		best.push([i, 0]);
	}
	genNum++;
	document.getElementById("genvar").innerHTML = "gen = " + genNum;
}

function crossOver(a, b) {
	a = a.toJSON();
	b = b.toJSON();
	var c = b;
	var p = randBetween(1, a.connections.length);
	c.connections = a.connections.slice(0, p).concat(b.connections.slice(p, b.connections.elength));
	return Network.fromJSON(c);
}

function mutate(a, f) {
	a = a.toJSON();
	for (var i = 0; i < a.connections.length; i++) {
		if (Math.random() < f) {
			a.connections[i].weight = 2*Math.random() - 1;
		}
	}
	return Network.fromJSON(a);
}

function onDocumentLoad() {
	setTimeout(testGen, 100);
}
document.addEventListener("DOMContentLoaded", onDocumentLoad);
