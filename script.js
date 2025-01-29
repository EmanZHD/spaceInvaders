import {
    getPlayerXRelativeToCanvas, roundNum,
    checkCollision, UpdateLives, getRandomNums
} from './utils.js'

import { createINvaders } from "./invaders.js"

const invaderParams = {
    invaderAmount: 24,
    moveX: 0,
    moveY: 0,
    reverse: false,
    speedX: 1,
    speedY: 13,
}

const finalResult = {
    status: true,
    fail: 'GAME OVER',
    safe: 'You Win',
    scores: 0,
    finalTime: 0,
}

const canvas = document.querySelector('.canvas')
const player = document.querySelector('.player')
const invaders = document.querySelector('.invaders')
const gameInfo = document.querySelector('.game-info')
const speedInvader = document.querySelector('.speed')

let keys = {}
let bullets = []
let bombs = []
let canSHoot = true
let moveAmount = 10
let progress = 100
let playerInitX = canvas.clientWidth / 2 - player.clientWidth / 2
let playerInitY = canvas.clientHeight - player.clientHeight - 20
let moveHor = playerInitX

player.style.transform = `translate(${playerInitX}px)`

document.addEventListener('keyup', e => {
    keys[e.key] = false
})

document.addEventListener('keydown', e => {
    keys[e.key] = true
    if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        pause()
    }
    const playerX = getPlayerXRelativeToCanvas(player, canvas)
    if (canSHoot && (e.key === ' ' || e.key === 'Enter')) {
        createBullet(playerX, playerInitY)
    }
})

const timer = () => {
    const time = document.querySelector('.timer')
    let sec = +(time.textContent.split(':')[1])
    if (sec === 0) {
        canSHoot = false
        finalResult.status = false
        setTimeout(gameResult, 3000)
    }
    if (sec !== 0 && canSHoot) {
        sec--
    }
    finalResult.finalTime = `00:${String(sec).padStart(2, '0')}`
    time.innerHTML = `00:${String(sec).padStart(2, '0')}`
}

const speedControl = () => {
    if ((speedInvader.value).length === 0) {
        invaderParams.speedX = 2
    } else {
        invaderParams.speedX = speedInvader.value
    }
}

speedInvader.addEventListener('input', speedControl)

setInterval(timer, 1000)

const gameResult = () => {
    const Total_invaders = document.querySelectorAll('[class^="invader_"]').length
    if (!finalResult.status || Total_invaders === 0) {
        canvas.innerHTML = ''
        const done = document.createElement('div')
        const restart = document.createElement('button')
        const game = document.createElement('span')
        const score = document.createElement('span')
        const timeDisplay = document.createElement('span')
        game.classList.add('final')
        score.classList.add('score')
        timeDisplay.classList.add('time')
        done.classList.add('over')
        if (Total_invaders === 0) {
            canSHoot = false
            game.innerHTML = finalResult.safe
        }
        if (!finalResult.status) {
            game.innerHTML = finalResult.fail
        }
        restart.value = 'restart'
        restart.textContent = 'Restart'
        score.innerHTML = `score: ${finalResult.scores}`
        timeDisplay.innerHTML = `${finalResult.finalTime}`
        done.append(game)
        done.append(score)
        done.append(timeDisplay)
        done.append(restart)
        canvas.append(done)
        restart.addEventListener('click', () => {
            location.reload()
        })
    }
}

export const dangerINvader = () => {
    const invaders = document.querySelectorAll(`[class^=invader_]`)
    let rondom = getRandomNums(17, 2)
    invaders.forEach((invader, index) => {
        if (rondom.includes(index)) {
            setInterval(() => createBomb(invader), 3000)
        }
    })
}

const checkBombPlayerCollision = (bomb, player) => {
    const bombRect = bomb.getBoundingClientRect()
    const playerRect = player.getBoundingClientRect()

    return !(
        bombRect.bottom < playerRect.top ||
        bombRect.top > playerRect.bottom ||
        bombRect.right < playerRect.left ||
        bombRect.left > playerRect.right
    )
}

const createBomb = (invader) => {
    const ship = document.querySelector('.player')
    if (ship) {
        const bomb = document.createElement('span')
        bomb.classList.add('bomb')

        const invaderRect = invader.getBoundingClientRect()
        const canvasRect = canvas.getBoundingClientRect()
        bomb.style.left = `${invaderRect.left - canvasRect.left + invaderRect.width / 2}px`
        bomb.style.top = `${invaderRect.top - canvasRect.top}px`

        canvas.appendChild(bomb)
        bombs.push(bomb)
    }
}

const updateScore = () => {
    const scoreElement = gameInfo.querySelector('.score')
    if (scoreElement) {
        scoreElement.textContent = `Score: ${finalResult.scores}`
    }
}

const eliminateInvader = (bullet) => {
    const invadersList = document.querySelectorAll('[class^="invader_"]')
    // console.log('==| ', )
    invadersList.forEach(invader => {
        if (checkCollision(bullet, invader)) {
            invader.remove()
            invaderParams.invaderAmount--
            finalResult.scores += 10
            bullet.remove()
            bullets = bullets.filter(b => b !== bullet)
            updateScore()
            setTimeout(gameResult, 3000)
        }
    })
}

const createBullet = (playerX, playerInitY) => {
    const ship = document.querySelector('.player')
    if (ship) {
        const bullet = document.createElement('span')
        bullet.classList.add('bullet')
        bullet.style.left = `${playerX}px`
        bullet.style.top = `${playerInitY}px`
        bullet.style.transform = `translate(50%)`
        canvas.appendChild(bullet)
        bullets.push(bullet)
    }
}

const playerMov = () => {
    if (canSHoot) {
        const canvasWidth = canvas.clientWidth
        const playerWidth = player.clientWidth
        const playerX = getPlayerXRelativeToCanvas(player, canvas)
        if (keys['ArrowLeft'] && playerX > 0) {
            moveHor -= moveAmount
        }
        if (keys['ArrowRight'] && playerX + playerWidth < canvasWidth) {
            moveHor += moveAmount
        }
        player.style.transform = `translateX(${moveHor}px)`
    }
}

const bullletMove = () =>{
    bullets.forEach(bullet => {
        let bTop = parseInt(bullet.style.top)
        eliminateInvader(bullet)
        bTop -= moveAmount
        bullet.style.top = `${bTop}px`
        console.log(invaderParams.invaderAmount)
        if (bTop < 0) {
            bullet.remove()
            bullets = bullets.filter(b => b !== bullet)
        }
    })
}

const bombMov = () => {
    bombs.forEach(bomb => {
        let b = parseInt(bomb.style.top)
        b += 1
        bomb.style.top = `${b}px`
        const player = document.querySelector('.player')
        if (player && checkBombPlayerCollision(bomb, player)) {
            progress -= 25
            UpdateLives(progress)
            bomb.remove()
            bombs = bombs.filter(b => b !== bomb)
            if (progress === 0) {
                finalResult.status = false
                canSHoot = false
                player.remove()
                setTimeout(gameResult, 3000)
            }
        }
        if (b > canvas.clientHeight) {
            bomb.remove()
            bombs = bombs.filter(b => b !== bomb)
        }
    })
} 

const invaderMov = () => {
    const enemyRect = invaders.getBoundingClientRect()
    const canvasRect = canvas.getBoundingClientRect()
    switch (true) {
        case (roundNum(player.getBoundingClientRect().top) - 100 === roundNum(enemyRect.bottom)):
            finalResult.status = false
            canSHoot = false
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
    if (canSHoot) {
        invaders.style.transform = `translate(${invaderParams.moveX}px,${invaderParams.moveY}px)`
    }
}

const gameLoop = () => {
    playerMov()
    bullletMove()
    bombMov()
    invaderMov()
    requestAnimationFrame(gameLoop)
}

createINvaders()
UpdateLives(progress)
dangerINvader()

requestAnimationFrame(gameLoop)