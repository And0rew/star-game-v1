
var AI = function (myAiId) {
	let object = Game.state.objects[myAiId]
	
	if (!object) {
		return
	}

	if (object.ai === 'trooper') {
		ai_trooper(myAiId, object)
	}

	// var chel
	// if (!chel) {
	// 	for (var key in Game.state.objects) {
	// 		if (key != myAiId) {
	// 			chel = Game.state.objects
	// 		}
	// 	}
	// }
}

function ai_trooper(id, object) {
	if (!object.target) {
		// найти цель
	}
	if (object.target) {
		// разворот на цель
		// если далеко -- идти
		// если близко -- стрелять
	}
}