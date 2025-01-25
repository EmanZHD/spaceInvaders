const pointsMap = [0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1,
    2, 2, 2, 2, 2, 2
]

const canvas = document.querySelector('.canvas')
const player = document.querySelector('.player')
const invaders = document.querySelector('.invaders')
const gameInfo = document.querySelector('.game-info')
let canSHoot = true

let invaderAmount = 24
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
        createBullet(playerX)
    }
})

const timer = () => {
    const time = document.querySelector('.timer')
    let sec = +(time.textContent.split(':')[1])
    console.log('timer', time.textContent, sec)
    if (sec === 0){
        canSHoot = false
            setTimeout(gameOver, 3000)
    }
    if (sec !== 0) {
        sec--
    }
    time.innerHTML = `00:${String(sec).padStart(2, '0')}`
}

setInterval(timer, 1000)

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

const gameWin = () => {
    // console.log('------->', invaders.childNodes.length)
    if (invaders.childNodes.length === 0) {
        canvas.innerHTML = ''
        const done = document.createElement('div')
        const restart = document.createElement('button')
        const game = document.createElement('span')
        const score = document.createElement('span')
        game.classList.add('final')
        score.classList.add('score')
        done.classList.add('over')
        game.innerHTML = 'You Win'
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
}

const roundNum = (nbr) => {
    return Math.floor(nbr / 100) * 100
}

const annimateInvaders = () => {
    const enemyRect = invaders.getBoundingClientRect()
    const canvasRect = canvas.getBoundingClientRect()
    // console.log('invaderDIV----------- ', enemyRect)
    const speed = 2
    // console.log('---> ', roundNum(player.getBoundingClientRect().top), roundNum(enemyRect.bottom))
    switch (true) {
        case (roundNum(player.getBoundingClientRect().top) - 100 === roundNum(enemyRect.bottom)):
            canSHoot = false
            setTimeout(gameOver, 3000)
            return
        case (!reverse && canvasRect.right > enemyRect.right):
            moveX += speed
            break
        case (!reverse && canvasRect.right == enemyRect.right):
            reverse = true
            moveY += 13
            break
        case (reverse && canvasRect.left < enemyRect.left):
            moveX -= speed
            break
        case (reverse && canvasRect.left == enemyRect.left):
            reverse = false
            moveY += 13
            break
    }
    // moveX -= 5
    if (canSHoot){
        invaders.style.transform = `translate(${moveX}px,${moveY}px)`
    }
    requestAnimationFrame(annimateInvaders)
}
annimateInvaders()

const checkCollision = (bullet, invader) => {
    const bulletRect = bullet.getBoundingClientRect()
    const invaderRect = invader.getBoundingClientRect()
    let collision = bulletRect.bottom < invaderRect.top ||
        bulletRect.top > invaderRect.bottom ||
        bulletRect.right < invaderRect.left ||
        bulletRect.left > invaderRect.right
    return !(collision)
}

const UpdateLives = () => {
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

const updateScore = () => {
    const scoreElement = gameInfo.querySelector('.score')
    if (scoreElement) {
        scoreElement.textContent = `Score: ${scores}`
    }
}

const eliminateInvader = (bullet) => {
    setTimeout(gameWin, 3000)
    const invadersList = document.querySelectorAll('[class^="invader_"]')
    invadersList.forEach(invader => {
        if (checkCollision(bullet, invader)) {
            invader.remove()
            invaderAmount--
            scores += 10
            // console.log('Score:', scores)
            bullet.remove()
            bullets = bullets.filter(b => b !== bullet)
            updateScore()
        }
    })
}

UpdateLives()

const createINvaders = () => {
    const invadersinLine = 6
    const X_space = 65
    const Y_space = 60
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

createINvaders()

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

function createBullet(playerX) {
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