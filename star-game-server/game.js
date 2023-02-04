const { update } = require('lodash')
const _ = require('lodash')

const state = {
    map: [],
    objects: {},    
    shots: {},
}

function game_start({ broadcast }) {
    /*
        Пока мир один
        Нужно при старте сервера собрать стейт, если он есть        
    */
    state.map = game_tmp_gen_map(100, 100)   
 
    setInterval(() => {
        update_world({ broadcast })
    }, 500)
}

let pt = 0
function update_world({ broadcast }) {
    let t = Date.now()
    let dt = 0
    if (pt > 0) {
        dt = t - pt
    }
    pt = t
    if (dt === 0) {
        return
    }

    const bulkPatch = []

    for (const objectId in state.objects) {
        const object = state.objects[objectId]
        if (object.vx > 0) {
            object.x = object.x + object.vx * dt
            bulkPatch.push({
                path: ['objects', objectId, 'x'],
                value: object.x,
            })
            
        }  
        if (object.vy > 0) {
            object.y = object.y + object.vy * dt
            bulkPatch.push({
                path: ['objects', objectId, 'y'],
                value: object.y,
            })            
        }       
    }

    if (bulkPatch.length > 0) {
        broadcast({ stateBulkPatch: bulkPatch })
    }    
}

function get_full_world_state() {
    return state
}

function apply_state_patch(patch) {
    const { path, value } = patch
    _.set(state, path, value)
}

function apply_delete_object(deleteObject) {
    const { kind, id } = deleteObject
    if (state[kind] && state[kind][id]) {
        delete state[kind][id]
    }
}

function game_tmp_gen_map(width, height) {
    const map = []

    var blocks = ["sand1", "sand1", "sand1", "sand2", "sand2", "sand2", "dark_sand", "dark_sand"]
    var numbers = [0, 1, 2, 3, 4, 5, 6, 7]

    for (let x = 0; x < width; x++) {
        map.push(new Array(height))
        
        for (let y = 0; y < height; y++) {
            let block = numbers[Math.floor(Math.random() * blocks.length)]
            map[x][y] = {
                text: blocks[block]
            }
        }
    }


    return map
}

exports.game_tmp_gen_map = game_tmp_gen_map
exports.game_start = game_start
exports.get_full_world_state = get_full_world_state
exports.apply_state_patch = apply_state_patch
exports.apply_delete_object = apply_delete_object