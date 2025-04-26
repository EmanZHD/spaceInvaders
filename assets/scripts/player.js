import { gameParams, shipParams } from "./settings.js"
import { getPlayerXRelativeToCanvas } from "./utils.js"
import { eliminate_invader } from "./invaders.js"

const player = document.querySelector('.player')
const canvas = document.querySelector('.canvas')

export const move_player = () => {
    if (!gameParams.pauseGame) {
        const canvasWidth = canvas.clientWidth
        const playerWidth = player.clientWidth
        const playerX = getPlayerXRelativeToCanvas(player, canvas)
        if (gameParams.keys['ArrowLeft'] && playerX > 0) {
            shipParams.moveHor -= shipParams.speed
        }
        if (gameParams.keys['ArrowRight'] && playerX + playerWidth < canvasWidth) {
            shipParams.moveHor += shipParams.speed
        }
        player.style.transform = `translateX(${shipParams.moveHor}px)`
    }
}

export const create_shipBomb = (playerX, playerInitY) => {
    const ship = document.querySelector('.player')
    if (ship && !gameParams.pauseGame) {
        const bomb = document.createElement('span')
        bomb.classList.add('ship_Bomb')
        bomb.style.left = `${playerX}px`
        bomb.style.top = `${playerInitY}px`
        bomb.style.transform = `translate(50%)`
        canvas.appendChild(bomb)
        shipParams.bombs.push(bomb)
    }
}

export const move_shipBomb = () => {
    shipParams.bombs.forEach(bomb => {
        let bTop = parseInt(bomb.style.top)
        eliminate_invader(bomb)
        bTop -= shipParams.speed
        bomb.style.top = `${bTop}px`
        // console.log(invaderParams.invaderAmount)
        if (bTop < 0) {
            bomb.remove()
            shipParams.bombs = shipParams.bombs.filter(b => b !== bomb)
        }
    })
}