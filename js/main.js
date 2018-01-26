LIMIT = 150
WINDOW_SIZE = 200
AVG_FACTOR = 5

function setup() {
	createCanvas(windowWidth, windowHeight)
	myVoice = new p5.Speech()
    mic = new p5.AudioIn()
    mic.start()

    dataPoints = []
	avgPoints = []
    maxWidth = width - 100
    canSpeak = true
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
	stroke(250, 20, 20, 100)
	strokeWeight(1)
	for (i = 0; i < dataPoints.length; i += 1) {
		line(
			i,
			height,
			i,
			height - dataPoints[i]
		)
	}
	stroke("darkred")
	strokeWeight(3)
	for (i = 0; i < avgPoints.length; i += 1) {
		line(
			i,
			height - avgPoints[i - 1],
			i,
			height - avgPoints[i]
		)
	}
	stroke("black")
	strokeWeight(2)
	line(0, height - LIMIT, width, height - LIMIT)

	if (avgPoint > LIMIT) {
		if (canSpeak) {
			speak()
			canSpeak = false
		}
	} else {
		canSpeak = true
	}
}

function speak() {
	myVoice.speak(random(messages))
}
