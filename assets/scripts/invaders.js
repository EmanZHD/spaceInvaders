import {
    gameParams, invaderParams,
    shipParams, finalResult
} from "./settings.js"
import {
    getRandomNums, collision_invaderBomb,
    increase_score, gameResult, collision_shipBomb, decrease_lives
} from "./utils.js"


export const pointsMap = [
    0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1,
    2, 2, 2, 2, 2, 2
]
const player = document.querySelector('.player')
const canvas = document.querySelector('.canvas')
const invaders = document.querySelector('.invaders')

export const create_invaders = () => {
    const invadersinLine = 6
    const X_space = 50
    const Y_space = 40
    pointsMap.forEach((enemy, index) => {
        const enemyPOs = document.createElement('div')
        let x = (index % invadersinLine) * X_space
        let y = Math.floor((index / invadersinLine)) * Y_space
        switch (enemy) {
            case (0):
                enemyPOs.classList.add('invader_Pink')
                break
            case (1):
                enemyPOs.classList.add('invader_White')
                break
            case (2):
                enemyPOs.classList.add('invader_Blue')
                break
        }
        enemyPOs.style.position = 'absolute';
        enemyPOs.style.left = `${x}px`
        enemyPOs.style.top = `${y}px`
        invaders.append(enemyPOs)
    })
}

export const create_invaderBomb = (invader) => {
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

export const danger_invaders = () => {
    const invaders = document.querySelectorAll(`[class^=invader_]`)
    let rondom = getRandomNums(6, 6)
    invaders.forEach((invader, index) => {
        if (rondom.includes(index)) {
            setInterval(() => create_invaderBomb(invader), 3000)
        }
    })
}
export const eliminate_invader = (bomb) => {
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

export const detect_limits = (invaders) => {
    let left_Last_invader = Infinity
    let right_Last_invader = -Infinity
    let bottom_Last_invader = 0
    invaders.forEach(invader => {
        const invaderRect = invader.getBoundingClientRect()
        if (invaderRect.left < left_Last_invader) {
            left_Last_invader = invaderRect.left
        }
        if (invaderRect.right > right_Last_invader) {
            right_Last_invader = invaderRect.right
        }
        if (invaderRect.bottom > bottom_Last_invader) {
            bottom_Last_invader = invaderRect.bottom
        }
    })
    // console.log('------------------------| ', bottom_Last_invader)
    return { left_Last_invader, right_Last_invader, bottom_Last_invader }
}

export const move_invader = () => {
    const invaders = document.querySelectorAll(`[class^="invader_"]`)
    const canvasRect = canvas.getBoundingClientRect()

    const { left_Last_invader, right_Last_invader, bottom_Last_invader } = detect_limits(invaders)
    console.log(bottom_Last_invader, player.getBoundingClientRect().top)
    switch (true) {
        case (player.getBoundingClientRect().top <= bottom_Last_invader):
            finalResult.status = false
            shipParams.canShoot = false
            setTimeout(gameResult, 3000)
            return
        case (!invaderParams.reverse && right_Last_invader < canvasRect.right):
            invaderParams.moveX += invaderParams.speedX
            break
        case (!invaderParams.reverse && right_Last_invader >= canvasRect.right):
            invaderParams.reverse = true
            invaderParams.moveY += invaderParams.speedY
            break
        case (invaderParams.reverse && left_Last_invader > canvasRect.left):
            invaderParams.moveX -= invaderParams.speedX
            break
        case (invaderParams.reverse && left_Last_invader <= canvasRect.left):
            invaderParams.reverse = false
            invaderParams.moveY += invaderParams.speedY
            break
    }

    if (!gameParams.pauseGame) {
        invaders.forEach(invader => {
            invader.style.transform = `translate(${invaderParams.moveX}px, ${invaderParams.moveY}px)`
        })
    }
}

export const move_invaderBomb = () => {
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