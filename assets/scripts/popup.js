import { gameParams, shipParams, imagHTML, finalResult } from "./settings.js"
const canvas = document.querySelector('.canvas')

export const creat_popup = (title, mssg, btns, history) => {
    const last_popup = document.querySelector('.popup')

    if (last_popup !== null) {
        last_popup.remove()
    }

    const popup = document.createElement('div')
    const content_popup = document.createElement('div')
    const title_popup = document.createElement('h2')
    const mssg_popup = document.createElement('p')
    const history_popup = document.createElement('p')

    popup.classList.add('popup')
    content_popup.classList.add('popup-content')

    title_popup.innerHTML = title
    title_popup.classList.add('popup-title')

    mssg_popup.innerHTML = mssg
    mssg_popup.classList.add('popup-mssg')

    history_popup.innerHTML = history
    history_popup.classList.add('popup-history')

    content_popup.append(title_popup)
    content_popup.append(mssg_popup)
    content_popup.append(history_popup)

    if (btns.length !== 0) {
        const allBtns = document.createElement('div')
        allBtns.classList.add('all_btns')
        btns.forEach((btn) => {
            const button = document.createElement('button')
            button.innerHTML = btn.text
            button.classList.add('popup-button')
            button.addEventListener('click', btn.action)
            allBtns.append(button)
        })
        content_popup.append(allBtns)
    }

    popup.append(content_popup)
    document.body.append(popup)
    return popup
}

export const game_continue = () => {
    canvas.classList.remove('blur')
    gameParams.pauseGame = false
    shipParams.canShoot = true
    const pause_card = document.querySelector('.popup')
    if (!gameParams.pauseGame) {
        pause_card.remove()
    }
}

export const middle = () => {
    if (gameParams.current_min === 0 && finalResult.scores === 100) {
        canvas.classList.add('blur')
        creat_popup('<i class="fa-solid fa-triangle-exclamation"  style="color: red"></i>',
            'Mission Update', [],
            `
        Reinforces incoming with <span class="gift"><img src="./assets/img/score.png" alt="score-img">+5</span>.<br>
        Stay sharp!
        `)
        gameParams.pauseGame = true
        setTimeout(() => {
            const pauseCard = document.querySelector('.popup')
            pauseCard.remove()
            gameParams.pauseGame = false
            // gameParams.current_sec += 2
            finalResult.scores += 5
            canvas.classList.remove('blur')
        }, 8000)
    }
}

export const display_pause = () => {
    canvas.classList.add('blur')
    creat_popup(
        '<i class="fa-solid fa-pause" style="color: white"></i> Pause',
        'The game is paused',
        [
            { text: '<i class="fa-solid fa-left-long"></i>', action: () => game_continue() },
            { text: '<i class="fa-solid fa-rotate-right"></i>', action: () => location.reload() }
        ],
        `
        `
    )
}

export const handle_pause = () => {
    document.querySelector('.pause_card')
    if (!gameParams.pauseGame) {
        shipParams.canShoot = false
        gameParams.pauseGame = true
        display_pause()
    }
}

export const handle_start = () => {
    const start_card = document.querySelector('.popup')
    start_card.remove()
    gameParams.pauseGame = false
    shipParams.canShoot = true
    gameParams.start = 1
}
export const init = () => {
    creat_popup(imagHTML, '', [
        { text: '<i class="fa-regular fa-circle-play" ></i> Start Mission', action: () => handle_start() }
    ],
        `It's time to save the world —<br>
        are you ready to fight? 
    `)
}