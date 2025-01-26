export function getPlayerXRelativeToCanvas(player, canvas) {
    const playerRect = player.getBoundingClientRect()
    const canvasRect = canvas.getBoundingClientRect()
    return playerRect.left - canvasRect.left
}

export const roundNum = (nbr) => {
    return Math.floor(nbr / 100) * 100
}

export const checkCollision = (bullet, invader) => {
    const bulletRect = bullet.getBoundingClientRect()
    const invaderRect = invader.getBoundingClientRect()
    let collision = bulletRect.bottom < invaderRect.top ||
        bulletRect.top > invaderRect.bottom ||
        bulletRect.right < invaderRect.left ||
        bulletRect.left > invaderRect.right
    return !(collision)
}

export const UpdateLives = () => {
    const gameInfo = document.querySelector('.game-info')
    const lives = gameInfo.querySelector('.lives')
    const hearts = ['./img/live.png', './img/live.png', './img/death.png']
    hearts.forEach((path) => {
        const heart = document.createElement('img')
        heart.src = path
        heart.style.width = '30px'
        // heart.style.paddingTop = '15px'
        lives.append(heart)

    })
    // lives.innerHTML = '';
}

export const getRandomNums = (max, count) => {
    const randomNumbers = []
    let i = 0
    while (count > i) {
        i++
        const randomNumber = Math.floor(Math.random() * max)
        randomNumbers.push(randomNumber)
    }
    return Array.from(new Set(randomNumbers))
}