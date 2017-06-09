function printToLog() {
	var x = getStats();
	console.log(x);
}

setInterval(printToLog, 1000);

