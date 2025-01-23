// const pointsMap = [0, 0, 0, 0, 0, 0,
//     0, 0, 0, 0, 0, 0,
//     0, 0, 0, 0, 0, 0
// ]

const canvas = document.querySelector('.canvas')
const player = document.querySelector('.player')
const invaders = document.querySelector('.invaders')
const gameInfo = document.querySelector('.game-info')

let scores = 0
let moveVer = player.offsetTop
let moveAmount = 10

let playerInitX = canvas.clientWidth / 2 - player.clientWidth / 2
let playerInitY = canvas.clientHeight - player.clientHeight - 20

let moveHor = playerInitX

console.log('playerInitY : ', playerInitY)
player.style.transform = `translate(${playerInitX}px)`

let keys = {}
let moveX = 0
let moveY = 0
let reverse = false

let bullets = []
let bulletYMove = playerInitY
let canvasREC = canvas.getBoundingClientRect()

function getPlayerXRelativeToCanvas(player, canvas) {
    const playerRect = player.getBoundingClientRect()
    const canvasRect = canvas.getBoundingClientRect()
    return playerRect.left - canvasRect.left
}


document.addEventListener('keyup', e => {
    keys[e.key] = false
    console.log('up')
})

document.addEventListener('keydown', e => {
    console.log('down')
    keys[e.key] = true
    if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        console.log('pause')
        pause()
    }
    const playerX = getPlayerXRelativeToCanvas(player, canvas)
    //space
    if (e.key === ' ' || e.key === 'Enter') {
        createBullet(playerX)
    }
})

const gameOver = () => {
    canvas.innerHTML = ''
    const done = document.createElement('div')
    const restart = document.createElement('button')
    const game = document.createElement('span')
    const score = document.createElement('span')
    game.classList.add('final')
    score.classList.add('score')
    done.classList.add('over')
    game.innerHTML = 'GAME OVER'
    restart.value = 'restart'
    restart.textContent = 'Restart'
    score.innerHTML = `score: ${scores}`
    done.append(game)
    done.append(score)
    done.append(restart)
    canvas.append(done)
    restart.addEventListener('click', () => {
        location.reload()
    })
}

const annimateInvaders = () => {
    const enemyRect = invaders.getBoundingClientRect()
    const canvasRect = canvas.getBoundingClientRect()
    // console.log(`-> canvasREct `, canvasRect, '\n-> enemyREct', enemyRect)
    // console.log(`${canvasRect.bottom} , eneny ${enemyRect.bottom}`)
    // console.log('div', invaders)
    switch (true) {
        case (canvasRect.bottom <= enemyRect.bottom):
            gameOver()
            return
        case (!reverse && canvasRect.right > enemyRect.right):
            moveX += 5
            break
        case (!reverse && canvasRect.right == enemyRect.right):
            reverse = true
            moveY += 53
            break
        case (reverse && canvasRect.left < enemyRect.left):
            moveX -= 5
            break
        case (reverse && canvasRect.left == enemyRect.left):
            reverse = false
            moveY += 53
            break
    }
    // moveX -= 5
    invaders.style.transform = `translate(${moveX}px,${moveY}px)`
    requestAnimationFrame(annimateInvaders)

}

// const eliminateInvader = (bullet) => {
//     const enemies = document.querySelector('.invaders')
//     let bombTop = parseInt(bullet.style.top)
//     let invaderBottom = enemies.getBoundingClientRect().bottom
//     console.log('trackBOMB=>', bombTop, 'trackINvader =>',invaderBottom)
//     const enemyRect = enemies ? enemies.getBoundingClientRect() : ' '
//     console.log('enemy----->',enemyRect)
//     if (enemies && bombTop<invaderBottom){
//         enemies.remove()
//     }
// }

const checkCollision = (bullet, invader) => {
    const bulletRect = bullet.getBoundingClientRect()
    const invaderRect = invader.getBoundingClientRect()
    const playerRect = player.getBoundingClientRect()
    if (
        invaderRect.bottom >= playerRect.top &&
        invaderRect.top <= playerRect.bottom &&
        invaderRect.right >= playerRect.left &&
        invaderRect.left <= playerRect.right
    ) {
        gameOver()
        return true
    }
    return !(
        bulletRect.bottom < invaderRect.top ||
        bulletRect.top > invaderRect.bottom ||
        bulletRect.right < invaderRect.left ||
        bulletRect.left > invaderRect.right
    )
}

const updateScoreDisplay = () => {
    const scoreElement = gameInfo.querySelector('.score')
    if (scoreElement) {
        scoreElement.textContent = `Score: ${scores}`
    }
}
const eliminateInvader = (bullet) => {
    const invadersList = document.querySelectorAll('.invader')
    invadersList.forEach(invader => {
        if (checkCollision(bullet, invader)) {
            invader.remove()
            scores += 10
            console.log('Score:', scores)
            bullet.remove()
            bullets = bullets.filter(b => b !== bullet)
            updateScoreDisplay()
        }
    })
}

// const info = () => {
//     const metaData = document.querySelector('.metaData')
//     const score = document.createElement('span')
//     score.classList.add('score')
//     score.innerHTML = `score: ${scores}`
//     metaData.append(score)
// }

const points = () => {
    let i = 0
    while (i < 33) {
        const invader = document.createElement('div')
        invader.classList.add('invader')
        invaders.append(invader)
        // canvas.append(invader)
        i++
    }
    annimateInvaders()
}

points()
// info()

function test() {
    const canvasWidth = canvas.clientWidth
    const playerWidth = player.clientWidth
    //player x pos
    const playerX = getPlayerXRelativeToCanvas(player, canvas)
    if (keys['ArrowLeft'] && playerX > 0) {
        moveHor -= moveAmount
    }
    if (keys['ArrowRight'] && playerX + playerWidth < canvasWidth) {
        moveHor += moveAmount
    }
    requestAnimationFrame(test)
    player.style.transform = `translateX(${moveHor}px)`
}


function moveBullet(bullet) {
    // console.log(canvasREC)
    let bTop = parseInt(bullet.style.top)
    console.log('bullet TOP', bTop)
    bTop -= moveAmount
    bullet.style.top = `${bTop}px`
    eliminateInvader(bullet)
    if (bTop < canvasREC.top) {
        bullet.remove()
        ///remove bullet
        bullets = bullets.filter(b => b !== bullet)
    } else {
        requestAnimationFrame(() => moveBullet(bullet))
    }
    }

function createBullet(playerX) {
    const bullet = document.createElement('span')
    bullet.classList.add('bullet')
    bullet.style.left = `${playerX}px`
    bullet.style.top = `${playerInitY}px`
    bullet.style.transform = `translate(50 %)`

    canvas.appendChild(bullet)
    bullets.push(bullet)
    moveBullet(bullet)
}



requestAnimationFrame(test)