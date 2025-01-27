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
    speedX: 2,
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
let canSHoot = true
let moveAmount = 10
let playerInitX = canvas.clientWidth / 2 - player.clientWidth / 2
let playerInitY = canvas.clientHeight - player.clientHeight - 20
let moveHor = playerInitX

console.log('playerInitY : ', playerInitY)
player.style.transform = `translate(${playerInitX}px)`


document.addEventListener('keyup', e => {
    keys[e.key] = false
    // console.log('up')
})

document.addEventListener('keydown', e => {
    // console.log('down')
    keys[e.key] = true
    if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        // console.log('pause')
        pause()
    }
    const playerX = getPlayerXRelativeToCanvas(player, canvas)
    //space
    if (canSHoot && (e.key === ' ' || e.key === 'Enter')) {
        createBullet(playerX, playerInitY, 'player')
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
    console.log(speedInvader)
    if ((speedInvader.value).length === 0) {
        invaderParams.speedX = 2
    } else {
        invaderParams.speedX = speedInvader.value
    }
    console.log('test', (speedInvader.value).length)
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
    let rondom = getRandomNums(17, 10)
    invaders.forEach((invader, index) => {
        if (rondom.includes(index)) {
            let invaderX = invader.getBoundingClientRect().left - canvas.getBoundingClientRect().left
            let invaderY = canvas.clientHeight - invader.clientHeight - 20
            createBomb(invader, invaderX, invaderY)
        }
        // console.log(`INVADER =>`, invader, `, INDEX => ${index}`)
    })
    console.log('rondom ', rondom)
}
let bombs = []

const moveBomb = (bomb) => {
    console.log(bomb)
}

const createBomb = (index, invaderX, invaderY) => {
    console.log('PARAMS ', invaderX, invaderY)
    const bomb = document.createElement('span')
    bomb.classList.add('bomb')
    // bomb.style.left = `${invaderX}px`
    // bomb.style.top = `${20}px`
    // bomb.style.transform = `translate(50%)`
    index.appendChild(bomb)
    bombs.push(bomb)
    moveBomb(bomb)
    // moveBullet(bomb)
}

const annimateInvaders = () => {
    const enemyRect = invaders.getBoundingClientRect()
    const canvasRect = canvas.getBoundingClientRect()
    console.log('----------', invaderParams.speedX)
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
    // invaderParams.moveX -= 5
    if (canSHoot) {
        invaders.style.transform = `translate(${invaderParams.moveX}px,${invaderParams.moveY}px)`
    }
    // dangerINvader()
    requestAnimationFrame(annimateInvaders)
}
annimateInvaders()


const updateScore = () => {
    const scoreElement = gameInfo.querySelector('.score')
    if (scoreElement) {
        scoreElement.textContent = `Score: ${finalResult.scores}`
    }
}

const eliminateInvader = (bullet) => {
    setTimeout(gameResult, 3000)
    const invadersList = document.querySelectorAll('[class^="invader_"]')
    invadersList.forEach(invader => {
        if (checkCollision(bullet, invader)) {
            invader.remove()
            invaderParams.invaderAmount--
            finalResult.scores += 10
            // console.log('Score:', scores)
            bullet.remove()
            bullets = bullets.filter(b => b !== bullet)
            updateScore()
        }
    })
}



UpdateLives()
createINvaders()
dangerINvader()

function test() {
    const canvasWidth = canvas.clientWidth
    const playerWidth = player.clientWidth
    //player x pos
    const playerX = getPlayerXRelativeToCanvas(player, canvas)
    if (canSHoot) {
        if (keys['ArrowLeft'] && playerX > 0) {
            moveHor -= moveAmount
        }
        if (keys['ArrowRight'] && playerX + playerWidth < canvasWidth) {
            moveHor += moveAmount
        }
        requestAnimationFrame(test)
        player.style.transform = `translateX(${moveHor}px)`
    }

}

function moveBullet(bullet) {
    console.log('-------------player')
    let bTop = parseInt(bullet.style.top)
    bTop -= moveAmount
    bullet.style.top = `${bTop}px`
    eliminateInvader(bullet)
    if (bTop < 0) {
        bullet.remove()
        ///remove bullet
        bullets = bullets.filter(b => b !== bullet)
    } else {
        requestAnimationFrame(() => moveBullet(bullet))
    }


}

function createBullet(playerX, playerInitY) {
    const ship = document.querySelector('.player')
    if (ship) {
        const bullet = document.createElement('span')
        bullet.classList.add('bullet')
        bullet.style.left = `${playerX}px`
        bullet.style.top = `${playerInitY}px`
        bullet.style.transform = `translate(50%)`
        canvas.appendChild(bullet)
        bullets.push(bullet)
        moveBullet(bullet)
    }
}

requestAnimationFrame(test)