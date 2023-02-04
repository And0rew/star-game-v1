var Game = {
    resources: {},
    map: [],
    scale: 1,
    baseBlockSize: 40,
}

let ctx = null

function game_start(canvas) {
    ctx = canvas.getContext("2d");

    game_loadImage('sand0', 'pix/sand0.png')
    game_loadImage('sand1', 'pix/sand1.png')
    game_loadImage('sand_dark', 'pix/sand_dark.png')
    game_loadImage('sand0border', 'pix/sand-0-border.png')

    Game.map = game_tmp_gen_map(100, 100)

    window.requestAnimationFrame(game_render)  
}


function game_render_map() {
    if (!Game.resources.sand0border) {
        return 
    }

    for (let x = 0; x < Game.map.length; x++) {
        const row = Game.map[x]
        for (let y = 0; y < row.length; y++) {
            ctx.drawImage(
                Game.resources.sand0border,
        
                x * Game.baseBlockSize * Game.scale,
                y * Game.baseBlockSize * Game.scale,
                
                Game.baseBlockSize * Game.scale,
                Game.baseBlockSize * Game.scale,
        
                // x + spriteRenderOffsetX,
                // y + spriteRenderOffsetY,
                // HEX_SIZE * 1.7,
                // HEX_SIZE * 1.7,
            ) 
        }
    }
}


function game_render() {
    const width = canvas.width
    const height = canvas.height

    ctx.clearRect(0, 0, width, height)
    game_render_map()
    
    window.requestAnimationFrame(game_render)              
}


function game_tmp_gen_map(width, height) {
    const map = []
    for (let i = 0; i < width; i++) {
        map.push(new Array(height))
        
        for (let j = 0; j < height; j++) {
            map[i][j] = { t: 'sand' }
        }
    }
    return map
}