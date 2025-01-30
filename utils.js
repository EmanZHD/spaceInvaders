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