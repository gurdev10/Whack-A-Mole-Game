//New concept: Storing setTimeout Id and clearing it using clearTimeout(Id);
//New concept: touchstart for phones.
//New concept: setInterval(function, millisecond); clearInterval(Id);

var holeCount = 8;

var moles = ["num0"];

for (var i = 1; i < holeCount; i++) {
    $("#board").append(`
        <div class="hole">
            <img class="topImage" src="./images/holeTop.jpg" alt="">
            <div class="bottom">
                <img class="mole" id="num`+ i + `" src="./images/beforeMole.png" alt="">
                <img class="bottomImage" src="./images/holeBottom.jpg" alt="">
            </div>
        </div>
    `);
    moles.push("num" + i);
}

var sounds = {
    pop: new Audio("./sounds/pop.mp3"),
    hit: new Audio("./sounds/hit.mp3"),
    whoosh: new Audio("./sounds/whoosh.mp3"),
    bell: new Audio("./sounds/bell.mp3"),
    click: new Audio("./sounds/click.mp3")
};

var lastMole;

function randomMole() {
    var mole;
    do {
        var index = Math.floor(Math.random() * moles.length);
        mole = moles[index];
    } while (mole === lastMole);

    lastMole = mole;
    return mole;
}

var started = false;

var currentMole;

var moleTimeout;

var score = 0;

var timeLeft = 30;
var timerInterval;
var speed = 0;

var gameOver = false;

function getUpDelay() {
    return Math.max(300, 1000 - speed * 65);
}

function getDownDelay() {
    return Math.max(400, 1000 - speed * 55);
}

function attachStartListener() {
    if (!started || gameOver) {
        $(".heading").html("<span id='score'>Score : " + score + "</span><span id='time'>Time : " + timeLeft + "</span>");
        started = true;
        startTimer();
        setTimeout(moveMole, getUpDelay());
    }
}

$(document).one("keydown pointerdown", function () {
    playSound("click");
    attachStartListener();
});

function moveMole() {

    if (gameOver) return;

    clearTimeout(moleTimeout);

    currentMole = randomMole();
    $(".mole").attr("src", "./images/beforeMole.png");
    $("#" + currentMole).addClass("active").animate({ top: "-155%" });
    playSound("pop");

    moleTimeout = setTimeout(function () {

        if (gameOver) return;

        $("#" + currentMole).animate({ top: "0%" });
        playSound("whoosh");
        moleTimeout = setTimeout(moveMole, getUpDelay());
    }, getDownDelay());
}


$(".mole").on("pointerdown", function (e) {

    e.preventDefault();
    if (!started || gameOver) return;

    if ($(this).attr("id") === currentMole && $(this).hasClass("active")) {
        $(this).removeClass("active");
        clearTimeout(moleTimeout);
        $(this).attr("src", "./images/afterMole.png");
        $(this).animate({ top: "0%" });
        playSound("hit");
        score++;
        $(".heading").html("<span id='score'>Score : " + score * 10 + "</span><span id='time'>Time : " + timeLeft + "</span>");
        moleTimeout = setTimeout(moveMole, getUpDelay());
    }
});

function playSound(name) {
    if (!sounds[name]) return;
    sounds[name].currentTime = 0;
    sounds[name].play();
}

function startTimer() {
    timerInterval = setInterval(function () {
        if (timeLeft % 3 === 0) speed++;
        timeLeft--;
        $("#time").text("Time : " + timeLeft);
        if (timeLeft === 0) {
            clearInterval(timerInterval);
            playSound("bell");
            endGame();
        }
    }, 1000);
}

function resetAll() {
    timeLeft = 30;
    gameOver = false;
    started = false;
    speed = 1;

    clearTimeout(moleTimeout);
    clearInterval(timerInterval);

    $(".mole").attr("src", "./images/beforeMole.png");
    $(".mole").removeClass("active").animate({ top: "0%" });
}

function endGame() {
    resetAll();

    $("#game").addClass("restart1");
    $("#re-box").addClass("index");
    $("#re-box span:nth-child(2)").text("Score : " + score * 10);
}

function resetGame() {
    score = 0;
    resetAll();

    $("#game").removeClass("restart1");
    $("#re-box").removeClass("index");
    $(".heading").html("<span id='score'>Score : " + score + "</span><span id='time'>Time : " + timeLeft + "</span>");

    attachStartListener();
}

$("#re-box span:nth-child(3)").on("pointerdown", function () {
    playSound("click");
    resetGame();
});

$(".cross").on("pointerdown", function (e) {

    e.preventDefault();
    e.stopPropagation();
    playSound("click");

    score = 0;
    resetAll();

    $("#game").removeClass("restart1");
    $("#re-box").removeClass("index");
    $(".heading").html("<span>PRESS ANY KEY OR TOUCH TO START THE GAME</span>");
    $(document).one("keydown pointerdown", function () {
        playSound("click");
        attachStartListener();
    });
});
