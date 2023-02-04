const express = require('express')
const cors = require('cors')
const ws = require('express-ws')
const _ = require('lodash')
const { nanoid } = require('nanoid')

const game = require('./game')



const app = express()
ws(app)

/*
    получить стайт на клиенте
*/

app.use(express.static('../star-game-www'))

const sockets = {}
game.game_start({ broadcast })

app.ws('/', (ws, req) => {
    // Отправить стейт
    const socketId = nanoid()
    sockets[socketId] = ws

    ws.on('message', (msg) => {
        console.log('on message @ msg', msg)
        const data = unser(msg)
        console.log('on message @ data', data)

        if (data.handshake) {
            ws.send(ser({ worldState: game.get_full_world_state() }))
        }
        if (data.playerJoin) {

        }    
        if (data.statePatch) {
            // записать стейт локально
            game.apply_state_patch(data.statePatch)

            // взять наверное массив патчей и сделать отправку всем
            const message = { statePatch: data.statePatch }
            broadcast(message, socketId)            
        }
        if (data.deleteObject) {
            // записать стейт локально
            game.apply_delete_object(data.deleteObject)

            // взять наверное массив патчей и сделать отправку всем
            const message = { deleteObject: data.deleteObject }
            broadcast(message, socketId)            
        }
    })

    ws.on('close', () => {
        console.log('socket close', socketId)
        if (sockets[socketId]) {
            delete sockets[socketId]
        }
    })
})

app.listen(3000)
console.log('Server started')

function broadcast(message, excludeSocketId = '') {
    const serMessage = ser(message)
    for (const sId in sockets) {
        const s = sockets[sId]
        
        if (!excludeSocketId || sId !== excludeSocketId) {
            s.send(serMessage)
        }
    }
}

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

function ser(obj) {
    return JSON.stringify(obj)
}