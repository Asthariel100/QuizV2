// Les premières fonction servent à paramétrer le quiz 
// avant d'être utilisées dans la fonction servant à le démarrer(startquiz) une 
// fois tout les parametre ok


//recuperation du json
async function getQuestions()
{
    try{
    const response = await fetch('db.json');
    const data = await response.json();
    return data;
    }
    catch(error)
    {
        console.log(error)
    }
}
var Score = 0;
//shuffle du tableau de questions
function shuffleArray(array) 
    {
        return array.sort(() => 0.5 - Math.random());
    }

// démarrage du quiz   
async function renderQuiz()
{
    const allquestions = await getQuestions();
    shuffleArray(allquestions)
    const quiz = allquestions.splice(1);
    let html = `<form class="form-check" id="quizform" >`;


//Boucle sur les questions aprés le tri pour afficher les questions, index pour grouper les boutons radios
    quiz.forEach((element, index) => 
    {
         
        let htmlSegment = `<div class="card text-center"><h1>${quiz[index].questions}</h1>
                            <div class="card text-center>
                            <h2 class="card text-center" style="display: none;" id="commentaire${index}">${quiz[index].commentaire}</h2>
                            </div>`

            for(let i = 0; i < quiz[index].reponse.length; i++)
            {
                htmlSegment +=`<div class="container col-2 p-2">
                            <input class="form-check-input" type="radio" name="flexRadioDefault${index}" value="${quiz[index].reponse[i]}">
                            <label id="reponse${index}-${i}" class="form-check-label">${quiz[index].reponse[i]}</label>
                            </div>`;
            };
              
        html
        += htmlSegment
        += `<input class="form-check-input d-none p-3" type="radio" name="reponse${index}" value="${quiz[index].correction}" checked>`;        
    });
    
    html += `<button class="p-2 btn btn-primary" id="button" type="submit">Valider</button></form>`;
    let container = document.querySelector('.container');
    container.innerHTML = html;
    
    const form = document.querySelector('#quizform').addEventListener('submit',function(e)
    {
        e.preventDefault();
        userInputs = checkResult(quiz);
        quizCorrections = getRightAnswer(quiz)
        correctionResults = correctingResults(userInputs, quizCorrections);
        const UserScore = score(correctionResults);
        Score = displayScore(UserScore);
        scoreTable = getLocalStorage() || [];
        display = checkHighScores(UserScore,scoreTable);

    const form = document.querySelector('#quizform').addEventListener('submit',function(e)
    {    
  
        renderUserForm(UserScore, scoreTable, display);
    });
    });  
       
}

//Fonction de récupération des input radio 
function checkResult(quiz)
    {   
        var userInputs = [];

        for(let i = 0; i < quiz.length; i++)
        {
                try{var selectedValue = document.querySelector(`input[name="flexRadioDefault${i}"]:checked`).value;
                }
                catch(error)
                {
                alert("veuillez repondre à chaque question avant validation");
                return;
                }
                userInputs.push(selectedValue);
        }

        return userInputs;                            
    }

// Fonction de recuperation des reponse et stockage dans le tableau
function getRightAnswer(quiz)
{
    var quizCorrections = [];

    for(let i = 0; i < quiz.length; i++)
        {
            try{var correctAnswer = document.querySelector(`input[name="reponse${i}"]:checked`).value;
                        }
                        catch(error)
                        {
                        alert("test");
                        return false;
                        }
                        quizCorrections.push(correctAnswer);
        }

        return quizCorrections;
}

//fonction de comparaison entre le tableau de reponse et les user input
function correctingResults(userInputs, quizCorrections)
{
    var userInputs;
    var quizCorrections;
    var correctionResults =[];

    for(i = 0; i < userInputs.length; i++)
    {
        var correction = document.getElementById(`commentaire${i}`);
        correction.style.display = "block";
       
        var numberOfAnswer = 3;
        
        for(a = 0; a < numberOfAnswer; a++)
        {
            
            var reponse = document.getElementById(`reponse${i}-${a}`);

            if(userInputs[i] === quizCorrections[i])
            {
                if(userInputs[i] === reponse.textContent)
                {
                    
                    reponse.style.color ='rgb(54, 228, 19)';
                }
                else
                {
                    reponse.style.color = 'rgb(255,0,0)';
                }
                
                result = true
            }
            else
            {
                
                if(quizCorrections[i] === reponse.textContent)
                {
                    reponse.style.color = 'rgb(54, 228, 19)';
                }
                else
                {
                    reponse.style.color = 'rgb(255,0,0)';
                }
                result = false;
            }
        }

        correctionResults.push(result);            
    }

    return correctionResults;
}

//function de calcul du score
function score(correctionResults)
{
    var score = 0;

    correctionResults.forEach((element) =>
    {
        
        if(element == true)
        {
            score += 5;
        }        
    });

    return score;
}

//fonction d'affichage du score
function displayScore(userScore)
{
    const score = document.getElementById("button");
    score.textContent = "aller au tableau des scores";
    let newscore = document.createElement('h3');
    newscore.textContent = `Votre score est de ${userScore} `;
    score.appendChild(newscore);
}

//Fonction de vérification du score courant par rapport au meilleur score
function checkHighScores(UserScore, scoreTable)
{
    var highScores = [];
    console.log(scoreTable);
    scoreTable.forEach((element, index) =>
    {
        highScores.push(scoreTable[index].UserScore);
    });
    console.log(highScores);
    var compare = scoreTable.length ? Math.min.apply(Math, highScores) : 0;

    console.log(compare);

    if(compare >= UserScore)
    {
        display= false;
        return display;
    }
    else
    {
        display = true;

        return display;
    }
}

//Fonction d'affichage du tbaleau des scores
function renderUserForm(UserScore, scoreTable, display)
{
    

    let html = `<form class="form-check" id="userscoreform">
                        <div class="mb-3 p-3">
                            <h1 for="exampleFormControlInput1" class="form-label"id="bravomoi">Nouveau High score ! Veuillez saisir votre nom :</h1>
                            <input class="form-control" id="test" name="userName" placeholder="Nom d'utilisateur">
                            <button class="btn btn-primary m-3" style="display: block;" type="submit" id="validation">Valider</button>
                        </div>
                    </form>
                    <table class="table table-success table-striped">
                        <thead>
                            <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Score</th>
                            </tr>
                        </thead>
                        <tbody>`;
        scoreTable.forEach((element, index) => 
                        {
                            let scoreBoard =`<tr>
                            <th scope="row">${1 + index}</th>
                            <td>${scoreTable[index].userName}</td>
                            <td>${scoreTable[index].UserScore}</td>
                            </tr>
                            <tr>`
                            html += scoreBoard
                        },
                        
                        );
         html += 
                            `</tbody>
                    </table>
                    <form class="form-check" id="resetQuiz">
                    <button class="btn btn-primary" id="newQuiz" type="submit">Relancer le quiz!</button>
                    </form>`
                    ;

    let container = document.querySelector('.container');
    container.innerHTML = html;

    hideInputs(display);

    const form = document.querySelector('#userscoreform').addEventListener('submit',function(e)
    {
        
        e.preventDefault();     
        setLocalStorage(UserScore);
        scoreTable = getLocalStorage();
        display = false;
        hideInputs(display);
        renderUserForm(UserScore, scoreTable, display);
        
    });
    const form2 = document.querySelector('#resetQuiz').addEventListener('submit',function(e)
    {

        renderQuiz();                    
    });
    
    
}

//fonction pour recupérer le tableau du local storage 
function getLocalStorage()
{
    
    var bestScoreString = (window.localStorage.getItem("user"));
    var bestScoreJson = JSON.parse(bestScoreString);

    return bestScoreJson;
}


// Fonction pour ajouter le score et le nom dans le local storage
function setLocalStorage(UserScore, highScores)
{
    

    userName = getUserName();
    var highScores = getLocalStorage() || [];
    const savedScore = {UserScore, userName};
    highScores.push(savedScore);
    highScores.sort((a,b)=>b.UserScore-a.UserScore);

    highScores.splice(5);

    window.localStorage.setItem("user", JSON.stringify(highScores));
}


// Fonction de recuperation de l'input UserName
function getUserName()
{
    try
    {
        var userName = document.querySelector(`input[name="userName"]`);

        if(userName.value.length == 0 )
        {
            alert("veuillez saisir un nom d'utilisateur");
    
            return;
        }            
    }
    catch(error)
    {
        alert("veuillez saisir un nom d'utilisateur"); 

        return;       
    }

    return userName.value;    
}

//Fonction pour cacher le formulaire aprés inscription du nom
function hideInputs(display)
{
    
    if(display == true)
    {
        var userNameOk = document.getElementById(`validation`);
        userNameOk.style.display = "block"; 
        
        var userInputOk = document.getElementById(`test`);
        userInputOk.style.display = "block";  

        var userInputOk = document.getElementById(`bravomoi`);
        userInputOk.style.display = "block"; 
    }
    else
    {
        var userNameOk = document.getElementById(`validation`);
        userNameOk.style.display = "none"; 
    
        var userInputOk = document.getElementById(`test`);
        userInputOk.style.display = "none";

        var userInputOk = document.getElementById(`bravomoi`);
        userInputOk.style.display = "none";
    }    
}

// Function pour vider le local storage
function clearstorage()
{
    window.localStorage.clear();
}

renderQuiz();



