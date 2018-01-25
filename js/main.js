	function setup() {
		createCanvas(windowWidth, windowHeight)
	    mic = new p5.AudioIn()
	    mic.start()
	    dataPoints = []
	    buffer = []
	    lastPoint = 0
	    UNIT_SIZE = 2
	    UNIT_NUMBER = 1500
		myVoice = new p5.Speech()
		hasSpokenRecently = false

		THRESHOLD = 400
		triggerCount = 0
	}

	function draw() {
		ambient_sound_level = mic.getLevel() * 1000
		if (ambient_sound_level > THRESHOLD) {
			triggerCount = max(triggerCount, 0)
			triggerCount += 100
		}
		if (isTriggered() && !hasSpokenRecently) {
			speak()
		}
	    buffer.push(Math.round(ambient_sound_level))
	    if (buffer.length == UNIT_SIZE) {
	    	dataPoint = buffer.reduce((a, b) => a + b, 0)
	    	dataPoints.push(dataPoint)
	    	buffer = []
	    }
	    if (dataPoints.length > UNIT_NUMBER) {
	    	dataPoints = dataPoints.slice(dataPoints.length - UNIT_NUMBER)
	    }
	    background("white")
	    stroke("green")
	    strokeWeight(4)
	    for (i = 0; i < UNIT_NUMBER; i += 1) {
	    	if (dataPoints[i] && dataPoints[i - 1]) {
		    	line(
		    		(i - 1) * (width / UNIT_NUMBER),
		    		getYForDataPoint(dataPoints[i - 1]),
		    		(i) * (width / UNIT_NUMBER),
		    		getYForDataPoint(dataPoints[i]),
		    	)
	    	}
	    }
	    stroke("red")
	    strokeWeight(3)
	    line(0, getYForDataPoint(THRESHOLD * 2), width, getYForDataPoint(THRESHOLD * 2))
	    triggerCount -= 1
	    if (triggerCount % 10 == 0) {
	    	print(triggerCount)
	    }
	}

    function getYForDataPoint(dataPoint) {
    	return height - dataPoint / 2
    }

    function speak() {
    	myVoice.speak(random(messages))
    	hasSpokenRecently = true
    	setTimeout(function(){ hasSpokenRecently = false }, 3000)
    	triggerCount = 0
    }

    function isTriggered() {
    	return triggerCount > 600
    }