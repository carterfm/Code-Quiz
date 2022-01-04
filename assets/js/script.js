//Defining variables to keep track of html elements I want to dynamically 
//hide and reveal using web API shenanigans
var headerEl = document.querySelector("header");
var welcomeEl = document.querySelector("#welcome-screen");
var quizEl = document.querySelector("#quiz-screen");
var endEl = document.querySelector("#end-screen");
var highScoreEl = document.querySelector("#high-scores");
var highScoreListEl = document.querySelector("#score-list");
var feedbackEl = document.querySelector("#answer-feedback");

var questionEl = document.querySelector("#question");
var answersEl = document.querySelector("#quiz-answers")
var answer1El = document.querySelector("#answer1");
var answer2El = document.querySelector("#answer2");
var answer3El = document.querySelector("#answer3");
var answer4El = document.querySelector("#answer4");
//This array exists for the sake of convenience; I use it in a function later in this file.
var quizScreenEls = [questionEl, answer1El, answer2El, answer3El, answer4El];

//variables for the header elements
//Change this to target specific elements
var highScoreLinkEl = document.querySelector("#score-link");
var countdownEl = document.querySelector("#countdown");
var finalScoreEl = document.querySelector("#final-score");


//variables for buttons and input field 
var startButtonEl = document.querySelector("#start-button");
var inputEl = document.querySelector("initials");

//variables for tracking data necessary to the functioning of the app
//Starting value of our timer for our quiz
var timeLeft = 75;
countdownEl.textContent = timeLeft;
//Variable to track whether we're done with the quiz or not
var isPlaying = false;
//variable to track which question/answer set we should display once the quiz has started
var questionIndex = 0;



//So, we need to keep track of which answer is true and which one is false, huh
//How can we do that?
//My idea: ise an array of objects.
var questions = [{question: "Commonly used data types DO NOT include:", answer1: "strings", answer2: "booleans", answer3: "alerts", answer4: "numbers", correctAnswer: "alerts"}, 
{question: "The condition in an if/else statement is enclosed within ___.", answer1: "quotation marks", answer2: "curly braces", answer3: "parentheses", answer4: "square brackets", correctAnswer: "parentheses"},  
{question: "Arrays in JavaScript can be used to store ___.", answer1: "numbers and strings", answer2: "other arrays", answer3: "booleans", answer4: "all of the above", correctAnswer: "all of the above"},
{question: "___ is a very useful tool for debugging which prints content to the screen.", answer1: "JavaScript", answer2: "the terminal/bash", answer3: "for loops", answer4: "the console log", correctAnswer: "the console log"}, 
{question: "String values must be enclosed within ___ in JavaScript.", answer1: "quotation marks", answer2: "curly braces", answer3: "parentheses", answer4: "square brackets", correctAnswer: "quotation marks"}
];

//By default, when you open the webpage, everything but the header and welcome sections should be hidden
//We'll package those instructions in a function so we can call it again when returning after finishing a quiz
function displayWelcome(){
    headerEl.setAttribute("style", "display: flex");
    welcomeEl.setAttribute("style", "display: block");

    quizEl.setAttribute("style", "display: none");
    endEl.setAttribute("style", "display: none");
    highScoreEl.setAttribute("style", "display: none");
    feedbackEl.setAttribute("style", "display: none");

    timeLeft = 75;
    countdownEl.textContent = timeLeft;
}


//Functions to be called by our event listeners

function displayQuiz(){
    quizEl.setAttribute("style", "display: block");
    welcomeEl.setAttribute("style", "display: none");
    //I don't want the player to click away to view high scores in the middle of a quiz
    //I can remove this line if the professor would like that to be possible
    highScoreLinkEl.setAttribute("style", "display: none");
    isPlaying = true;
    displayQuestions()
    startQuizTimer();
}

function displayQuestions(){
    if(questionIndex < questions.length) {
        for(var i = 0; i < quizScreenEls.length; i++) {
            /*console.log(quizScreenEls[i]);
            console.log(quizScreenEls[i].id);*/
            quizScreenEls[i].textContent = questions[questionIndex][quizScreenEls[i].id]
        }
        questionIndex++;
    } else {
        endQuiz();
    }
}

function endQuiz(){
    isPlaying = false;
    quizEl.setAttribute("style", "display: none");
    endEl.setAttribute("style", "display: block");
    finalScoreEl.textContent = timeLeft;
    timeLeft = 75;
    questionIndex = 0;
}

function displayHighScores(){
    //Some of these are redundant, given when this function is called, but I just want to cover all our bases.
    headerEl.setAttribute("style", "display: none");
    welcomeEl.setAttribute("style", "display: none");
    quizEl.setAttribute("style", "display: none");
    endEl.setAttribute("style", "display: none");
    feedbackEl.setAttribute("style", "display: none");

    highScoreEl.setAttribute("style", "display: block");
}

//TODO: find out how to check for isPlaying being set to false more frequently than once
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

function clearHighScores(){
    console.log("clearHighScores called");
    console.log(highScoreListEl.children.length);
    var scoreLength = highScoreListEl.children.length
    for(var i = 0; i < scoreLength; i++) {
        //removing the first element length times gives you no remaining elements
        console.log("Removing first element of highScoreListEl.children");
        highScoreListEl.children[0].remove();
    }
}

//Event listeners for various events
startButtonEl.addEventListener("click", displayQuiz);
highScoreLinkEl.addEventListener("click", displayHighScores);

//Listener to check for clicks on answers page
answersEl.addEventListener("click", function(event){
    var element = event.target;
    
    if (element.matches("li")) {
        displayQuestions();
    }
})

//Listener to check for clicks on buttons on High Scores page;
highScoreEl.addEventListener("click", function(event){
    var element = event.target;

    if(element.id === "go-back") {
        displayWelcome();
    } else if(element.id === "clear-scores") {
        clearHighScores();
    }
})


displayWelcome();