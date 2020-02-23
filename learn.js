var Architect = synaptic.Architect;
var Network = synaptic.Network;

var FPS = 25;

var GENERATION_SIZE = 16;

var DUCK_THRESHOLD = 0.4;
var JUMP_THRESHOLD = 0.6;

var gen = [];
var genNext = [];
var best = [];
var indNum = 0;
var genNum = 0;

for (var i = 0; i < GENERATION_SIZE; i++) {
	gen.push(new Architect.Perceptron(3, 4, 1));
	gen[i] = gen[i].toJSON();
	gen[i] = mutate(gen[i], 1, "connections", "weight", 0.8);
	gen[i] = mutate(gen[i], 1, "neurons", "bias", 0.8);
	gen[i] = toRELU(gen[i]);
	gen[i] = Network.fromJSON(gen[i]);
	genNext.push(0);
	best.push([i, 0]);
}

function toRELU(a) {
	for (var i = 0; i < a.neurons.length; i++) {
		if (a.neurons[i].layer != "input" && a.neurons[i].layer != "output") {
			a.neurons[i].squash = "RELU";
		}
	}
	return a;
}

function randBetween(a, b) {
	return Math.floor(Math.random() * (b-a)) + a;
}

function makeMove() {
	var z = getInputs();
	var networkOutput = gen[indNum].activate([z.speed, z.next, z.size])[0];
	document.getElementById("outputvar").innerHTML = "out = " + networkOutput.toFixed(4);
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
				genNum++;
				document.getElementById("genvar").innerHTML = "gen = " + genNum;
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
		sum += best[i][1]-35;
	}
	var r = randBetween(0, sum);
	var x = 0;
	for (var i = 0; i < GENERATION_SIZE; i++) {
		x += best[i][1]-35;
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
		var mutProb = 24/(Math.max(best[a][1], best[b][1])-16)+0.05;
		console.log("crossing over between " + best[a][0] + " and " + best[b][0]);
		console.log("mutProb = " + mutProb);
		genNext[i] = gen[best[a][0]].toJSON();
		genNext[i]["neurons"] = crossOver(gen[best[a][0]].toJSON(), gen[best[b][0]].toJSON(), "neurons", "bias");
		genNext[i]["connections"] = crossOver(gen[best[a][0]].toJSON(), gen[best[b][0]].toJSON(), "connections", "weight");
		genNext[i] = mutate(genNext[i], mutProb, "connections", "weight", 0.2);
		genNext[i] = mutate(genNext[i], mutProb, "neurons", "bias", 0.2);
	}
	for (var i = 0; i < GENERATION_SIZE; i++) {
		gen[i] = Network.fromJSON(genNext[i]);
		best[i] = [i, 0];
	}
}

function crossOver(a, b, x, y) {
	if (Math.random() < 0.5) {
		var temp = a;
		a = b;
		b = temp;
	}
	var c = b;
	var p = randBetween(0, a[x].length+1);
	c[x] = a[x].slice(0, p).concat(b[x].slice(p, b[x].length));
	return c[x];
}

function mutate(a, f, x, y, d) {
	for (var i = 0; i < a[x].length; i++) {
		if (Math.random() < f) {
			a[x][i][y] += Math.random()*2*d - d;
		}
	}
	return a;
}

function onDocumentLoad() {
	setTimeout(testGen, 1000);
}

document.addEventListener("DOMContentLoaded", onDocumentLoad);
