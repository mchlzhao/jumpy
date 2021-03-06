function getInputs() {
	var curNext, curSize;
	if (runner.horizon.obstacles.length > 0) {
		if (runner.horizon.obstacles[0].yPos == 50) {
			curNext = 1000;
		} else {
			curNext = runner.horizon.obstacles[0].xPos+200;
		}
		curSize = runner.horizon.obstacles[0].width;
	} else {
		curNext = 1000;
		curSize = 0;
	}
	var ret = {
		speed: runner.currentSpeed/14,
		next: 1-curNext/1000,
		size: curSize/100
	};
	ret.size *= ret.next;
	document.getElementById("speedvar").innerHTML = "spd = " + ret.speed.toFixed(4);
	document.getElementById("nextvar").innerHTML = "nxt = " + ret.next.toFixed(4);
	document.getElementById("sizevar").innerHTML = "sze = " + ret.size.toFixed(4);
	return ret;
}

function getStates() {
	var ret = {
		playing: runner.playing,
		crashed: runner.crashed,
		paused: runner.paused,
		dist: runner.distanceRan/40
	};
	document.getElementById("distvar").innerHTML = "dst = " + ret.dist.toFixed(3);
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
