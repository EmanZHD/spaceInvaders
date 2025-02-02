export const creat_popup = (title, mssg, btns) => {
    const canvas = document.querySelector('.canvas')
    const last_popup = document.querySelector('.popup')

    if (last_popup !== null) {
        last_popup.remove()
    }

    const popup = document.createElement('div')
    const content_popup = document.createElement('div')
    const title_popup = document.createElement('h2')
    const mssg_popup = document.createElement('p')

    popup.classList.add('popup')
    content_popup.classList.add('popup-content')

    title_popup.innerHTML = title
    title_popup.classList.add('popup-title')

    mssg_popup.innerHTML = mssg
    mssg_popup.classList.add('popup-mssg')

    content_popup.append(title_popup)
    content_popup.append(mssg_popup)

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