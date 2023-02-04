var Game = {
    resources: {},
    camera:[0, 0],
    state: {
    	map: null,
    	objects: {},
    	shots: {}
    },
    bloock_r: 1,
    X_Y_block: 40
}
var start_game = function(canvas, ctx) {
	gs_init()

	game_loadImage('sand1', 'pix/sand1.png')
    game_loadImage('sand_dark', 'pix/sand_dark.png')
    game_loadImage('sand2', 'pix/sand2.png')
    game_loadImage('trooper1', 'pix/trooper1.png')
    game_loadImage('shot1', 'pix/shot1.png')
    game_loadImage('tower1', 'pix/tower1.png')

  	var draw_map = function (width, height) {
  		if (!Game.state.map) {
  			return
  		}

		for (var x = 0; x < width; x++) {
			for (var y = 0; y < height; y++) {
				let tex
				if (Game.state.map[x][y].text === "dark_sand") {
					tex = Game.resources.sand_dark
				} else if (Game.state.map[x][y].text === "sand1"){
					tex = Game.resources.sand1
				} else if (Game.state.map[x][y].text === "sand2") {
					tex = Game.resources.sand2
				} else {
					tex = Game.resources.sand1
				}
				ctx.drawImage(
				tex,

				x * 40 * Game.bloock_r - Game.camera[0],
				y * 40 * Game.bloock_r - Game.camera[1],

				Game.bloock_r * Game.X_Y_block,
				Game.bloock_r * Game.X_Y_block
				)
			}
		}
	}


	var STOP_DIFF = 11

	var draw_objects = function (dt) {
		if (!Game.state.objects) {
  			return
  		}
  		var tex2
  		var rt = 0

		for (var key in Game.state.objects) {
			var object = Game.state.objects[key]

			if (object.vx !== 0 || object.vy !== 0) {
				object.x = object.x + object.vx * dt
				object.y = object.y + object.vy * dt
			
				if (Game.myId === key && object.target) {
					let xm = object.target[0]
					let ym = object.target[1]
					
					if (
						(object.x > xm - STOP_DIFF && object.x < xm + STOP_DIFF)
						&& (object.y > ym - STOP_DIFF && object.y < ym + STOP_DIFF)
					) {						
						game_update(["objects", key, "vx"], 0)
						game_update(["objects", key, "vy"], 0)
						game_update(["objects", key, "x"], object.x)
						game_update(["objects", key, "y"], object.y)
					}
					
				}
					
			}
			 


			if (object.look === "trooper1") {
				tex2 = Game.resources.trooper1
			}
			if (object.look === "tower1") {
				tex2 = Game.resources.tower1
			}
			ctx.save()
			ctx.translate(
				object.x * Game.bloock_r - Game.camera[0] + Game.bloock_r * tex2.width / 2, 
				object.y * Game.bloock_r - Game.camera[1] + Game.bloock_r * tex2.height / 2
			);
			ctx.rotate(object.g / 180 * Math.PI);
			ctx.drawImage(
				tex2,

				-Game.bloock_r * tex2.width / 2,
				-Game.bloock_r * tex2.height / 2,

				Game.bloock_r * tex2.width,
				Game.bloock_r * tex2.height

			)
			ctx.restore()
			if (object.nickName != null) {
				ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
				let rectWidth = ctx.measureText(object.nickName).width + 6
				ctx.fillRect(
					object.x * Game.bloock_r - Game.camera[0] - 3,
					object.y * Game.bloock_r - Game.camera[1] - 24,
					rectWidth,
					12
				)
				ctx.fillStyle = "Black"
				ctx.fillText(
					object.nickName,

					object.x * Game.bloock_r - Game.camera[0],
					object.y * Game.bloock_r - Game.camera[1] - 15
				)
			}
			// ctx.fillText(
			// 	object.hitpoints,

			// 	object.x * Game.bloock_r - Game.camera[0],
			// 	object.y * Game.bloock_r - Game.camera[1] - 30
			// )
			ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
			ctx.fillRect(
				object.x * Game.bloock_r - Game.camera[0] - 3,
				object.y * Game.bloock_r - Game.camera[1] - (27 + 12),
				56,
				12
			)
			ctx.fillStyle = "Green"
			ctx.fillRect(
				object.x * Game.bloock_r - Game.camera[0],
				object.y * Game.bloock_r - Game.camera[1] - (27 + 9),
				(50 / object.max_hitpoints) * object.hitpoints,
				6
			)
			ctx.fillStyle = "Black"
		}
	}

	var draw_shots = function (dt) {
		if (!Game.state.shots) {
  			return
  		}

		for (var key in Game.state.shots) {
			var shot = Game.state.shots[key]

			if (shot.time_not_life <= Date.now()) {
				delete Game.state.shots[key]
				console.log("умер")
				continue				
			}

			if (shot.vx !== 0 || shot.vy !== 0) {
				shot.x = shot.x + shot.vx * dt
				shot.y = shot.y + shot.vy * dt		
			}

			var tex = Game.resources.shot1

			ctx.save()
			ctx.translate(
				shot.x * Game.bloock_r - Game.camera[0], 
				shot.y * Game.bloock_r - Game.camera[1]
			);
			ctx.rotate(shot.g / 180 * Math.PI);
			ctx.drawImage(
				tex,

				-Game.bloock_r * tex.width / 2,
				-Game.bloock_r * tex.height / 2,

				Game.bloock_r * tex.width,
				Game.bloock_r * tex.height

			)
			ctx.restore()
		}
	}
	var uron = 20
	var RadPop = 0
	var ux = 0
	var uy = 0
	var hp_shots = function () {
		for (var key in Game.state.shots) {
			for (var kero in Game.state.objects) {
				var object = Game.state.objects[kero]
				var shot = Game.state.shots[key]
				if (!shot) {
					return
				}
				if (!object) {
					return
				}
				if (object.look === "trooper1") {
					RadPop = 31
					ux = 49 / 2
					uy = 30 / 2
				} else if (object.look === "tower1") {
					RadPop = 81
					ux = 40
					uy = 40
				}
				if (shot.x > object.x + ux - RadPop && shot.x < object.x + ux + RadPop) {
					if (shot.y > object.y + uy - RadPop && shot.y < object.y + uy + RadPop) {
						if (object.id != shot.myid) {
							console.log("попал")
							object.hitpoints = object.hitpoints - uron
							delete Game.state.shots[key]
							if (object.hitpoints <= 0) {
								delete Game.state.objects[kero]
							}
						}
					}
				}
			}
		}
	}
	setTimeout(() => {
		window.requestAnimationFrame(render)
	}, 500)

	var t = Date.now()
	var pt = 0
	var dt = 0

	var render = function () {
		pt = t
		t = Date.now()
		dt = t - pt

		
		ctx.clearRect(0, 0, innerWidth, innerHeight)
		draw_map(100,100)
		draw_objects(dt)
		draw_shots(dt)
		hp_shots()

		window.requestAnimationFrame(render) 
	}
}