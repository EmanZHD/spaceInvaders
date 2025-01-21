// const pointsMap = [0, 0, 0, 0, 0, 0,
//     0, 0, 0, 0, 0, 0,
//     0, 0, 0, 0, 0, 0
// ]


const canvas = document.querySelector('.canvas')
const player = document.querySelector('.player')
const enemies = document.querySelector('.enemies')
const points = () => {
    let i = 0
    while (i<51){
        const point = document.createElement('div')
        point.classList.add('point')
        enemies.append(point)
        // canvas.append(point)
        i++
    }
}
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
    console.log(canvasREC)
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
    bullet.style.transform = `translate(50%)`

    canvas.appendChild(bullet)
    bullets.push(bullet)
    moveBullet(bullet)
}


requestAnimationFrame(test)