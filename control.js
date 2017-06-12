// functions to control the game

function hello() {
	console.log("hello from the other side");
}

function getInputs() {
	var curNext, curSize, curHeight;
	if (runner.horizon.obstacles.length > 0) {
		curNext = runner.horizon.obstacles[0].xPos;
		curSize = runner.horizon.obstacles[0].width;
		curHeight = runner.horizon.obstacles[0].yPos;
	} else {
		curNext = 1000;
		curSize = 0;
		curHeight = 0;
	}
	var ret = {
		speed: runner.currentSpeed/14,
		next: curNext/1000,
		size: curSize/100,
		height: curHeight/105
	};
	document.getElementById("speedvar").innerHTML = "speed = " + ret.speed;
	document.getElementById("nextvar").innerHTML = "next = " + ret.next;
	document.getElementById("sizevar").innerHTML = "size = " + ret.size;
	document.getElementById("heightvar").innerHTML = "height = " + ret.height;
	return ret;
}

function getStates() {
	var ret = {
		playing: runner.playing,
		crashed: runner.crashed,
		paused: runner.paused,
		dist: runner.distanceRan/40
	};
	document.getElementById("distvar").innerHTML = "dist = " + ret.dist;
	return ret;
}

function keyDownJump() {
	if (!runner.tRex.jumping && !runner.crashed) {
		if (!runner.playing) {
			runner.loadSounds();
			runner.playing = true;
			runner.update();
			if (window.errorPageController) {
				errorPageController.trackEasterEgg();
			}
		}
		//  Play sound effect and jump on starting the game for the first time.
		if (!runner.tRex.jumping && !runner.tRex.ducking) {
			runner.playSound(runner.soundFx.BUTTON_PRESS);
			runner.tRex.startJump(runner.currentSpeed);
		}
	}
}

function keyDownDuck() {
	if (!runner.tRex.ducking && runner.playing && !runner.crashed) {
		if (runner.tRex.jumping) {
			// Speed drop, activated only when jump key is not pressed.
			runner.tRex.setSpeedDrop();
		} else if (!runner.tRex.jumping && !runner.tRex.ducking) {
			// Duck.
			runner.tRex.setDuck(true);
		}
	}
}

function keyUpJump() {
	if (runner.tRex.jumping && runner.isRunning()) {
		runner.tRex.endJump();
	}
}

function keyUpDuck() {
	if (runner.tRex.ducking) {
		runner.tRex.speedDrop = false;
		runner.tRex.setDuck(false);
	}
}

function restart() {
	if (runner.crashed) {
		runner.restart();
	}
}
