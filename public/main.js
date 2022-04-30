const { home } = require("nodemon/lib/utils")

// Focus div based on nav button click
document.getElementById("homenav").onclick = function () {
    document.getElementById("home").classList.remove("hidden");
    document.getElementById("single").classList.add("hidden");
    document.getElementById("multi").classList.add("hidden");
    document.getElementById("guess").classList.add("hidden");
}

document.getElementById("singlenav").onclick = function () {
    document.getElementById("home").classList.add("hidden");
    document.getElementById("single").classList.remove("hidden");
    document.getElementById("multi").classList.add("hidden");
    document.getElementById("guess").classList.add("hidden");
}

document.getElementById("multinav").onclick = function () {
    document.getElementById("home").classList.add("hidden");
    document.getElementById("single").classList.add("hidden");
    document.getElementById("multi").classList.remove("hidden");
    document.getElementById("guess").classList.add("hidden");
}

document.getElementById("guessnav").onclick = function () {
    document.getElementById("home").classList.add("hidden");
    document.getElementById("single").classList.add("hidden");
    document.getElementById("multi").classList.add("hidden");
    document.getElementById("guess").classList.remove("hidden");
}


// Flip one coin and show coin image to match result when button clicked
function single_coin() {
    fetch('http://localhost:555/app/flip/', { mode: 'cors'}).then(function (response) {
        return response.json();
    }).then(function (result) {
        console.log(result);
        document.getElementById("singleresult").innerHTML = result.flip;
        document.getElementById("quarter").src = `./assets/img/${$result.flip}.png`
    })
}
// Flip multiple coins and show coin images in table as well as summary results
// Enter number and press button to activate coin flip series
function flipCoins() {
    number_flips = document.getElementById("numberOfFlips");
    fetch('http://localhost:5555/app/flips/coins', {
        body: JSON.stringify({"number": number_flips}),
        headers: {"Content-Type": "application/json"},
        method: "post"
    }).then(function(response) {
        return response.json();
    }).then(function (result) {
        console.log(result);
        document.getElementById("numheads").innerHTML = result.summary.heads;
        document.getElementById("numtails").innerHTML = result.summary.tails;
    })

}
// Guess a flip by clicking either heads or tails button
function guess_flip(guess) {
    console.log(guess);
    fetch('http://localhost:555/app/flip/call', {
        body: JSON.stringify({"guess": guess}),
        headers: {"Content-Type": "application/json"},
        method: "post"
    }).then(function(response) {
        return response.json();
    }).then(function(result) {
        console.log(result);

        document.getElementById("your_call").innerHTML = guess;
        document.getElementById("yourcallimage").setAttribute("src", "assets/img/"+guess+".png");

        document.getElementById("flip_result").innerHTML = result.flip;
        document.getElementById("flip_img_result").setAttribute("src", "assets/img/"+result.flip+".png");

        document.getElementById("guess_result").innerHTML = "You " + result.result + ".";
    })
}