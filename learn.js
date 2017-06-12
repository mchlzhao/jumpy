var Architect = synaptic.Architect;
var Network = synaptic.Network;

var FPS = 25;

var GENERATION_SIZE = 20;
var SELECT_SIZE = 3;

var DUCK_THRESHOLD = 0.45;
var JUMP_THRESHOLD = 0.55;

var gen = [];
var genNext = [];
var best = [];
var indNum = 0;
var genNum = 0;

for (var i = 0; i < GENERATION_SIZE; i++) {
	gen.push(new Architect.Perceptron(4, 5, 5, 1));
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
	var z = getInputs();
	var networkOutput = gen[indNum].activate([z.speed, z.next, z.size, z.height]);
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

function pickRandGenome() {
	var sum = 0;
	for (var i = 0; i < GENERATION_SIZE; i++) {
		sum += best[i][1] - 35;
	}
	var r = randBetween(0, sum);
	var x = 0;
	for (var i = 0; i < GENERATION_SIZE; i++) {
		x += best[i][1] - 35;
		if (x > r) {
			return i;
		}
	}
	console.log("shouldn't happen");
	return GENERATION_SIZE - 1;
}

function nextGen() {
	for (var i = 0; i < GENERATION_SIZE; i++) {
		var a = pickRandGenome();
		var b = pickRandGenome();
		var mutProb = 20/((best[a][1] + best[b][1])/2 + 0.12);
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
	var p = randBetween(0, a[x].length+1);
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
