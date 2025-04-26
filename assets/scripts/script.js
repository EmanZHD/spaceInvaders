import { gameParams, shipParams } from './settings.js'

import {
    getPlayerXRelativeToCanvas, decrease_lives, timer
} from './utils.js'

import {
    create_invaders, danger_invaders,
    move_invader, move_invaderBomb
} from "./invaders.js"

import { handle_pause, middle, init } from './popup.js'

import {
    move_player, create_shipBomb,
    move_shipBomb
} from './player.js'

const settings = document.querySelector('.settings')
const instruction = document.querySelector('.instruction')
const cancelInstruction = document.querySelector('.cancel-instruction')
const canvas = document.querySelector('.canvas')
const player = document.querySelector('.player')

player.style.bottom = 0

let playerInitX = canvas.clientWidth / 2 - player.clientWidth / 2
let playerInitY = canvas.clientHeight - player.clientHeight

shipParams.moveHor = playerInitX
player.style.transform = `translate(${playerInitX}px)`

document.addEventListener('keyup', e => {
    gameParams.keys[e.key] = false
})

document.addEventListener('keydown', e => {
    const playerX = getPlayerXRelativeToCanvas(player, canvas)
    gameParams.keys[e.key] = true
    if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        handle_pause()
    }
    if ((e.key === ' ' || e.key === 'Enter')) {
        if (shipParams.canShoot) {
            create_shipBomb(playerX, playerInitY)
            shipParams.canShoot = false
            setTimeout(() =>
                shipParams.canShoot = true
                , 200)
        }
    }
})

settings.addEventListener('click', () => {
    const canvas = document.querySelector('.canvas')
    const popupDiv = document.querySelector('body .popup')
    // console.log(popupDiv)
    if (!popupDiv) {
        if (canvas.classList.contains('blur')) {
            gameParams.pauseGame = false
            shipParams.canShoot = true
        } else {
            gameParams.pauseGame = true
            shipParams.canShoot = false
        }
    }

    canvas.classList.toggle('blur')
    instruction.classList.toggle('show')
})

cancelInstruction.onclick = () => {
    const popupDiv = document.querySelector('body .popup')
    if (!popupDiv) {
        gameParams.pauseGame = false
        shipParams.canShoot = true
    }
    canvas.classList.remove('blur')
    instruction.classList.remove('show')
}

setInterval(timer, 1000)

const gameLoop = () => {
    console.log('==========');

    if (gameParams.start === 0) {
        gameParams.pauseGame = true
        shipParams.canShoot = false
        gameParams.start = 1
        init()
    }
    if (!gameParams.pauseGame) {
        middle()
        move_player()
        move_shipBomb()
        move_invaderBomb()
        move_invader()
    }
    requestAnimationFrame(gameLoop)
}

create_invaders()
decrease_lives(gameParams.progress)
danger_invaders()
console.log('=======----===');

requestAnimationFrame(gameLoop)