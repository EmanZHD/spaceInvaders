import { finalResult, gameParams,shipParams } from "./settings.js"
import { creat_popup } from "./popup.js"

const time = document.querySelector('.timer')
time.innerHTML = `00:30` 

export function getPlayerXRelativeToCanvas(player, canvas) {
    const playerRect = player.getBoundingClientRect()
    const canvasRect = canvas.getBoundingClientRect()
    return playerRect.left - canvasRect.left
}

export const roundNum = (nbr) => {
    return Math.floor(nbr / 100) * 100
}
export const collision_invaderBomb = (bullet, invader) => {
    const bulletRect = bullet.getBoundingClientRect()
    const invaderRect = invader.getBoundingClientRect()
    let collision = bulletRect.bottom < invaderRect.top ||
        bulletRect.top > invaderRect.bottom ||
        bulletRect.right < invaderRect.left ||
        bulletRect.left > invaderRect.right
    return !(collision)
}
export const collision_shipBomb = (bomb, player) => {
        const bombRect = bomb.getBoundingClientRect()
        const playerRect = player.getBoundingClientRect()
        return !(
            bombRect.bottom < playerRect.top ||
            bombRect.top > playerRect.bottom ||
            bombRect.right < playerRect.left ||
            bombRect.left > playerRect.right
        )
    }

export const increase_score = () => {
    const gameInfo = document.querySelector('.game-info')
    const scoreElement = gameInfo.querySelector('.score')
    if (scoreElement) {
        scoreElement.innerHTML = `<img src="./img/score.png" alt="score-img" class="score-icon"> ${finalResult.scores}`
       }
}

export const decrease_lives = (livesValue) => {
    const gameInfo = document.querySelector('.game-info')
    const livesProgress = gameInfo.querySelector('.lives')
    livesProgress.style.width = `${livesValue}%`
    livesProgress.textContent = `${livesValue}%`
}

export const getRandomNums = (max, count) => {
    const randomNumbers = []
    let i = 0
    while (count > i) {
        i++
        const randomNumber = Math.floor(Math.random() * max + 1)
        randomNumbers.push(randomNumber)
    }
    return Array.from(new Set(randomNumbers))
}

export const gameResult = () => {
    const Total_invaders = document.querySelectorAll('[class^="invader_"]').length
    if (!finalResult.status || Total_invaders === 0) {
        gameParams.pauseGame = true
        // canvas.innerHTML = ''
        let title = Total_invaders === 0 ? `<img src='./img/win.png'>` : `<img src='./img/defeat3.png'>`
        let moreInfo = `<img src="./img/score.png" alt="score-img" class="score-icon"> ${finalResult.scores}<br>${finalResult.finalTime}`
        let history = Total_invaders === 0 ? 
        `
        Congratulations, Commander!
            You've successfully defended Earth from the alien invasion. 
            Humanity is safe...
        ` 
        :
         `
         The aliens have overwhelmed our defenses.  
             Earth has fallen.  
            But the fight is not over.  
             Will you try again?
         `
        creat_popup(title, moreInfo, [
            { text: '<i class="fa-solid fa-rotate-right"></i> Play Again', action: () => location.reload() }
        ], history)
    }
}

export const timer = () => {
    gameParams.current_sec = +(time.textContent.split(':')[1])
    gameParams.current_min = +(time.textContent.split(':')[0])
    if (gameParams.current_sec === 0 && gameParams.current_min === 0) {
        shipParams.canShoot = false
        gameParams.pauseGame = true
        finalResult.status = false
        setTimeout(gameResult, 3000)
    }
    if (!gameParams.pauseGame) {
        if (gameParams.current_sec === 0) {
            if (gameParams.current_min > 0) {
                gameParams.current_min--
                gameParams.current_sec = 59
            }
        } else {
            gameParams.current_sec--
        }
    }
    finalResult.finalTime = `${String(gameParams.current_min).padStart(2, '0')}:${String(gameParams.current_sec).padStart(2, '0')}`
    time.innerHTML = `${String(gameParams.current_min).padStart(2, '0')}:${String(gameParams.current_sec).padStart(2, '0')}`
}
