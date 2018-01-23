// cards array holds all cards
let card = document.getElementsByClassName("card");
let cards = [...card]; // to make it an array for shuffling

// array for opened cards
let openedCards = [];

// declaring variable of matchedCardss
let matchedCards = document.getElementsByClassName("match");

// declaring move variable
let moves = 0;
let counter = document.querySelector(".moves");

// stars list
let starsList = document.querySelectorAll(".stars li");

// timer
let timer = document.querySelector(".timer");
let hour = 0;
let minute = 0;
let second = 0;
let interval;

// modal
let modal = document.getElementById("popup1");
let closeIcon = document.querySelector(".close");

// loop to add event listeners to each card
for (let i = 0; i < cards.length; i++) {
    console.log("Event Listener Added");
    cards[i].addEventListener("click", displayCard);
    cards[i].addEventListener("click", cardOpen);
    cards[i].addEventListener("click",congratulations);
}

// Declaration will be hoisted
function displayCard() {
    console.log("displayCard() called");
    this.classList.toggle("open");
    this.classList.toggle("show");
    this.classList.toggle("disabled");
}

// Fisher-Yates (aka Knuth) Shuffle
function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

const deck = document.querySelector(".deck");
function startGame() {
    let shuffleCards = shuffle(cards);
    for (let i = 0; i < shuffleCards.length; i++) {
        // the [] is there purely to get access to the forEach and call Array function
        // the call function will execute a function for each item in the shuffleCards Array.
        [].forEach.call(shuffleCards, function(item) {
            deck.appendChild(item);
        });

        // make sure on start all cards are reset
        cards[i].classList.remove("show", "open", "match", "disabled");
    }

    // reset moves
    moves = 0;
    counter.innerHTML = moves;

    // reset star rating
    for (let i = 0; i < starsList.length; i++) {
        starsList[i].style.color = "#FFD700";
        starsList[i].style.visibility = "visible";
    }

    // every time the game is started, the time should be reset
    timer.innerHTML = "0 mins 0 secs";
    clearInterval(interval);
}

window.onload = startGame();

//add opened cards to OpenedCards list and check if cards are match or not
function cardOpen() {
    openedCards.push(this);
    console.log("cardOpen() called: " + openedCards);
    let len = openedCards.length;
    if(len === 2){
        moveCounter();
        if(openedCards[0].type === openedCards[1].type){
            matched();
        } else {
            unmatched();
        }
    }
}

function moveCounter() {
    moves++;
    counter.innerHTML = moves;

    // setting rates based on moves
    if (moves > 8 && moves < 12){
        for(let i= 0; i < 3; i++){
            if(i > 1){
                starsList[i].style.visibility = "collapse";
            }
        }
    }
    else if (moves > 13){
        for( i= 0; i < 3; i++){
            if(i > 0){
                starsList[i].style.visibility = "collapse";
            }
        }
    }

    // start counter
    if (moves == 1) {
        startTimer();
    }
}

// for when cards match
function matched() {
    openedCards[0].classList.add("match");
    openedCards[1].classList.add("match");
    openedCards[0].classList.remove("show", "open");
    openedCards[1].classList.remove("show", "open");
    openedCards = [];
}

// for when cards don't match
function unmatched() {
    openedCards[0].classList.add("unmatched");
    openedCards[1].classList.add("unmatched");
    disable();
    setTimeout(function() {
        openedCards[0].classList.remove("show", "open", "unmatched");
        openedCards[1].classList.remove("show", "open", "unmatched");
        enable();
        openedCards = [];
    }, 1100);
}

// disable cards temporarily
function disable(){
    [].filter.call(cards, function(card) {
        card.classList.add('disabled');
    });
}

// enable cards and disable matched cards
function enable(){
    [].filter.call(cards, function(card) {
        card.classList.remove('disabled');
        for(let i = 0; i < matchedCards.length; i++) {
            matchedCards[i].classList.add("disabled"); // enable, except for matched cards
        }
    });
}

function startTimer() {
    interval = setInterval(function() {
        timer.innerHTML = minute + " mins " + second + " secs";
        second++;
        if (second == 60) {
            minute++;
            second = 0;
        }
        if (minute == 60) {
            hour++;
            minute = 0;
        }
    }, 1000);
}

function congratulations() {
    if (matchedCards.length == 16) {
        clearInterval(interval);
        let finalTime = timer.innerHTML;

        // show modal
        modal.classList.add("show");

        // declare star rating
        let starRating = document.querySelector(".stars").innerHTML;

        // showing move, rating, time on modal
        document.getElementById("finalMove").innerHTML = moves;
        document.getElementById("starRating").innerHTML = starRating;
        document.getElementById("totalTime").innerHTML = finalTime;

        // close icon on modal
        closeModal();
    }
}

function closeModal() {
    closeIcon.addEventListener("click", function() {
       modal.classList.remove("show");
       startGame();
    });
}

function playAgain() {
    modal.classList.remove("show");
    startGame();
}
