// Registration

const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');
const registrationForm = document.querySelector('.registration');

const scoreBoard = document.querySelector('.score');
const levelBoard = document.querySelector('.level');
const countdownBoard = document.querySelector('.countdown');
const monster = document.querySelector('.monster');
const startBtn = document.querySelector('.startBtn');
const nextBtn = document.querySelector('.nextBtn');
const restartBtn = document.querySelector('.restartBtn');
const modal = document.querySelector('.modal');
const modalDescription = document.querySelector('.modal_description');
const modalTitle = document.querySelector('.modal_title');
const wrapper = document.querySelector('.wrapper');

let error = false;



function checkInputs() {
    // trim to remove the whitespaces
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const password2Value = password2.value.trim();

    if (usernameValue === '') {
        setErrorFor(username, 'Username cannot be blank');
    } else {
        setSuccessFor(username);
    }

    if (emailValue === '') {
        setErrorFor(email, 'Email cannot be blank');
    } else if (!isEmail(emailValue)) {
        setErrorFor(email, 'Not a valid email');
    } else {
        setSuccessFor(email);
    }

    if (passwordValue === '') {
        setErrorFor(password, 'Password cannot be blank');
    } else {
        setSuccessFor(password);
    }

    if (password2Value === '') {
        setErrorFor(password2, 'Password2 cannot be blank');
    } else if (passwordValue !== password2Value) {
        setErrorFor(password2, 'Passwords does not match');
    } else {
        setSuccessFor(password2);
    }
}

function setErrorFor(input, message) {
    error = true;
    const formControl = input.parentElement;
    const small = formControl.querySelector('small');
    formControl.className = 'form-control error';
    small.innerText = message;
}

function setSuccessFor(input) {
    error = false;
    const formControl = input.parentElement;
    formControl.className = 'form-control success';
}

function isEmail(email) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}

form.addEventListener('submit', e => {
    e.preventDefault();

    checkInputs();
    if (error == false) {
        registrationForm.classList.add('hidden');
        startBtn.classList.remove('hidden');

    }
});


// Game

let timeUp = false;
let timeLimit = 20000;
let score = 0;
let countdown;
let level = 1;

function startGame() {
    renderMonsterAndBackground(level);
    scoreBoard.classList.remove('hidden');
    monster.classList.remove('hidden');
    showRestartBtn();
    countdown = timeLimit / 1000;
    scoreBoard.textContent = 0;
    scoreBoard.style.display = 'block';
    countdownBoard.textContent = countdown;
    levelBoard.textContent = level;
    timeUp = false;
    score = 0;
    startBtn.classList.add('hidden');
    setTimeout(function () {
        timeUp = true;
    }, timeLimit);
    const startCountdown = () => {
        setInterval(function () {
            countdown -= 1;
            countdownBoard.textContent = countdown;
            if (countdown < 0) {
                countdown = 0;
                clearInterval(startCountdown);
                countdownBoard.textContent = 'Times Up';
            }
        }, 1000);
    };
    startCountdown();


    restartBtn.addEventListener('click', restart);

    nextBtn.addEventListener('click', nextLevel);

    monster.addEventListener('click', () => {
        if (countdown !== 0) {
            hit();
        }
        if (countdown == 0) {
            showModal("Ops!", "Looks like you out of time");
            hideNextLevelBtn();
            showRestartBtn();
        }
    });


    function showModal(messageTitle, messageDesc) {
        modal.classList.remove('hidden');
        modalTitle.innerHTML = messageTitle;
        modalDescription.innerHTML = messageDesc;
    }

    function hideModal() {
        modal.classList.add('hidden');
        modalDescription.innerHTML = '';
    }
    function showRestartBtn() {
        restartBtn.classList.remove('hidden');
    }
    function hideRestartBtn() {
        restartBtn.classList.add('hidden');
    }
    function showNextLevelBtn() {
        nextBtn.classList.remove('hidden');
    }
    function hideNextLevelBtn() {
        nextBtn.classList.add('hidden');
    }
    function rerenderScoreAndLevel(level, score) {
        levelBoard.textContent = level;
        scoreBoard.textContent = score;
    }
    function renderMonsterAndBackground(levelForAdding, levelForRemove) {
        monster.classList.add(`monster${levelForAdding}`);
        monster.classList.remove(`monster${levelForRemove}`);
        wrapper.classList.add(`level${levelForAdding}`);
        wrapper.classList.remove(`level${levelForRemove}`);
    }

    function hit(e) {
        score++;
        scoreBoard.textContent = score;
        if (score === 10) {
            showModal("Congratulation", "You win");
            showNextLevelBtn();
        }

        console.log(score);
    }
    function restart() {
        hideModal();
        score = 0;
        timeUp = false;
        level--;
        if (level <= 1) {
            level = 1;
        }
        startCountdown();
        rerenderScoreAndLevel(level, score);
        console.log("restart", level);
        renderMonsterAndBackground(level, level + 1);
    }
    function nextLevel() {
        countdown = timeLimit / 1000;
        score = 0;
        level++;

        if (level < 6) {
            hideModal();
            rerenderScoreAndLevel(level, score);
            renderMonsterAndBackground(level, level - 1);
        } else {
            showModal("Thats All", "Thank you for playing");
            hideNextLevelBtn();
            hideRestartBtn();
            console.log("done");
        }

    }
}
startBtn.addEventListener('click', startGame);


