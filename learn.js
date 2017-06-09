function printToLog() {
	var x = getInputs();
	console.log(x);
}


function downjump() {
	keyDownJump();
	setTimeout(upjump, 50);
}

function upjump() {
	keyUpJump();
}

setInterval(printToLog, 1000);
setInterval(downjump, 1000);

