import {
    getPlayerXRelativeToCanvas, roundNum,
    collision_invaderBomb, decrease_lives, getRandomNums
} from './utils.js'

import { create_invaders } from "./invaders.js"

const canvas = document.querySelector('.canvas')
const player = document.querySelector('.player')
const invaders = document.querySelector('.invaders')
const gameInfo = document.querySelector('.game-info')
const speedInvader = document.querySelector('.speed')
const btn_pause = document.querySelector('.pause')

let playerInitX = canvas.clientWidth / 2 - player.clientWidth / 2
let playerInitY = canvas.clientHeight - player.clientHeight - 20

const invaderParams = {
    invaderAmount: 24,
    moveX: 0,
    moveY: 0,
    reverse: false,
    speedX: 1,
    speedY: 13,
    bombs : []
}

const shipParams = {
    bombs : [],
    canShoot : true,
    moveHor : playerInitX,
    speed : 10
}

const finalResult = {
    status: true,
    fail: 'GAME OVER',
    safe: 'You Win',
    scores: 0,
    finalTime: 0,
}

const gameParams = {
    pauseGame : false,
    progress : 100,
    keys : {}
}

// keys = {}
player.style.transform = `translate(${playerInitX}px)`

document.addEventListener('keyup', e => {
    gameParams.keys[e.key] = false
})

document.addEventListener('keydown', e => {
    gameParams.keys[e.key] = true
    if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        pause()
    }
    const playerX = getPlayerXRelativeToCanvas(player, canvas)
    if (shipParams.canShoot && (e.key === ' ' || e.key === 'Enter')) {
        create_shipBomb(playerX, playerInitY)
    }
})

const timer = () => {
    const time = document.querySelector('.timer')
    let sec = +(time.textContent.split(':')[1])
    if (sec === 0) {
        shipParams.canShoot = false
        finalResult.status = false
        setTimeout(gameResult, 3000)
    }
    if (sec !== 0 && shipParams.canShoot) {
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
            shipParams.canShoot = false
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

export const danger_invaders = () => {
    const invaders = document.querySelectorAll(`[class^=invader_]`)
    let rondom = getRandomNums(17, 2)
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
    if (ship) {
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
    if (ship) {
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
    if (shipParams.canShoot) {
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

const  move_shipBomb = () =>{
    shipParams.bombs.forEach(bomb => {
        let bTop = parseInt(bomb.style.top)
        eliminate_invader(bomb)
        bTop -= shipParams.speed
        bomb.style.top = `${bTop}px`
        console.log(invaderParams.invaderAmount)
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
    if (shipParams.canShoot) {
        invaders.style.transform = `translate(${invaderParams.moveX}px,${invaderParams.moveY}px)`
    }
}

const game_continue = () => {
    gameParams.pauseGame = false
    const pause_card = document.querySelector('.pause_card')
    if (!gameParams.pauseGame){
        pause_card.remove()
    }
    // console.log('continue gamee   ==')
}

const display_pause = () => {
    const pauseCard = document.createElement('div')
    pauseCard.classList.add('pause_card')
    pauseCard.innerHTML = `
    <div>Paused</div>
        <button class="continue">continue</utton>
        <button class="restart">restart</button>
    `
    canvas.append(pauseCard)

    const btn_continue = document.querySelector('.continue')
    const btn_restart = document.querySelector('.restart')
    btn_continue.addEventListener('click', ()=> game_continue())
    btn_restart.addEventListener('click', ()=> location.reload())
}

const pause = () => {
    gameParams.pauseGame = true
    if (pause){
        display_pause()
    }
}


btn_pause.addEventListener('click', ()=> pause())

const gameLoop = () => {
    if (!gameParams.pauseGame){
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

//invqderbomb creted during the pquse