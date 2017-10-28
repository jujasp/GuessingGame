function generateWinningNumber() {
	var number = Math.floor(Math.random() * 100) + 1;

	if(!number) {
		number = 1;
	}

	return number;
}

function shuffle(arr) {
	for(var i=arr.length-1; i>0; i--) {
		var randomI = Math.floor(Math.random() * (i +1));
		var temp = arr[i];
		arr[i] = arr[randomI];
		arr[randomI] = temp;
	}

	return arr;
}

function Game() {
	this.winningNumber = generateWinningNumber();
	this.playersGuess = null;
	this.pastGuesses = [];
}

Game.prototype.difference = function() {
	return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function() {
	return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(num) {
	if(num > 100 || num < 1 || typeof num !== 'number') {
		throw "That is an invalid guess."
	}

	this.playersGuess = num;

	return this.checkGuess();
}

Game.prototype.checkGuess = function(){
	if(this.playersGuess===this.winningNumber){
		$('#hint, #submit').prop("disabled",true);
        $('#subtitle').text("Press the Reset button to play again!")
		return "You win!"
	}

	else {
		if(this.pastGuesses.includes(this.playersGuess)) {
			return "You have already guessed that number."
		} else {
		this.pastGuesses.push(this.playersGuess);
		$('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
		if(this.pastGuesses===5) {
			$('#hint, #submit').prop("disabled",true);
            $('#subtitle').text("Press the Reset button to play again!")
			return "You lose.";
		} else {
			if(this.isLower()) {
            	$('#subtitle').text("Guess Higher!")
            } else {
            	$('#subtitle').text("Guess Lower!")
            }
		var diff = this.difference();
		if(diff<10) return "You're burning up!";
		else if(diff<25) return "You're lukewarm.";
		else if(diff < 50) return "You're a bit chilly.";
		else return "You're ice cold!";
		}
	}
}
}

Game.prototype.provideHint = function() {
	var hintArray = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
	return shuffle(hintArray);
}

function newGame() {
	return new Game();
}
 

 ////////////////// FOR JQUERY

function makeAGuess(game) {
    var guess = $('#player-input').val();
    $('#player-input').val("");
    var output = game.playersGuessSubmission(parseInt(guess,10));
    $('#title').text(output);
}

$(document).ready(function() {
    var game = new Game();

    $('#submit').click(function(e) {
       makeAGuess(game);
    })

    $('#player-input').keypress(function(event) {
        if ( event.which == 13 ) {
           makeAGuess(game);
        }
    })
    
    $('#hint').click(function() {
    	var hints = game.provideHint();
    	$('#title').text('The winning number is '+hints[0]+', '+hints[1]+', or '+hints[2]);
	});

	$('#reset').click(function() {
    	game = newGame();
    	$('#title').text('Play the Guessing Game!');
    	$('#subtitle').text('Guess a number between 1-100!')
    	$('.guess').text('-');
    	$('#hint, #submit').prop("disabled",false);
	})
})