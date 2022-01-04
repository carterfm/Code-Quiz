//Defining variables to keep track of html elements I want to dynamically 
//hide and reveal using web API shenanigans
var headerEl = document.querySelector("header");
var highScoreLinkEl = document.querySelector("#score-link");
var countdownEl = document.querySelector("#countdown");

var welcomeEl = document.querySelector("#welcome-screen");

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



//variables for the header elements
//Change this to target specific elements


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
//each score is going to be an array in the form ["initials", scoreNumber]
//Might change this to an object instead of an array of arrays if Louis suggests as much
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

function storeHighScores(){
    localStorage.setItem("highScores", JSON.stringify(highScores));
}
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
    questionIndex = 0;
}

/*function displayFeedback(){

}*/

function displayHighScores(){
    headerEl.setAttribute("style", "display: none");
    welcomeEl.setAttribute("style", "display: none");
    quizEl.setAttribute("style", "display: none");
    endEl.setAttribute("style", "display: none");
    feedbackEl.setAttribute("style", "display: none");

    //First, emptying our highScoreListEl to make sure we don't double-print scores
    highScoreListEl.innerHTML = "";

    //Next, actually displaying the 
    for(var i = 0; i < highScores.length; i++) {
        var li = document.createElement("li");
        //lis will be of the form initials - scorenumber
        li.textContent = highScores[i][0] + " - " + highScores[i][1];
        
        highScoreListEl.appendChild(li);
    }

    if(isPlaying) {
        //This is to make sure the timer gets stopped if the player exits the quiz 
        //by checking the high scores
        isPlaying = false;
    }

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
    highScores = [];
    storeHighScores();
    displayHighScores();
}

//This is going to be an ordered list, right? So we need
//Each score is going to be an array con
function addNewScore(playerName){
    console.log("addNewScore called");
    //Setting the score number equal to timeLeft, then resetting timeLeft to its initial value
    var scoreNum = timeLeft;
    timeLeft = 75;
    //The array we'll put into our array of initials - score pairs
    var scorePair = [playerName, scoreNum];
    var scoresLength = highScores.length;
    //Now to actually add in our new score in the appropriate spot!
    //First we'll deal with the case where highScores is empty; then we'll
    if(scoresLength === 0) {
        highScores.push(scorePair);
    } else {
        for(var i = 0; i < scoresLength; i++) {
            if(scoreNum > highScores[i][1]) {
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

//Listener to check for form submission on quiz end screen
//How can we make the submit event (very evil) get along with the rest of this?
initialsFormEl.addEventListener("submit", function(event){
    console.log("Submitted initialsFormEl");
    event.preventDefault();
    var inputtedInitials = initialsEl.value.trim();
    //do nothing if the player hasn't input initials
    if (inputtedInitials === "") {
        console.log("I swear to God almighty if you don't input actual initials it'll be seven stripes across the ass");
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