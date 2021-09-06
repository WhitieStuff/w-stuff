class sliderButton {
    /**
     * Creates a button for the slider.
     * @param {String} direction Left or Right.
     * @param {String} text Text within the button.
     */
    constructor(direction, text) {
        let button = document.createElement('button')
        button.classList.add('w-slider__button-leaf')
        button.classList.add(`w-slider__button-${direction}`)
        button.id = `w-slider__button-${direction}`
        button.innerHTML = text

        slider.appendChild(button)

        button.addEventListener('click', event => handleButtonClick(event))
    }
}

let slider = document.querySelector('#w-slider')
slider.classList.add('w-slider')

let container
let cards = []

let isMultiple = slider.hasAttribute('multiple')
let isInfinite = slider.hasAttribute('infinite')

let cardsSummary = cards.length
let cardsOnScreen = 0
let screens = []
let initialLeft = 0



createContainer()
countCards()
countScreens()
drawslider()

function createContainer() {
    container = document.createElement('div')
    container.id = 'w-slider__container'
    container.classList.add('w-slider__container')

    let inner = slider.innerHTML
    slider.innerHTML = ''

    container.innerHTML = inner
    slider.appendChild(container)
}

function countCards() {
    for (let i = 0; i < container.childNodes.length; i++) {
        card = container.childNodes[i]
        if (card.innerHTML) {
            card.classList.add('w-slider__card')
            cards.push(card)
        }
    }

}


function handleButtonClick(event) {
    let direction = event.target.id.split('-')[2]
    moveCards(direction)
}

function moveCards(direction) {
    if (!isInfinite && direction === 'left' && cards[0].getAttribute('within') === 'true') return
    if (!isInfinite && direction === 'right' && cards[cards.length - 1].getAttribute('within') === 'true') return


    let move = cards[0].offsetWidth + 20
    if (direction === 'right') move *= -1
    if (isMultiple) move *= cardsOnScreen

    let lastScreenLeft = -(cards[cards.length - 1].offsetLeft + cards[cards.length - 1].offsetWidth - container.offsetWidth)

    initialLeft += move

    if (isInfinite && direction === 'left' && cards[0].getAttribute('within') === 'true') initialLeft = lastScreenLeft
    if (isInfinite && direction === 'right' && cards[cards.length - 1].getAttribute('within') === 'true') initialLeft = 0

    markCardsNotOut()

    cards.forEach(card => {
        card.style.left = `${initialLeft}px`
    })

    let markTimeout = setTimeout(markCardsOut, 400)
}

// function moveToEnd (move) {
//     let length = isMultiple ? cardsOnScreen : 1

//     for (let i = 0; i < length; i++) {
//         let newChild = container.querySelector('.w-slider__card').cloneNode()
//         newChild.innerHTML = container.querySelector('.w-slider__card').innerHTML

//         container.appendChild(newChild)
//         container.removeChild(container.querySelector('.w-slider__card'))

//         cards.push(newChild)
//         cards.shift()
//     }

//     initialLeft -= move
//     initialLeft = 0
// }

// function moveToStart (move) {
//     let length = isMultiple ? cardsOnScreen : 1

//     for (let i = 0; i < length; i++) {
//         let lastChild = container.querySelectorAll('.w-slider__card')[container.querySelectorAll('.w-slider__card').length-1]
//         let newChild = lastChild.cloneNode()
//         newChild.innerHTML = lastChild.innerHTML

//         container.insertBefore(newChild, container.querySelector('.w-slider__card'))
//         container.removeChild(lastChild)

//         cards.unshift(newChild)
//         cards.pop()
//     }

//     initialLeft -= move
//     initialLeft = 0
// }

function countScreens() {
    let sliderWidth = slider.offsetWidth - 100
    let cardWidth = cards[0].offsetWidth + 20
    cardsOnScreen = Math.floor(sliderWidth / cardWidth)
}

function drawslider() {
    if (cards.length > cardsOnScreen) {
        let buttonLeft = new sliderButton('left', '<')
        let buttonRight = new sliderButton('right', '>')
    }

    initialLeft = 0
    let containerWidth = (cards[0].offsetWidth + 20) * cardsOnScreen - 20

    let style = document.createElement('style')
    style.innerHTML = `
        .w-slider {
            position: relative;
            padding: 0 50px;
        }

        .w-slider__container {
            position: relative;
            margin: auto;
            width: ${containerWidth}px;
            display: flex;
            flex-direction: row;
            gap: 20px;
            overflow: hidden;
        }

        .w-slider__button-leaf {
            position: absolute;
            top: 0;
            width: 50px;
            height: 100%;
            background: transparent;
            text-align: center;
            font-family: "Courier New";
            font-size: 50px;
            font-weight: bold;
            color: #666;
            border: none;
            outline: none;
            appearance: none;
            cursor: pointer;
        }

        .w-slider__button-leaf:hover, .slider__button-leaf:focus {
            color: #333;
        }

        .w-slider__button-left {
            left: 0;
        }

        .w-slider__button-right {
            right: 0;
        }

        .w-slider__card {
            position: relative;
            left: ${initialLeft}px;
            transition: .4s left;
        }
    `

    document.querySelector('head').insertBefore(style, document.querySelector('link'))

    markCardsOut()
}

function markCardsNotOut() {
    cards.forEach(card => {
        card.setAttribute('within', 'true')
    })
}

function markCardsOut() {
    cards.forEach(card => {
        card.setAttribute('within', 'true')
        if (card.offsetLeft < 0 || card.offsetLeft + card.offsetWidth > slider.offsetWidth) card.setAttribute('within', 'false')
    })
}