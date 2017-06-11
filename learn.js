var Architect = synaptic.Architect;
var Network = synaptic.Network;

var FPS = 25;

var GENERATION_SIZE = 16;
var SELECT_SIZE = 6;

var DUCK_THRESHOLD = 0.45;
var JUMP_THRESHOLD = 0.55;

var gen = [];
var genNext = [];
var best = [];
var indNum = 0;
var genNum = 0;

for (var i = 0; i < GENERATION_SIZE; i++) {
	gen.push(new Architect.Perceptron(3, 4, 4, 1));
	gen[i] = mutate(gen[i], 1, "connections", "weight");
	gen[i] = mutate(gen[i], 1, "neurons", "bias");
	genNext.push(gen[i]);
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
			console.log(best[indNum][1]);
			indNum++;
			if (indNum >= GENERATION_SIZE) {
				nextGen();
				indNum = 0;
			}
			restart();
			hasRestarted = true;
			document.getElementById("indvar").innerHTML = "ind = " + indNum;
		}
	} else if (!runner.activated) {
		keyDownJump();
		hasRestarted = true;
	}
	if (hasRestarted) {
		setTimeout(testGen, 1100);
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
		while (a == b) {
			var b = randBetween(0, SELECT_SIZE);
		}
		var mutProb = 20/(best[a][1] + best[b][1]) + 0.15;
		console.log("crossing over between " + best[a][0] + " and " + best[b][0]);
		console.log("mutProb = " + mutProb);
		genNext[i] = crossOver(gen[best[a][0]], gen[best[b][0]], "neurons", "bias");
		genNext[i] = mutate(genNext[i], mutProb, "connections", "weight");
		genNext[i] = mutate(genNext[i], mutProb, "neurons", "bias");
	}
	for (var i = 0; i < GENERATION_SIZE; i++) {
		best[i] = [i, 0];
	}
	genNum++;
	document.getElementById("genvar").innerHTML = "gen = " + genNum;
	gen = genNext;
}

function crossOver(a, b, x, y) {
	a = a.toJSON();
	b = b.toJSON();
	if (Math.random() < 0.5) {
		var temp = a;
		a = b;
		b = temp;
	}
	var c = b;
	var p = randBetween(1, a[x].length);
	c[x] = a[x].slice(0, p).concat(b[x].slice(p, b[x].length));
	return Network.fromJSON(c);
}

function mutate(a, f, x, y) {
	a = a.toJSON();
	for (var i = 0; i < a[x].length; i++) {
		if (Math.random() < f) {
			a[x][i][y] += Math.random()*f*2 - f;
		}
	}
	return Network.fromJSON(a);
}

function onDocumentLoad() {
	setTimeout(testGen, 1000);
}
document.addEventListener("DOMContentLoaded", onDocumentLoad);
