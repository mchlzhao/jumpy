var Architect = synaptic.Architect;
var Network = synaptic.Network;

var FPS = 25;

var GENERATION_SIZE = 16;
var SELECT_SIZE = 4;

var DUCK_THRESHOLD = 0.49;
var JUMP_THRESHOLD = 0.51;

var gen = [];

for (var i = 0; i < GENERATION_SIZE; i++) {
	gen.push(new Architect.Perceptron(3, 4, 4, 1));
	console.log(gen[i].toJSON());
}

function makeMove() {
	var inputs = getInputs();
	var networkOutput = gen[0].activate([inputs.speed, inputs.next, inputs.size]);
	console.log(networkOutput);
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

function loop() {
	var states = getStates();
	if (states.playing) {
		makeMove();
	}
	setTimeout(loop, 1000/FPS);
}

function onDocumentLoad() {
	setTimeout(loop, 100);
}
document.addEventListener("DOMContentLoaded", onDocumentLoad);
