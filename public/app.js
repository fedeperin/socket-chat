let socket = io()

let messages = document.querySelector('#messages')
let form = document.querySelector('#form')
let nameForm = document.querySelector('form#name')
let input = document.getElementById('input')
let newMessageSound = document.querySelector('#newMessageSound')
let gifsBtn = document.getElementById('gifs')
let gifsPlace = document.getElementById('gifs-place')
let gifsContainer = document.querySelector('#gifs-container')
let gifsPlaceClose = document.querySelector('#gifs-place .close')
let gifsForm = document.querySelector('#gifs-place form')
let peopleConnected = document.querySelector('.peopleConnected span')
let userName = 'Anónimo'

function generateRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

function addUrls(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => {
        return `<a href="${url}" target="_blank">${url}</a>`
    })
}

function checkPeopleConnected() {
    fetch("./connections.json")
        .then((res) => res.json())
        .then((data) => {
            peopleConnected.textContent = data.connected
        })
        .catch((e) => console.log(e));
}

function fetchGifs(urlToFetch) {
    gifsContainer.innerHTML = ''
    fetch(urlToFetch)
        .then((res) => res.json())
        .then((data) => {
            data.results.forEach(result => {
                var newGifCont = document.createElement('div')
                var newGif = document.createElement('img')
                newGif.setAttribute('src', result.media[0].gif.url)

                newGifCont.appendChild(newGif)
                gifsContainer.appendChild(newGifCont)

                newGif.addEventListener('click', () => {
                    socket.emit('chat message', `<img src="${ result.media[0].gif.url }" draggable="false">`, userName)
                    gifsPlace.style.display = 'none'
                    var cont = document.createElement('div');
                    var message = document.createElement('div')
                    var nameDiv = document.createElement('div')

                    nameDiv.classList.add('name')
                    cont.classList.add('cont-msg')
                    message.classList.add('msg')

                    message.innerHTML = `<img src="${ result.media[0].gif.url }" draggable="false">`
                    nameDiv.textContent = 'Me'

                    cont.appendChild(nameDiv)
                    cont.appendChild(message)
                    messages.appendChild(cont)

                    window.scrollTo(0, document.body.scrollHeight)
                })
            })
        })
        .catch((e) => console.log(e));
}

for (var i = 0; i <= 4; i++) {
    userName = userName + generateRandom(0, 10)
    console.log(i)
    console.clear()
}

nameForm.querySelector('input').value = userName
nameForm.addEventListener('submit', e => {
    e.preventDefault()

    if (!nameForm.querySelector('input').value == '' && userName !== nameForm.querySelector('input').value) {
        userName = nameForm.querySelector('input').value

        var cont = document.createElement('div')
        var message = document.createElement('div')
        var nameDiv = document.createElement('div')
    
        nameDiv.classList.add('name')
        cont.classList.add('cont-msg')
        cont.classList.add('cont-msg-other')
        message.classList.add('msg')
    
        message.innerHTML = 'Nombre exitosamente cambiado'
        nameDiv.textContent = 'Bot (solo visible para mí)'
        message.style.background = '#333'
        message.style.color = '#fff'
    
        cont.appendChild(nameDiv)
        cont.appendChild(message)
        messages.appendChild(cont)
    
        newMessageSound.currentTime = ''
        newMessageSound.play()
    
        window.scrollTo(0, document.body.scrollHeight)
    } else {
        nameForm.querySelector('input').value = userName
    }
})

gifsForm.addEventListener('submit', e => {
    e.preventDefault()
    fetchGifs(`https://g.tenor.com/v1/search?q=${ gifsForm.querySelector('input').value }&key=LIVDSRZULELA&limit=8`)
})

form.addEventListener('submit', e => {
    e.preventDefault()
    if (input.value.trim()) {
        socket.emit('chat message', addUrls(input.value), userName)


        var cont = document.createElement('div');
        var message = document.createElement('div')
        var nameDiv = document.createElement('div')

        nameDiv.classList.add('name')
        cont.classList.add('cont-msg')
        message.classList.add('msg')

        message.innerHTML = addUrls(input.value)
        nameDiv.textContent = 'Yo'

        cont.appendChild(nameDiv)
        cont.appendChild(message)
        messages.appendChild(cont)

        window.scrollTo(0, document.body.scrollHeight)

        input.value = ''
    } else {
        input.value = ''
    }
})

document.addEventListener('mousemove', () => {

})

socket.on('chat message', (msg, name) => {
    var cont = document.createElement('div')
    var message = document.createElement('div')
    var nameDiv = document.createElement('div')

    nameDiv.classList.add('name')
    cont.classList.add('cont-msg')
    cont.classList.add('cont-msg-other')
    message.classList.add('msg')

    message.innerHTML = msg
    nameDiv.textContent = name

    cont.appendChild(nameDiv)
    cont.appendChild(message)
    messages.appendChild(cont)

    newMessageSound.currentTime = ''
    newMessageSound.play()

    window.scrollTo(0, document.body.scrollHeight)
})
socket.on('someone disconnected', () => {
    var disconnected = document.createElement('div')
    
    disconnected.classList.add('disconnected')
    
    disconnected.textContent = 'Alguien se desconectó'

    messages.appendChild(disconnected)

    newMessageSound.currentTime = ''
    newMessageSound.play()
    
    window.scrollTo(0, document.body.scrollHeight)
    checkPeopleConnected()
})
socket.on('someone connected', () => {
    var connected = document.createElement('div')
    
    connected.classList.add('connected')
    
    connected.textContent = 'Alguien se conectó'
    
    messages.appendChild(connected)
    
    newMessageSound.currentTime = ''
    newMessageSound.play()
    
    window.scrollTo(0, document.body.scrollHeight)
    checkPeopleConnected()
})
socket.on('no broadcast connected', () => {
    checkPeopleConnected()
})

gifsBtn.addEventListener('click', () => {
    gifsPlace.style.display = 'flex'
})
gifsPlaceClose.addEventListener('click', () => {
    gifsPlace.style.display = 'none'
})

fetchGifs("https://g.tenor.com/v1/trending?key=LIVDSRZULELA")
checkPeopleConnected()