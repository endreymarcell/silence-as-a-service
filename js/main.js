LIMIT = 300
WINDOW_SIZE = 200
AVG_FACTOR = 5

function loadParams() {
	if (window.location.hash) {
		hash = window.location.hash.substring(1)
		paramParser = /limit=([0-9]+);window=([0-9]+)/g;
		match = paramParser.exec(hash);
		if (match && match.length > 2) {
			LIMIT = parseInt(match[1])
			WINDOW_SIZE = parseInt(match[2])
		}
	}
}

function setParams() {
	window.location.hash = "#limit=" + LIMIT + ";window=" + WINDOW_SIZE
}

function setup() {
	loadParams()
	createCanvas(windowWidth, windowHeight)
	myVoice = new p5.Speech()
	mic = new p5.AudioIn()
	mic.start()
	textSize(20)
	textFont("Verdana")

	maxWidth = width
	dataPoints = Array(maxWidth).fill(0)
	avgPoints = Array(maxWidth).fill(0)
	canSpeak = true
	isDraggingLimitGuide = false
	isDraggingWindowGuide = false
	isRunning = true
	visualCounter = 0
	helpOpacity = 0
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
	stroke("black")
	noFill()
	ellipse(50, 50, 40, 40)
	if (dist(mouseX, mouseY, 50, 50) < 20) {
		helpOpacity = min(helpOpacity + 30, 255)
	} else {
		helpOpacity = max(helpOpacity - 30, 0)
	}

	textAlign("center", "center")
	noStroke()
	fill("black")
	text("?", 50, 50)
	textAlign("left", "top")
	fill(0, 0, 0, helpOpacity)
	text("Up/Down changes the limit\nLeft/Right changes the time window\nSpace pauses/restarts the app\nBookmark this page to have your settings saved ", 80, 40);
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
	fill("white")
	rect(20, height - LIMIT - 20, 80, 40)
	fill("red")
	noStroke()
	textAlign("center", "center")
	text("LIMIT", 60, height - LIMIT)

	stroke("black")
	strokeWeight(1)
	line(maxWidth - WINDOW_SIZE, 0, maxWidth - WINDOW_SIZE, height)
	line(maxWidth, 0, maxWidth, height)
	fill("white")
	rect(maxWidth - WINDOW_SIZE - 60, 20, 120, 60)
	fill("grey")
	noStroke()
	text("TIME\nWINDOW", maxWidth - WINDOW_SIZE, 50)

	if (avgPoint > LIMIT) {
		if (canSpeak) {
			speak()
			visualCounter = 200
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

	background(255, 0, 0, visualCounter)
	visualCounter -= 2
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
		setParams()
	} else if (keyCode == DOWN_ARROW) {
		LIMIT -= 50
		setParams()
	} else if (keyCode == LEFT_ARROW) {
		WINDOW_SIZE += 20
		setParams()
	} else if (keyCode == RIGHT_ARROW) {
		WINDOW_SIZE -= 20
		setParams()
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
	setParams()
}
