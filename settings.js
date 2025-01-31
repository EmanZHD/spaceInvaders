export const invaderParams = {
    invaderAmount: 24,
    moveX: 0,
    moveY: 0,
    reverse: false,
    speedX: 1,
    speedY: 13,
    bombs: []
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
    current_time: 0
}