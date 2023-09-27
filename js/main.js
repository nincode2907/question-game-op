// import questions from "./questions.js";

const fruits = document.querySelectorAll(".fruit");
const questionSection = document.querySelector(".questionSection");
const countDownTime = document.querySelector(".time_count");
const rankItems = document.querySelectorAll(".list_item");
const teams = document.querySelectorAll(".list_item_nameTeam");

const questions = [];
const questionSelected = [];
const teamTurned = [];
const rankPosition = [60, 88, 116, 144, 172, 200, 228];
var ranTeam = 0;

fetch("./data.json")
    .then(response => response.json())
    .then(data => {
        data.forEach(q => questions.push(q));
    })

fruits.forEach((f, index) =>{
    f.addEventListener("click", (index) =>{
        clearTimeout(timeDown);
        if(questionSelected.length<questions.length) {
            let ranNum;
            do{
                ranNum = Math.floor(Math.random()* questions.length);
            } while(questionSelected.includes(ranNum));
            questionSelected.push(ranNum);
            if(!questions[ranNum].question.includes("lucky") && !questions[ranNum].question.includes("failed")) {
                let html = `<div class="question">
                                <h2 class="questionSection_question">
                                    <Strong class="questionSection_question_content">${questions[ranNum].question}</Strong>
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
                                    <img src="./img/person/${f.alt}.png" alt="${f.alt}" class="questionSection_answers_img">
                                </div>
                        </div>`
                questionSection.innerHTML = html;

                let count = 50;
                let timeDown = setInterval(() => {
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
                console.log(correctAnswer.innerHTML);
                document.querySelector(".questionSection_answers_img").addEventListener("click", () => {
                    correctSpan.style.top = (correctAnswer.offsetParent.offsetTop -2)  + 'px';
                    clearInterval(timeDown);
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
                                <img src="./img/lucky.png" alt="Lucky" class="special_img">
                            </div>`;
                    document.querySelector(".addPoint_point").innerHTML = 2;
                    rankItems[ranTeam].querySelector(".list_item_point").innerHTML = parseInt(rankItems[ranTeam].querySelector(".list_item_point").innerHTML) + 2;
                    setTimeout(() => {
                        document.querySelector(".addPoint").classList.remove("addPoint--fade");
                    },3000)
                }
                else {
                    document.querySelector(".addPoint_point").innerHTML = 0;
                    html = `<div class="special">
                                <h2 class="special_heading special_heading--failed">failed</h2> 
                                <img src="./img/failed.png" alt="Failed" class="special_img">
                            </div>`;
                }
                questionSection.innerHTML = html;
                document.querySelector(".addPoint").classList.add("addPoint--fade");
                setTimeout(() => {
                    updateRank();
                    document.querySelector(".addPoint").classList.remove("addPoint--fade");
                },5000)
                setTimeout(() => {
                    teams[ranTeam].classList.remove("list_item_nameTeam--turned");
                    newTurn();
                },10000)
            }
            setTimeout(() => {
                f.classList.add("fruitDisabled");
            },3000)
        }
        else {
            let winner = "";
            rankItems.forEach(i => {
                if(i.style.top == rankPosition[0] + "px") 
                    winner = i.querySelector(".list_item_nameTeam").innerHTML;
            })
            let html = `<div class="winner">
                            <h2 class="winner_heading">Chiến thắng</h2>
                            <span class="winner_team">${winner}</span>
                        </div>`;
            questionSection.innerHTML = html;
            setTimeout(() => {
                rain();
            },2000)
        }
    })
})

function updateRank() {
    const pointArr = [];
    const checked = [];
    rankItems.forEach(i => {
        pointArr.push(parseInt(i.querySelector(".list_item_point").innerHTML))
    })
    pointArr.sort(function(a, b){return b - a});
    for(let i = 0; i < pointArr.length; i++) {
        let positionItem;
        for(let j = 0; j < rankItems.length; j++) {
            if(checked.includes(j)) continue;
            if(rankItems[j].querySelector(".list_item_point").innerHTML == pointArr[i]) {
                positionItem = j;
                checked.push(j);
                break;
            }
        }
        rankItems[positionItem].style.top = rankPosition[i] + "px";
    }
}

function newTurn() {
    if(teamTurned.length == rankItems.length) teamTurned.length = 0;
    do{
        ranTeam = Math.floor(Math.random()* rankItems.length);
    } while(teamTurned.includes(ranTeam));
    teamTurned.push(ranTeam);
    teams[ranTeam].classList.add("list_item_nameTeam--turned");
}

document.querySelector(".confirm_btn--correct").onclick = (() => {
    document.querySelector(".confirm").classList.remove("confirm--show");
    document.querySelector(".addPoint_point").innerHTML = 1;
    document.querySelector(".addPoint").classList.add("addPoint--fade");
    rankItems[ranTeam].querySelector(".list_item_point").innerHTML = parseInt(rankItems[ranTeam].querySelector(".list_item_point").innerHTML) + 1;
    setTimeout(() => {
        updateRank();
        document.querySelector(".addPoint").classList.remove("addPoint--fade");
    },3000);
    setTimeout(() => {
        teams[ranTeam].classList.remove("list_item_nameTeam--turned");
        newTurn();
    },10000)
});

document.querySelector(".confirm_btn--incorrect").onclick= ((e) => {
    document.querySelector(".addPoint_point").innerHTML = 0;
    document.querySelector(".addPoint").classList.add("addPoint--fade");
    setTimeout(() => {
        teams[ranTeam].classList.remove("list_item_nameTeam--turned");
        newTurn();
        document.querySelector(".addPoint").classList.remove("addPoint--fade");
    },10000)
    document.querySelector(".confirm").classList.remove("confirm--show");
});

function rain() {
    let rainQuantity = 200;
    let body = document.querySelector(".main");
    let i = 0;
    while(i<rainQuantity) {
        let rain = document.createElement("i");
        body.appendChild(rain);

        let size = Math.random() *5;
        let posX = Math.floor(Math.random() * window.innerWidth);
        let duration = Math.random() * 20;  
        let delay = Math.random() * -20;

        rain.style.width = 0.2 + size + "px";
        rain.style.left = posX + "px";
        rain.style.animationDuration = 1 + duration + "s";
        rain.style.animationDelay = delay + "s";
        i++;
    }
}

newTurn();