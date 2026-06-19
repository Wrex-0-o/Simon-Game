var buttonColours = ["red", "yellow", "green", "blue"];
var gamePattern = [];
var userClickedPattern = [];
var level = 0;
var audioMap = {
  red: "red.mp3",
  yellow: "yellow.mp3",
  green: "green.wav",
  blue: "blue.mp3",
};

async function nextLevel(){
    userClickedPattern = [];

    nextSequence();
    await displayPattern();
    await waitForUserInput();
}

function nextSequence() {
    level++;
    $(".update").text("Level " + level);
    var randomNumber = Math.floor(Math.random() * 4);
    var randomColour = buttonColours[randomNumber];
    gamePattern.push(randomColour);
}

function displayPattern(){
    return new Promise(function (resolve){
        var i = 0;

        function showNext(){
            if(i >= gamePattern.length){
                resolve();
                return;
            }

            var colour = gamePattern[i];
            setTimeout(function(){
                animatePress(colour);
                playSound(colour);
                i++;
                showNext();
            }, 600 * i + 400);
        }
        showNext();
    });
}

function waitForUserInput(){
    return new Promise(function (resolve){
        $(".tile").off("click").on("click", function(){
            var userClicked = $(this).attr("id");
            userClickedPattern.push(userClicked);

            animatePress(userClicked)
            playSound(userClicked);

            var currentIndex = userClickedPattern.length - 1;

            if(userClicked !== gamePattern[currentIndex]){
                gameOver();
                resolve();
                return;
            }

            if(userClickedPattern.length === gamePattern.length){
                $(".tile").off("click");

                if(level === 30){
                    youWin();
                    resolve();
                    return;
                }
                setTimeout(function(){
                    resolve();
                }, 500);
            }
        });
    });
}

async function waitForUserInput(){
    return new Promise(function(resolve){
        $(".tile").off("click").on("click", function(){
            var userClicked = $(this).attr("id");
            userClickedPattern.push(userClicked);

            animatePress(userClicked);
            playSound(userClicked);

            var currentIndex = userClickedPattern.length - 1;
            if(userClicked !== gamePattern[currentIndex]){
                gameOver();
                resolve("stop");
                return;
            }

            if(userClickedPattern.length === gamePattern.length){
                $(".tile").off("click");
                if(level === 30){
                    youWin();
                    resolve("stop");
                    return;
                }
                setTimeout(function(){
                    resolve("continue");
                }, 500);
            }
        });
    });
}

async function nextLevel(){
    userClickedPattern = [];

    nextSequence();
    await displayPattern();
    
    var result = await waitForUserInput();
    if(result==="continue"){
        nextLevel();
    }
}

function gameOver(){
    $(".tile").off("click");
    $("body").addClass("game-over");
    setTimeout(function(){
        $("body").removeClass("game-over");
    },200);

    var wrong = new Audio("./audio/wrong.mp3");
    wrong.play();

    $(".update").text("Game Over! Press any key to Restart.");
    activated = false;
    level = 0;
    gamePattern = [];
}

function youWin(){
    $(".update").text("You beat all 30 Levels!");
    var win = new Audio("./audio/victory.mp3");
    win.play();
    activated = false;
    level = 0;
    gamePattern = [];
}

function playSound(colour){
    var audio = new Audio("./audio/" + audioMap[colour]);
    audio.play();
}

function animatePress(colour){
    $("#" + colour).addClass("blink");
    setTimeout(function () {
        $("#" + colour).removeClass("blink");
    }, 125);
}

var activated = false;
$(document).keydown(function (event) {
    if (activated) return;
    activated = true;
    //$(".update").text("Level " + level);
    nextLevel();

    

  
  /*var audio = new Audio("./audio/" + audioMap[randomChosenColour]);
  audio.play();

  $(".tile").click(function (){
    var userClicked = $(this).attr("id");
    
    userClickedPattern.push(userClicked);
    playSound(userClicked);

    console.log(userClickedPattern);
    if(userClickedPattern[userClickedPattern.length - 1] === gamePattern[gamePattern.length - 1]){
        $("#" + userClickedPattern[userClickedPattern.length - 1]).addClass("pressed");
        setTimeout(function(){
            $("#" + userClickedPattern[userClickedPattern.length - 1]).removeClass("pressed");
        }, 150);
        var correct = new Audio("./audio/correct.mp3");
        correct.play();
    } else{
        $("#" + userClickedPattern[userClickedPattern.length - 1]).addClass("pressed");
        setTimeout(function(){
            $("#" + userClickedPattern[userClickedPattern.length - 1]).removeClass("pressed");
        }, 150);
        var wrongAudio = new Audio("./audio/wrong.mp3");
        wrongAudio.play();
    }
  })*/
});
