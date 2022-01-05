//Defining variables to keep track of html elements I want to dynamically 
//hide and reveal using web API shenanigans
var headerEl = document.querySelector("header");
var highScoreLinkEl = document.querySelector("#score-link");
var countdownEl = document.querySelector("#countdown");

var welcomeEl = document.querySelector("#welcome-screen");
var startButtonEl = document.querySelector("#start-button");

var quizEl = document.querySelector("#quiz-screen");
var questionEl = document.querySelector("#question");
var answersEl = document.querySelector("#quiz-answers")
var answer1El = document.querySelector("#answer1");
var answer2El = document.querySelector("#answer2");
var answer3El = document.querySelector("#answer3");
var answer4El = document.querySelector("#answer4");
//This array exists for the sake of convenience; I use it in a function later in this file.
var quizScreenEls = [questionEl, answer1El, answer2El, answer3El, answer4El];

var endEl = document.querySelector("#end-screen");
var finalScoreEl = document.querySelector("#final-score");
var initialsFormEl = document.querySelector("#initials-form");
var initialsEl = document.querySelector("#initials")

var highScoreEl = document.querySelector("#high-scores-screen");
var highScoreListEl = document.querySelector("#score-list");

var feedbackEl = document.querySelector("#answer-feedback");

//variables for tracking data necessary to the functioning of the app
//Starting value of our timer for our quiz
var timeLeft = 75;
//Variable to track whether we're done with the quiz or not
var isPlaying = false;
//variable to track which question/answer set we should display once the quiz has started
var questionIndex = 0;
//each score is going to be an object in the form {initials: "initials", score: scoreNumber}
var highScores = [];

//So, we need to keep track of which answer is true and which one is false, huh
//How can we do that?
//My idea: ise an array of objects.
var questions = [{question: "Commonly used data types DO NOT include:", answer1: "strings", answer2: "booleans", answer3: "alerts", answer4: "numbers", correctAnswer: "alerts"}, 
{question: "The condition in an if/else statement is enclosed within ___.", answer1: "quotation marks", answer2: "curly braces", answer3: "parentheses", answer4: "square brackets", correctAnswer: "parentheses"},  
{question: "Arrays in JavaScript can be used to store ___.", answer1: "numbers and strings", answer2: "other arrays", answer3: "booleans", answer4: "all of the above", correctAnswer: "all of the above"},
{question: "___ is a very useful tool for debugging which prints content to the screen.", answer1: "JavaScript", answer2: "the terminal/bash", answer3: "for loops", answer4: "the console log", correctAnswer: "the console log"}, 
{question: "String values must be enclosed within ___ in JavaScript.", answer1: "quotation marks", answer2: "curly braces", answer3: "parentheses", answer4: "square brackets", correctAnswer: "quotation marks"}
];

//function to be called when page is first loaded
//Sets high scores equal to the local storage's tracked high scores
function initialize(){
    var storedHighScores = JSON.parse(localStorage.getItem("highScores"));
    
    if (storedHighScores !== null) {
        highScores = storedHighScores;
    } 

    displayWelcome();
}

// Functions pertaining to displaying and hiding elements on the page
function displayWelcome(){
    headerEl.setAttribute("style", "display: flex");
    welcomeEl.setAttribute("style", "display: block");

    quizEl.setAttribute("style", "display: none");
    endEl.setAttribute("style", "display: none");
    highScoreEl.setAttribute("style", "display: none");
    feedbackEl.setAttribute("style", "display: none");

    timeLeft = 75;
    questionIndex = 0;
    countdownEl.textContent = timeLeft;
}

function displayQuiz(){
    quizEl.setAttribute("style", "display: block");
    welcomeEl.setAttribute("style", "display: none");

    isPlaying = true;
    displayQuestions()
    startQuizTimer();
}

//We handle iterating questionIndex up in our check for clicks on the answer elements, not here
function displayQuestions(){
    if(questionIndex < questions.length) {
        for(var i = 0; i < quizScreenEls.length; i++) {
            quizScreenEls[i].textContent = questions[questionIndex][quizScreenEls[i].id]
        }
    } else {
        endQuiz();
    }
}

function endQuiz(){
    isPlaying = false;
    quizEl.setAttribute("style", "display: none");
    endEl.setAttribute("style", "display: block");
    finalScoreEl.textContent = timeLeft;
}

//feedbackEl will be rendered with a different message depending on whether or not the 
//answer chosen was correct
function displayFeedback(correct){
    if(correct){
        feedbackEl.textContent = "Correct!";
    } else {
        feedbackEl.textContent = "Wrong!";
    }

    feedbackEl.setAttribute("style", "display: block");

    //The feedback message goes back to being hidden after being on the screen for one second
    setTimeout(function(){
        feedbackEl.setAttribute("style", "display: none");
    }, 1000);
}

function displayHighScores(){
    //Depending on whether the user got to the high scores page from the welcome screen, the quiz screen,
    // or the end screen of the quiz, one of these is going to be redundant, but that should be OK.
    headerEl.setAttribute("style", "display: none");
    welcomeEl.setAttribute("style", "display: none");
    quizEl.setAttribute("style", "display: none");
    endEl.setAttribute("style", "display: none");

    //First, emptying our highScoreListEl to make sure we don't double-print scores
    highScoreListEl.innerHTML = "";

    console.log(highScores);
    //Next, actually building up the list that will appear under highScoreListEl
    for(var i = 0; i < highScores.length; i++) {
        var li = document.createElement("li");
        //lis will be of the form initials - scorenumber
        li.textContent = highScores[i].initials + " - " + highScores[i].score;
        
        highScoreListEl.appendChild(li);
    }

    if(isPlaying) {
        //This is to make sure the quiz timer gets stopped if the player exits the quiz 
        //by checking the high scores
        isPlaying = false;
    }

    highScoreEl.setAttribute("style", "display: block");
}

//Function that manages the quiz timer while the game is being played
//Featuress two intervals: one that decrements the timer readout by one every second, and another that
//checks every millisecond to see if the quiz has been finished by another means and stop the timer
//from further decrementing if so.
function startQuizTimer(){
    var quizTimer = setInterval(function(){
        timeLeft--;
        countdownEl.textContent = timeLeft;

        if(timeLeft === 0){
            clearInterval(quizTimer);
            clearInterval(playingCheck);
            endQuiz();
            //call a function moving us on to the next section of the game
        }
    }, 1000);
    //A second interval to check if the player has finished the quiz before the timer runs out
    //And stop the timer from ticking down any further
    var playingCheck = setInterval(function(){
        if(!isPlaying){
            clearInterval(quizTimer);
            clearInterval(playingCheck);
        }
    }, 1);
} 

//Clears highscores on both the high scores page and in local storage
function clearHighScores(){
    highScores = [];
    storeHighScores();
    displayHighScores();
}

//Adds a new score object (and initials/score pair) into the highScore array, sorted based on 
//the score value.
function addNewScore(playerName){
    //Setting the score number equal to timeLeft, then resetting timeLeft to its initial value
    var scoreNum = timeLeft;
    timeLeft = 75;
    //Defining the initials: score pair to be added to highScores
    var scorePair = {initials: playerName, score: scoreNum};
    var scoresLength = highScores.length;
    //Now to actually add in our new score in the appropriate spot!
    //First we'll deal with the case where highScores is empty; then we'll
    if(scoresLength === 0) {
        highScores.push(scorePair);
    } else {
        for(var i = 0; i < scoresLength; i++) {
            if(scorePair.score > highScores[i].score) {
                highScores.splice(i, 0, scorePair);
                break;
            } else if (i === scoresLength - 1) {
                //If the new score isn't greater than any score in highScores, we just add it on to the
                //end of the array
                highScores.push(scorePair)
            }        
        }
    }
    storeHighScores();
}

//updating highScores in local storage
function storeHighScores(){
    localStorage.setItem("highScores", JSON.stringify(highScores));
}

//Event listeners for various events
startButtonEl.addEventListener("click", displayQuiz);
highScoreLinkEl.addEventListener("click", displayHighScores);

//Checking for clicks on answers on quiz page
answersEl.addEventListener("click", function(event){
    var element = event.target;
    
    if (element.matches("li")) {
        if (element.textContent === questions[questionIndex].correctAnswer){
            displayFeedback(true);
        } else {
            displayFeedback(false);
            //Decrements timer down by 10 seconds for each incorrect answer
            timeLeft -= 10;
            //Putting this here to make sure the timer is updated one last time before the quiz ends
            //In the case that this else is triggered on the last question of the quiz
            countdownEl.textContent = timeLeft;
        }
        questionIndex++;
        displayQuestions();
    }
})

//Listener to check for form submission on quiz end screen
initialsFormEl.addEventListener("submit", function(event){
    event.preventDefault();
    var inputtedInitials = initialsEl.value.trim();
    initialsEl.value = "";
    //do nothing if the user hasn't input initials
    if (inputtedInitials === "") {
        return;
    }
    addNewScore(inputtedInitials);
    displayHighScores();
});

//Listener to check for clicks on buttons on High Scores page;
highScoreEl.addEventListener("click", function(event){
    var element = event.target;

    if(element.id === "go-back") {
        displayWelcome();
    } else if(element.id === "clear-scores") {
        clearHighScores();
    }
})


initialize();