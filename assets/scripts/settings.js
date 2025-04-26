export const invaderParams = {
    invaderAmount: 24,
    moveX: 0,
    moveY: 0,
    reverse: false,
    speedX: 4,
    speedY: 20,
    bombs: [],
}

export const shipParams = {
    bombs: [],
    canShoot: true,
    // moveHor: playerInitX,
    speed: 10
}

export const finalResult = {
    status: true,
    fail: 'GAME OVER',
    safe: 'You Win',
    scores: 0,
    finalTime: 0,
}

export const gameParams = {
    start: 0,
    pauseGame: false,
    progress: 100,
    keys: {},
    current_sec: 0,
    current_min: 0
}

export const imageSrc = [
    './assets/img/blueAlien0.png',
    './assets/img/alien1.png',
    './assets/img/pinkAlien0.png'
]
export const imagHTML = imageSrc.map(src => `<img src="${src}" alt="logo">`).join('')