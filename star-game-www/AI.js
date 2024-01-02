
var AI = function (myAiId) {
	let object = Game.state.objects[myAiId]
	
	if (!object) {
		return
	}

	if (object.ai === 'trooper_p') {
		ai_trooper_p(myAiId, object)
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
var getDistance = function (event, target) {
        var diffX = event.x - target.x;
        var diffY = event.y - target.y;
        return Math.sqrt((diffX * diffX) + (diffY * diffY));
};

function ai_trooper_p(id, object) {
	if (!object.target) {
		for (var key in Game.state.objects) {
		 	if (key.id != id) {
		 		var target = Game.state.objects[key]
		 		var dist = 	getDistance(object, targetObject)

		 		// если цель подходит по дистанции дальности видимости
		 		object.target = target.id
			}
		}
	}
	if (object.target) {
		let targetObject = Game.state.objects[object.target]
		var dist = 	getDistance(object, targetObject)
		// разворот на цель
		var dx = targetObject.x - object.x
		var dy = targetObject.y - object.y

		var k = dy / dx
		var g = Math.atan(k) / Math.PI * 180
		if  (dx < 0) {
			g = g - 90
		} else {
			g = g + 90
		}
		// если далеко -- идти
		if (dist >= 150) {
			var xt = (targetObject.x - object.x) / 2 + object.x
			var yt = (targetObject.y - object.y) / 2 + object.y

			var dx = xt - object.x
			var dy = yt - object.y

			var k = Math.abs(dx / dy)
			
			var vy = object.v / Math.sqrt(k * k + 1)
			var vx = k * vy
			
			if (xm < object.x) {
				vx = -vx
			}
			if (ym < object.y) {
				vy = -vy
			}
		}
		// если близко -- стрелять
		if (dist < 150) {
			var k = Math.tan(object.g / 180 * Math.PI)			
			var V_SHOT = 0.4
			var vy = V_SHOT / Math.sqrt(k * k + 1)
			var vx = Math.abs(k * vy)

			console.log(object.g)
			if (object.g >= 0 && object.g < 90) {
				vy = -vy
			} else if (object.g <= 0 && object.g > -90) {
				vy = -vy
				vx = -vx
			} else if (object.g <= -90 && object.g > -180) {
				vx = -vx
			}
			var life = 3000
			var date_create = Date.now()
			var shotId = random(16)
			game_update(["shots", shotId], {
				id: shotId,
				x: object.x + 49 / 2,
				y: object.y + 30 / 2,
				g: object.g,
				vx: vx,
				vy: vy,
				v: V_SHOT,
				date_create: date_create,
				time_life: life,
				time_not_life: date_create + life,
				myid: id
			})
			console.log(["Id:", shotId, "x:", Game.state.shots[shotId].x, "y:", Game.state.shots[shotId].y, "g:", Game.state.shots[shotId].g].join(" "))
		}
	}
}