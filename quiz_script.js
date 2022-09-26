const question = document.getElementById("question");//getting the question
const choices = Array.from(document.getElementsByClassName("choice-answer"));// getting choices by changing them from an HTML collection to an array

const questionCounterText = document.getElementById("questionCounter");
const scoreText = document.getElementById("score");


let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

/*let questions = [
    {
        question: "What is an apple?",
        choice1: "a fruit",
        choice2: "a vegetable",
        choice3: "a sweet",
        choice4: "none of the above",
        answer: 1
    },
    {
        question: "What is an aeroplane?",
        choice1: "a vehicle",
        choice2: "a mode of transportation",
        choice3: "a helicoper",
        choice4: "none of the above",
        answer: 1
    },
    {
        question: "What is football?",
        choice1: "a cake shop",
        choice2: "a tv show",
        choice3: "a sport",
        choice4: "none of the above",
        answer: 3
    },
]; //hard coded questions for testing*/

let questions = [];

fetch("https://opentdb.com/api.php?amount=10")
.then((res) => {
    return res.json();
})
.then((loadedQuestions) => {
    questions = loadedQuestions.results.map((loadedQuestion) => {
        const formattedQuestion = {
            question: loadedQuestion.question,
        };

        const answerChoices = [...loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
        answerChoices.splice(
            formattedQuestion.answer - 1,
            0,
            loadedQuestion.correct_answer
        );

        answerChoices.forEach((choice, index) => {
            formattedQuestion['choice' + (index + 1)] = choice;
        });

        return formattedQuestion;
    });
    startGame();
})
.catch((err) => {
    console.error(err);
});

const correct_Bonus = 1;//points for attempting the question correctly
const max_questions = 5;



getNewQuestion = () =>{ // arrow style functions gives us more concise way of writing a function
    
    if(availableQuestions.length === 0 || questionCounter>=max_questions){

        localStorage.setItem("mostRecentScore" , score);//to store on the local storage so that we can access this in the ending page js file

        //we then go to the end page where we see the score
        return window.location.assign("end.html");
    }
    
    questionCounter++;// to increase the counter to go to the next question index
    questionCounterText.innerText = questionCounter + "/" + max_questions;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);// we get an index between 0,1 and 2 as Math.random() gives a value from 0 to 1 and we use floor function to get it to an integer
    currentQuestion = availableQuestions[questionIndex]; // picks one index and the correspopnding question to make it as the question currently being attempted
    question.innerText = currentQuestion.question;// get the actual question's text into the options

    choices.forEach(choice => {
        const number = choice.dataset["number"];// we will use this to identify the option number from the HTML file to compare and apply the value in the JS file
        choice.innerText = currentQuestion["choice" + number];// gets the choice1/2/3 from the locally written questions
    });

    availableQuestions.splice(questionIndex,1);//to remove the question that we have just attempted, this will remove it out of the array
    acceptingAnswers = true;
};

startGame = () => {
    questionCounter = 0;// we start with 0 questions
    score = 0 ;//score initially stays at zero
    availableQuestions = [...questions];//spread operator --> spreads out each item and puts them in a new array
    getNewQuestion();// gets us the next question
};

choices.forEach(choice =>{//we run a for loop to go through each choices in the question
    choice.addEventListener("click" , e=>{
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];
        
        const classToApply = (selectedAnswer == currentQuestion.answer) ?  "correct" : "incorrect" ; //we will give class a default value of incorrect then update to correct if the option chosen is write

        if(classToApply === "correct"){
            incrementScore(correct_Bonus);
        }


        console.log(classToApply); // we put the double equal to check for comparison only === will also check the data type which is obviously different
        
        selectedChoice.parentElement.classList.add(classToApply); //it will select the container in the html document and add the correct class to it
        
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
          }, 1000);//we add a timeout to not let the class be added and removed quickly so that the color stays for 1000ms and after timeout we move to the next question

    });
});

incrementScore = num =>{
    score+=num;
    scoreText.innerText = score + "/" + max_questions ;
}

    

