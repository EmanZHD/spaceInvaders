import { gameParams, shipParams, invaderParams, finalResult } from './settings.js'

import {
    getPlayerXRelativeToCanvas, roundNum,
    collision_invaderBomb, decrease_lives, getRandomNums
} from './utils.js'

import { create_invaders } from "./invaders.js"
import { creat_popup } from './popup.js'

const canvas = document.querySelector('.canvas')
const player = document.querySelector('.player')
const invaders = document.querySelector('.invaders')
const gameInfo = document.querySelector('.game-info')
// const speedInvader = document.querySelector('.speed')
const btn_pause = document.querySelector('.pause')

player.style.bottom = 0

let playerInitX = canvas.clientWidth / 2 - player.clientWidth / 2
let playerInitY = canvas.clientHeight - player.clientHeight - 20

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

const timer = () => {
    const time = document.querySelector('.timer')
    gameParams.current_time = +(time.textContent.split(':')[1])
    if (gameParams.current_time === 0) {
        shipParams.canShoot = false
        gameParams.pauseGame = true
        finalResult.status = false
        setTimeout(gameResult, 3000)
    }
    if (gameParams.current_time !== 0 && !gameParams.pauseGame) {
        gameParams.current_time--
    }
    finalResult.finalTime = `00:${String(gameParams.current_time).padStart(2, '0')}`
    time.innerHTML = `00:${String(gameParams.current_time).padStart(2, '0')}`
}

setInterval(timer, 1000)

const gameResult = () => {
    const Total_invaders = document.querySelectorAll('[class^="invader_"]').length
    if (!finalResult.status || Total_invaders === 0) {
        gameParams.pauseGame = true
        // canvas.innerHTML = ''
        let title = Total_invaders === 0 ? finalResult.safe : finalResult.fail
        let moreInfo = `score: ${finalResult.scores}
        ${finalResult.finalTime}`
        creat_popup(title, moreInfo, [
            { text: 'restart', action: () => location.reload() }
        ])
    }
}

export const danger_invaders = () => {
    const invaders = document.querySelectorAll(`[class^=invader_]`)
    let rondom = getRandomNums(6, 6)
    invaders.forEach((invader, index) => {
        if (rondom.includes(index)) {
            setInterval(() => create_invaderBomb(invader), 3000)
        }
    })
}

const collision_shipBomb = (bomb, player) => {
    const bombRect = bomb.getBoundingClientRect()
    const playerRect = player.getBoundingClientRect()
    return !(
        bombRect.bottom < playerRect.top ||
        bombRect.top > playerRect.bottom ||
        bombRect.right < playerRect.left ||
        bombRect.left > playerRect.right
    )
}

const create_invaderBomb = (invader) => {
    const ship = document.querySelector('.player')
    if (ship && !gameParams.pauseGame) {
        const bomb = document.createElement('span')
        bomb.classList.add('bomb')

        const invaderRect = invader.getBoundingClientRect()
        const canvasRect = canvas.getBoundingClientRect()
        bomb.style.left = `${invaderRect.left - canvasRect.left + invaderRect.width / 2}px`
        bomb.style.top = `${invaderRect.top - canvasRect.top}px`

        canvas.appendChild(bomb)
        invaderParams.bombs.push(bomb)
    }
}

const increase_score = () => {
    const scoreElement = gameInfo.querySelector('.score')
    if (scoreElement) {
        scoreElement.textContent = `Score: ${finalResult.scores}`
    }
}

const eliminate_invader = (bomb) => {
    const invadersList = document.querySelectorAll('[class^="invader_"]')
    // console.log('==| ', )
    invadersList.forEach(invader => {
        if (collision_invaderBomb(bomb, invader)) {
            invader.remove()
            invaderParams.invaderAmount--
            finalResult.scores += 10
            bomb.remove()
            shipParams.bombs = shipParams.bombs.filter(b => b !== bomb)
            increase_score()
            setTimeout(gameResult, 3000)
        }
    })
}

const create_shipBomb = (playerX, playerInitY) => {
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

const move_player = () => {
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

const move_shipBomb = () => {
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

const move_invaderBomb = () => {
    invaderParams.bombs.forEach(bomb => {
        let b = parseInt(bomb.style.top)
        b += 3
        bomb.style.top = `${b}px`
        const player = document.querySelector('.player')
        if (player && collision_shipBomb(bomb, player)) {
            gameParams.progress -= 25
            decrease_lives(gameParams.progress)
            bomb.remove()
            invaderParams.bombs = invaderParams.bombs.filter(b => b !== bomb)
            if (gameParams.progress === 0) {
                finalResult.status = false
                shipParams.canShoot = false
                player.remove()
                setTimeout(gameResult, 3000)
            }
        }
        if (b > canvas.clientHeight) {
            bomb.remove()
            invaderParams.bombs = invaderParams.bombs.filter(b => b !== bomb)
        }
    })
}

const move_invader = () => {
    const enemyRect = invaders.getBoundingClientRect()
    const canvasRect = canvas.getBoundingClientRect()
    switch (true) {
        case (roundNum(player.getBoundingClientRect().top) - 100 === roundNum(enemyRect.bottom)):
            finalResult.status = false
            shipParams.canShoot = false
            setTimeout(gameResult, 3000)
            return
        case (!invaderParams.reverse && canvasRect.right > enemyRect.right):
            invaderParams.moveX += invaderParams.speedX
            break
        case (!invaderParams.reverse && canvasRect.right == enemyRect.right):
            invaderParams.reverse = true
            invaderParams.moveY += invaderParams.speedY
            break
        case (invaderParams.reverse && canvasRect.left < enemyRect.left):
            invaderParams.moveX -= invaderParams.speedX
            break
        case (invaderParams.reverse && canvasRect.left == enemyRect.left):
            invaderParams.reverse = false
            invaderParams.moveY += invaderParams.speedY
            break
    }
    if (!gameParams.pauseGame) {
        invaders.style.transform = `translate(${invaderParams.moveX}px,${invaderParams.moveY}px)`
    }
}

const game_continue = () => {
    gameParams.pauseGame = false
    shipParams.canShoot = true
    const pause_card = document.querySelector('.popup')
    if (!gameParams.pauseGame) {
        pause_card.remove()
    }
}

const middle = () => {
    if (gameParams.current_time === 10) {
        creat_popup('caution', 'Less than 10 seconds remaining', [])
        gameParams.pauseGame = true
        setTimeout(() => {
            const pauseCard = document.querySelector('.popup')
            pauseCard.remove()
            gameParams.pauseGame = false
            gameParams.current_time += 2
        }, 2000)
    }
}

const display_pause = () => {
    creat_popup(
        'Pause',
        'The game is paused',
        [
            { text: 'continue', action: () => game_continue() },
            { text: 'restart', action: () => location.reload() }
        ]
    )
}

const handle_pause = () => {
    document.querySelector('.pause_card')
    if (!gameParams.pauseGame) {
        shipParams.canShoot = false
        gameParams.pauseGame = true
        display_pause()
    }
}

btn_pause.addEventListener('click', () => handle_pause())

const init = () => {
    creat_popup('SPACE INVADERS', '', [
        { text: 'start now', action: () => handle_start() }
    ])
}

// let start = 0
const handle_start = () => {
    const start_card = document.querySelector('.popup')
    start_card.remove()
    gameParams.pauseGame = false
    shipParams.canShoot = true
}

const gameLoop = () => {
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

requestAnimationFrame(gameLoop)