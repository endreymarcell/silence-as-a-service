LIMIT = 150
WINDOW_SIZE = 200
AVG_FACTOR = 5

function setup() {
	createCanvas(windowWidth, windowHeight)
	myVoice = new p5.Speech()
    mic = new p5.AudioIn()
    mic.start()

    maxWidth = width
    dataPoints = Array(maxWidth).fill(0)
	avgPoints = Array(maxWidth).fill(0)
    canSpeak = true
    isDraggingLimitGuide = false
    isDraggingWindowGuide = false
    isRunning = true
}

function draw() {
	ambient_sound_level = mic.getLevel() * 1000
	dataPoints.push(ambient_sound_level)
	if (dataPoints.length > maxWidth) {
		dataPoints = dataPoints.slice(dataPoints.length - maxWidth)
	}
	if (avgPoints.length > maxWidth) {
		avgPoints = avgPoints.slice(avgPoints.length - maxWidth)
	}

	if (dataPoints.length >= WINDOW_SIZE) {
		dataPointsInWindow = dataPoints.slice(dataPoints.length - WINDOW_SIZE)
		avgPoint = dataPointsInWindow.reduce((a, b) => a + b, 0) / WINDOW_SIZE * AVG_FACTOR
	} else {
		avgPoint = 0
	}
	avgPoints.push(avgPoint)

	background("white")
	
	strokeWeight(1)
	for (i = 0; i < dataPoints.length; i += 1) {
		stroke(50, 100, 250, map(i, 0, dataPoints.length, 0, 100))
		line(i, height, i, height - dataPoints[i])
	}

	strokeWeight(3)
	for (i = 0; i < avgPoints.length; i += 1) {
		stroke(0, 50, 200, map(i, 0, avgPoints.length, 0, 255))
		line(i, height - avgPoints[i - 1], i, height - avgPoints[i])
	}
	stroke("red")
	strokeWeight(3)
	line(0, height - LIMIT, maxWidth, height - LIMIT)

	stroke("black")
	strokeWeight(1)
	line(maxWidth - WINDOW_SIZE, 0, maxWidth - WINDOW_SIZE, height)
	line(maxWidth, 0, maxWidth, height)

	if (avgPoint > LIMIT) {
		if (canSpeak) {
			speak()
			canSpeak = false
		}
	} else {
		canSpeak = true
	}

	if ((isMouseCloseToLimitGuide() && mouseX <= maxWidth) || isMouseCloseToWindowGuide()) {
		cursor(MOVE)
	} else {
		cursor()
	}

	if (isDraggingLimitGuide) {
		LIMIT = height - mouseY
	} else if (isDraggingWindowGuide) {
		WINDOW_SIZE = maxWidth - mouseX
	}
}

function isMouseCloseToLimitGuide() {
	return abs(mouseY - (height - LIMIT)) < 10
}

function isMouseCloseToWindowGuide() {
	return abs(mouseX - (maxWidth - WINDOW_SIZE)) < 10
}

function speak() {
	myVoice.speak(random(messages))
}

function keyPressed() {
	if (key === " ") {
		if (isRunning) {
			noLoop()
		} else {
			loop()
		}
		isRunning = !isRunning
	} else if (keyCode == UP_ARROW) {
		LIMIT += 50
	} else if (keyCode == DOWN_ARROW) {
		LIMIT -= 50
	} else if (keyCode == LEFT_ARROW) {
		WINDOW_SIZE += 20
	} else if (keyCode == RIGHT_ARROW) {
		LIMIT -= 20
	}
}

function mousePressed() {
	if (isMouseCloseToLimitGuide()) {
		isDraggingLimitGuide = true
	} else if (isMouseCloseToWindowGuide()) {
		isDraggingWindowGuide = true
	}
}

function mouseReleased() {
	isDraggingLimitGuide = isDraggingWindowGuide = false
}