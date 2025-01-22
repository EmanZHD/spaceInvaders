// const pointsMap = [0, 0, 0, 0, 0, 0,
//     0, 0, 0, 0, 0, 0,
//     0, 0, 0, 0, 0, 0
// ]

const canvas = document.querySelector('.canvas')
const player = document.querySelector('.player')
const invaders = document.querySelector('.invaders')

let moveVer = player.offsetTop

let moveAmount = 10
let playerInitX = canvas.clientWidth / 2 - player.clientWidth / 2
let playerInitY = canvas.clientHeight - player.clientHeight - 20
let moveHor = playerInitX
console.log('playerInitY : ', playerInitY)
player.style.transform = `translate(${playerInitX}px)`

function getPlayerXRelativeToCanvas(player, canvas) {
    const playerRect = player.getBoundingClientRect()
    const canvasRect = canvas.getBoundingClientRect()

    return playerRect.left - canvasRect.left
}

let keys = {}

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
let scores = 0
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
    restart.addEventListener('click', (event)=>{
        console.log(event)
        canvas.innerHTML = ''
    })
}

let moveX = 0
let moveY = 0
let reverse = false
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
                moveX += 2
            break
        case (!reverse && canvasRect.right == enemyRect.right):
            reverse = true
            moveY += 23
            break
        case (reverse && canvasRect.left < enemyRect.left):
            moveX -= 2
            break
        case (reverse && canvasRect.left == enemyRect.left):
                reverse = false
                moveY += 23
            break
    }
    // moveX -= 5
    invaders.style.transform = `translate(${moveX}px,${moveY}px)`
    requestAnimationFrame(annimateInvaders)
    eliminateInvader()

}
const eliminateInvader = () => {
    const divs = document.querySelectorAll('.invader')
console.log('player ',player.getBoundingClientRect())
    divs.forEach( elem => {
        console.log('------------------------------>',elem.getBoundingClientRect())
    })
//    console.log(`player ${player} \n invqder $
// {invader}`)
}
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

let bullets = []
let bulletYMove = playerInitY
let canvasREC = canvas.getBoundingClientRect()

function moveBullet(bullet) {
    // console.log(canvasREC)
    let bTop = parseInt(bullet.style.top)
    bTop -= moveAmount
    bullet.style.top = `${bTop}px`
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