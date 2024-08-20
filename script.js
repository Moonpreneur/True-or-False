const draggablesContainer = document.getElementById('draggablesContainer');
const dropzones = document.querySelectorAll('.dropzone');
const scoreDisplay = document.getElementById('score');
const gameContainer = document.getElementById('gameContainer');
const gameOverContainer = document.getElementById('gameOverContainer');
const finalScore = document.getElementById('finalScore');
const gameImage = document.querySelector('.game-image');
let score = 0;
let gameStarted = false;
let timer;
let timeLeft = 120;

const correctSound = document.getElementById('correctSound');
const incorrectSound = document.getElementById('incorrectSound');
const winnAudio = new Audio('winn.mp3');

const correctAnswers = {
    item1: 'trueZone',
    item2: 'trueZone',
    item3: 'trueZone',
    item4: 'falseZone',
    item5: 'falseZone',
    item6: 'trueZone',
    item7: 'falseZone',
    item8: 'falseZone',
};

let questions = [
    { id: 'item1', text: '18 x 15 = 270' },
    { id: 'item2', text: '565 ÷ 5 = 113' },
    { id: 'item3', text: '865 - 465 = 400' },
    { id: 'item4', text: '678 + 657 = 1387' },
    { id: 'item5', text: '657- 457 = 223' },
    { id: 'item6', text: '15 x 5 = 75 ' },
    { id: 'item7', text: '252 ÷ 2 = 128 ' },
    { id: 'item8', text: '345 + 456 = 809' },
];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startReset() {
    if (!gameStarted) {
        gameStarted = true;
        gameContainer.style.display = 'block';
        gameImage.style.display = 'none';
        shuffleArray(questions);
        createDraggableItems();
        document.getElementById('startreset').textContent = 'Reset Game';
        startTimer();
    } else {
        resetGame();
    }
}

function resetGame() {
    gameStarted = false;
    clearInterval(timer);
    score = 0;
    timeLeft = 120;
    scoreDisplay.textContent = score;
    draggablesContainer.innerHTML = '';
    gameContainer.style.display = 'none';
    gameImage.style.display = 'block';
    document.getElementById('startreset').textContent = 'Start Game';
    document.getElementById('time').textContent = '02:00';
    gameOverContainer.style.display = 'none';
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timer);
            gameOver();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('time').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function gameOver() {
    gameContainer.style.display = 'none';
    gameOverContainer.style.display = 'block';
    finalScore.textContent = score;
    winnAudio.play(); 
}

function createDraggableItems() {
    draggablesContainer.innerHTML = ''; 
    questions.forEach(question => {
        const draggableItem = document.createElement('div');
        draggableItem.classList.add('draggable');
        draggableItem.setAttribute('draggable', 'true');
        draggableItem.setAttribute('id', question.id);
        draggableItem.innerHTML = question.text;
        draggablesContainer.appendChild(draggableItem);
    });

    addDragAndDropListeners();
}

function addDragAndDropListeners() {
    const draggables = document.querySelectorAll('.draggable');
    const placeholders = document.querySelectorAll('.placeholder');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', dragStart);
        draggable.addEventListener('dragend', dragEnd);
    });

    placeholders.forEach(placeholder => {
        placeholder.addEventListener('dragover', dragOver);
        placeholder.addEventListener('dragenter', dragEnter);
        placeholder.addEventListener('dragleave', dragLeave);
        placeholder.addEventListener('drop', dragDrop);
    });
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    setTimeout(() => e.target.classList.add('invisible'), 0);
}

function dragEnd(e) {
    e.target.classList.remove('invisible');
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
    e.target.classList.add('over');
}

function dragLeave(e) {
    e.target.classList.remove('over');
}

function dragDrop(e) {
    const id = e.dataTransfer.getData('text');
    const draggable = document.getElementById(id);
    const correctZone = correctAnswers[id];
    const dropzone = e.target.closest('.dropzone');
    const placeholder = e.target;

    if (!placeholder.querySelector('.draggable')) {
        placeholder.appendChild(draggable);
        placeholder.classList.remove('over');

        const dropzoneId = dropzone.id;

        if (dropzoneId === correctZone) {
            score += 1;
            correctSound.play();
        } else {
            score -= 1;
            incorrectSound.play();
        }
        scoreDisplay.textContent = score;

        const remainingDraggables = draggablesContainer.querySelectorAll('.draggable');
        if (remainingDraggables.length === 0) {
            clearInterval(timer); 
            gameOver(); 
        }
    }
}

document.getElementById('checkAnswer').addEventListener('click', () => {
    let allCorrect = true;
    const placeholders = document.querySelectorAll('.placeholder');
    placeholders.forEach(placeholder => {
        const draggable = placeholder.querySelector('.draggable');
        if (draggable) {
            const dropzoneId = placeholder.closest('.dropzone').id;
            const correctZone = correctAnswers[draggable.id];
            if (dropzoneId !== correctZone) {
                allCorrect = false;
            }
        }
    });

    if (allCorrect) {
        alert('All answers are correct!');
    } else {
        alert('Some answers are incorrect. Try again!');
    }
});
