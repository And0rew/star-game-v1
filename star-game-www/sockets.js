let ws

function gs_init() {
    const host = 'ws://' + window.location.host.toString()
    console.log('Connect to', host)
    
    ws = new WebSocket(host)
    
    ws.addEventListener('open', () => {
        ws.send(ser({ handshake: true }));
    });
      
    ws.addEventListener('message', (msg) => {
        const data = unser(msg.data)
        if (data.worldState) {
            Game.state = data.worldState
        }
        if (data.statePatch) {
            game_was_updated(data.statePatch)
        }
        if (data.stateBulkPatch) {
            game_was_updated_bulk(data.stateBulkPatch)
        }
        if (data.deleteObject) {
            game_was_deleted(data.deleteObject.kind, data.deleteObject.id)
        }
    });
}

function gs_send(data) {
    ws.send(ser(data))
}

function game_update(path, value) {
    _.set(Game.state, path, value)
    gs_send({ statePatch: { path, value } })
}

function game_delete(kind, id) {
    if (Game.state[kind] && Game.state[kind][id]) {
        delete Game.state[kind][id]
    }
    gs_send({ deleteObject: { kind, id } })
}

function game_was_deleted(kind, id) {
    if (Game.state[kind] && Game.state[kind][id]) {
        delete Game.state[kind][id]
    }
}

function game_was_updated(patch) {
    const { path, value } = patch
    _.set(Game.state, path, value)
}

function game_was_updated_bulk(patchArr) {
    for (const patch of patchArr) {
        game_was_updated(patch)
    }
}

function ser(obj) {
    return JSON.stringify(obj)
}

// ser({ handshake: true })

function unser(str) {
    if (_.isString(str)) {
        try {
            return JSON.parse(str)
        } catch(e) {
            return {}
        }
    }
    return str
}