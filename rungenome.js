var Architect = synaptic.Architect;
var Network = synaptic.Network;

var FPS = 25;

var DUCK_THRESHOLD = 0.4;
var JUMP_THRESHOLD = 0.6;

var gen = Network.fromJSON(JSON.parse('{"neurons":[{"trace":{"elegibility":{},"extended":{}},"state":0,"old":0,"activation":0.9286428571427069,"bias":0,"layer":"input","squash":"LOGISTIC"},{"trace":{"elegibility":{},"extended":{}},"state":0,"old":0,"activation":0,"bias":0,"layer":"input","squash":"LOGISTIC"},{"trace":{"elegibility":{},"extended":{}},"state":0,"old":0,"activation":0,"bias":0,"layer":"input","squash":"LOGISTIC"},{"trace":{"elegibility":{},"extended":{}},"state":0.14169405733230972,"old":0.14169405733230972,"activation":0.14169405733230972,"bias":-0.09707181265402434,"layer":"0","squash":"RELU"},{"trace":{"elegibility":{},"extended":{}},"state":0.09907749230369664,"old":0.09907749230369664,"activation":0.09907749230369664,"bias":0.3211532751252261,"layer":"0","squash":"RELU"},{"trace":{"elegibility":{},"extended":{}},"state":-0.4099841187207795,"old":-0.4099841187207795,"activation":0,"bias":-0.727001333869894,"layer":"0","squash":"RELU"},{"trace":{"elegibility":{},"extended":{}},"state":-0.1201637352870494,"old":-0.1201637352870494,"activation":0,"bias":-0.3018619389770904,"layer":"0","squash":"RELU"},{"trace":{"elegibility":{},"extended":{}},"state":0.27191942759217985,"old":0.27191942759217985,"activation":0.5675640608209161,"bias":0.13080372399304702,"layer":"output","squash":"LOGISTIC"}],"connections":[{"from":"0","to":"3","weight":0.25711269747013443,"gater":null},{"from":"0","to":"4","weight":-0.23914013995092037,"gater":null},{"from":"0","to":"5","weight":0.3413768950148697,"gater":null},{"from":"0","to":"6","weight":0.19565993782485852,"gater":null},{"from":"1","to":"3","weight":0.6034483438129089,"gater":null},{"from":"1","to":"4","weight":-0.5720777230430824,"gater":null},{"from":"1","to":"5","weight":0.9589827768092114,"gater":null},{"from":"1","to":"6","weight":-0.22971715058472356,"gater":null},{"from":"2","to":"3","weight":-0.10677042797026942,"gater":null},{"from":"2","to":"4","weight":0.05142997335427596,"gater":null},{"from":"2","to":"5","weight":-0.11862610011396119,"gater":null},{"from":"2","to":"6","weight":0.49797538195712654,"gater":null},{"from":"3","to":"7","weight":0.5371375690084562,"gater":null},{"from":"4","to":"7","weight":0.6561177578198127,"gater":null},{"from":"5","to":"7","weight":0.9441312560812503,"gater":null},{"from":"6","to":"7","weight":0.032778506637054394,"gater":null}]}'));

function makeMove() {
	var z = getInputs();
	var networkOutput = gen.activate([z.speed, z.next, z.size])[0];
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
		} else {
			console.log(states.dist.toFixed(4));
			restart();
			hasRestarted = true;
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

function onDocumentLoad() {
	setTimeout(testGen, 1000);
}

document.addEventListener("DOMContentLoaded", onDocumentLoad);
