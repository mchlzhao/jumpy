// functions to control the game

function hello() {
	console.log("hello from the other side");
}

function getInputs() {
	var curNext, curSize;
	if (runner.horizon.obstacles.length > 0) {
		curNext = runner.horizon.obstacles[0].xPos;
		curSize = runner.horizon.obstacles[0].width;
	} else {
		curNext = 1000;
		curSize = 0;
	}
	return {
		speed: runner.currentSpeed,
		next: curNext,
		size: curSize,
		dist: runner.distanceRan/40
	};
}

function getStates() {
	return {
		playing: runner.playing,
		crashed: runner.crashed,
		paused: runner.paused
	};
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
