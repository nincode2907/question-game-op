import questions from "./questions.js";

const fruits = document.querySelectorAll(".fruit");
const questionSection = document.querySelector(".questionSection");
const countDownTime = document.querySelector(".time_count");
const rankItems = document.querySelectorAll(".list_item");
const teams = document.querySelectorAll(".list_item_nameTeam");
const rankHeading = document.querySelector(".rank_heading");
const addPoint = document.querySelector(".addPoint");
const devilFruit = document.querySelector(".devilFruit")
const timer = document.querySelector(".time")

// const questions = [];
const questionSelected = [];
const teamTurned = [];
const rankPosition = [60, 88, 116, 144];
const delay = 25;
var winner = "";
var highestPoint = 0;
var ranTeam = 0;
var isInQuestion = false, isOver = false;
var timeDown;

setTimeout(() => {
    devilFruit.style.opacity = 1;
}, 4000);

fruits.forEach((f, index) =>{
    f.addEventListener("click",async (index) =>{
        if(isInQuestion) 
            return;
        else isInQuestion = true;
        let ranNum;

        do{
            ranNum = Math.floor(Math.random()* questions.length);
        } while(questionSelected.includes(ranNum));

        questionSelected.push(ranNum);
        if(questionSelected.length == questions.length) isOver = true;
        
        if(!questions[ranNum].question.includes("lucky") && !questions[ranNum].question.includes("failed")) {
            let html = `<div class="question">
                            <h2 class="questionSection_question">
                                <Strong class="questionSection_question_content"></Strong>
                            </h2>
                            <div class="questionSection_answers">
                                <div>
                                    <span class="questionSection_answer">
                                        <span class="questionSection_answer_capLetter">A.</span>
                                        <span class="questionSection_answer_content">${questions[ranNum].answers[0]}</span>
                                    </span>
                                    <br>
                                    <span class="questionSection_answer">
                                        <span class="questionSection_answer_capLetter">B.</span>
                                        <span class="questionSection_answer_content">${questions[ranNum].answers[1]}</span>
                                    </span>
                                    <br>
                                    <span class="questionSection_answer">
                                        <span class="questionSection_answer_capLetter">C.</span>
                                        <span class="questionSection_answer_content">${questions[ranNum].answers[2]}</span>
                                    </span>
                                    <br>
                                    <span class="questionSection_answer">
                                        <span class="questionSection_answer_capLetter">D.</span>
                                        <span class="questionSection_answer_content">${questions[ranNum].answers[3]}</span>
                                    </span>
                                </div>
                                <span class="correct_png"></span>
                                <img src="./assets/img/person/${f.alt}.png" alt="${f.alt}" class="questionSection_answers_img">
                            </div>
                    </div>`
            questionSection.innerHTML = html;
            const answer = document.querySelector(".questionSection_question_content");
            for(let i = 1; i<= questions[ranNum].question.length;i++) {
                await Sleep(delay);
                answer.innerHTML = questions[ranNum].question.substring(0, i);
            }

            let count = 45;
            timeDown = setInterval(() => {
                if(count==0) 
                    clearInterval(timeDown);
                countDownTime.innerHTML = count--;
            },1000)

            const correctSpan = document.querySelector(".correct_png");
            const answers = document.querySelectorAll(".questionSection_answer_content");
            let indexCorrect;
            answers.forEach((a,index) => {
                if(a.innerHTML == questions[ranNum].correctAnswer) indexCorrect=index;
            })
            const correctAnswer = answers[indexCorrect];
            document.querySelector(".questionSection_answers_img").addEventListener("click", () => {
                correctSpan.style.top = (correctAnswer.offsetParent.offsetTop -2)  + 'px';
                if(timeDown) {
                    clearInterval(timeDown);
                }
                setTimeout(() => {
                    document.querySelector(".confirm").classList.add("confirm--show");
                },5000)
            })
        }
        else {
            let html = "";
            if(questions[ranNum].question.includes("lucky")) {
                html = `<div class="special">
                            <h2 class="special_heading special_heading--lucky">lucky</h2> 
                            <img src="./assets/img/lucky.png" alt="Lucky" class="special_img">
                        </div>`;
                addPoint.querySelector(".addPoint_point").innerHTML = 3;
                rankItems[ranTeam].querySelector(".list_item_point").innerHTML = parseInt(rankItems[ranTeam].querySelector(".list_item_point").innerHTML) + 3;
                if(parseInt(rankItems[ranTeam].querySelector(".list_item_point").innerHTML) > highestPoint) {
                    highestPoint = parseInt(rankItems[ranTeam].querySelector(".list_item_point").innerHTML);
                    winner = teams[ranTeam].innerHTML;
                }
            }
            else {
                addPoint.querySelector(".addPoint_point").innerHTML = 0;
                html = `<div class="special">
                            <h2 class="special_heading special_heading--failed">failed</h2> 
                            <img src="./assets/img/failed.png" alt="Failed" class="special_img">
                        </div>`;
            }
            questionSection.innerHTML = html;

            addPoint.style.top = rankHeading.getBoundingClientRect().top - 60 + "px";
            addPoint.style.left = rankHeading.getBoundingClientRect().left + 85 + "px";
            addPoint.classList.add("addPoint--fade");
            setTimeout(() => {
                updateRank();
                addPoint.classList.remove("addPoint--fade");
                addPoint.style.top = "240px";
                addPoint.style.left = "calc(50% - 120px)";
            },5000)
            setTimeout(() => {
                teams[ranTeam].classList.remove("list_item_nameTeam--turned");
                newTurn();
            },8500)
        }
        setTimeout(() => {
            f.classList.add("fruitDisabled");
        },3000)
    })
})

function updateRank() {
    const sortedItems = Array.from(rankItems).sort((a, b) => {
      const pointA = parseInt(a.querySelector(".list_item_point").innerHTML);
      const pointB = parseInt(b.querySelector(".list_item_point").innerHTML);
      return pointB - pointA;
    });
  
    sortedItems.forEach((item, index) => {
      item.style.top = rankPosition[index] + "px";
    });

  }

async function Sleep(delay) {
    return new Promise(resolve =>  setTimeout(resolve, delay))
}
  

function newTurn() {
    if(teamTurned.length == rankItems.length) teamTurned.length = 0;
    do{
        ranTeam = Math.floor(Math.random()* rankItems.length);
    } while(teamTurned.includes(ranTeam));
    teamTurned.push(ranTeam);
    if(isOver) {
        document.querySelector(".rank").classList.add("fill_screen");
        localStorage.setItem("winner", winner);
        //fill white screen
        setTimeout(() => {
            document.querySelector(".fill").classList.add("filled");
        },5000)
        setTimeout(() => {
            window.location = "../../winner.html"
        },9100)
        return;
    }
    isInQuestion = false;
    resetTimer(45);
    teams[ranTeam].classList.add("list_item_nameTeam--turned");
}

timer.addEventListener("click", () => {
    if(timeDown) {
        clearInterval(timeDown);
    }
})

document.querySelector(".confirm_btn--correct-first").onclick = (() => {
    document.querySelector(".confirm").classList.remove("confirm--show");
    document.querySelector(".addPoint_point").innerHTML = 2;
    addPoint.style.top = rankHeading.getBoundingClientRect().top - 60 + "px";
    addPoint.style.left = rankHeading.getBoundingClientRect().left + 85 + "px";
    addPoint.classList.add("addPoint--fade");
    rankItems[ranTeam].querySelector(".list_item_point").innerHTML = parseInt(rankItems[ranTeam].querySelector(".list_item_point").innerHTML) + 2;
    if(parseInt(rankItems[ranTeam].querySelector(".list_item_point").innerHTML) > highestPoint) {
        highestPoint = parseInt(rankItems[ranTeam].querySelector(".list_item_point").innerHTML);
        winner = teams[ranTeam].innerHTML;
    }
    setTimeout(() => {
        updateRank();
        addPoint.classList.remove("addPoint--fade");
        addPoint.style.top = "240px";
        addPoint.style.left = "calc(50% - 120px)";
    },3000);
    setTimeout(() => {
        teams[ranTeam].classList.remove("list_item_nameTeam--turned");
        newTurn();
    },8500)
});

document.querySelector(".confirm_btn--correct-second").onclick = (() => {
    document.querySelector(".confirm").classList.remove("confirm--show");
    document.querySelector(".addPoint_point").innerHTML = 1;
    addPoint.style.top = rankHeading.getBoundingClientRect().top - 60 + "px";
    addPoint.style.left = rankHeading.getBoundingClientRect().left + 85 + "px";
    addPoint.classList.add("addPoint--fade");
    rankItems[ranTeam].querySelector(".list_item_point").innerHTML = parseInt(rankItems[ranTeam].querySelector(".list_item_point").innerHTML) + 1;
    if(parseInt(rankItems[ranTeam].querySelector(".list_item_point").innerHTML) > highestPoint) {
        highestPoint = parseInt(rankItems[ranTeam].querySelector(".list_item_point").innerHTML);
        winner = teams[ranTeam].innerHTML;
    }
    setTimeout(() => {
        updateRank();
        addPoint.classList.remove("addPoint--fade");
        addPoint.style.top = "240px";
        addPoint.style.left = "calc(50% - 120px)";
    },3000);
    setTimeout(() => {
        teams[ranTeam].classList.remove("list_item_nameTeam--turned");
        newTurn();
    },8500)
});

document.querySelector(".confirm_btn--incorrect").onclick= ((e) => {
    document.querySelector(".addPoint_point").innerHTML = 0;
    addPoint.style.top = rankHeading.getBoundingClientRect().top - 60 + "px";
    addPoint.style.left = rankHeading.getBoundingClientRect().left + 85 + "px";
    addPoint.classList.add("addPoint--fade");
    setTimeout(() => {
        teams[ranTeam].classList.remove("list_item_nameTeam--turned");
        newTurn();
        addPoint.classList.remove("addPoint--fade");
        addPoint.style.top = "240px";
        addPoint.style.left = "calc(50% - 120px)";
        
    },8500)
    document.querySelector(".confirm").classList.remove("confirm--show");
});

async function resetTimer(initTime) {
    const timerCounter = timer.querySelector('.time_count');
    for(let i = parseInt(timerCounter.innerHTML); i <= initTime; i++) {
        await Sleep(i+10);
        timerCounter.innerHTML = i.toString();
    }   
}

newTurn();