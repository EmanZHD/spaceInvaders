// import { danger_invaders } from "./script.js"

// export const pointsMap = [
//     0, 0, 0, 0, 0, 0,
//     1, 1, 1, 1, 1, 1,
//     2, 2, 2, 2, 2, 2
// ]
export const pointsMap = [
    0, 0, 0,
    1, 1, 1,
]
export const create_invaders = () => {
    const invaders = document.querySelector('.invaders')
    const invadersinLine = 3
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