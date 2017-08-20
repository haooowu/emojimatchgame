//refactored ver.
var gameMatch = {};
gameMatch.init = function(){
	gameMatch.grabEmoji();
	//defaut normal board 4x5
	gameMatch.shuffleBoard(10);
	gameMatch.matchListener();
	gameMatch.optionListener();
}
gameMatch.size = 0;
gameMatch.emojiset = [];
gameMatch.counter = 0;
gameMatch.compare = [];
gameMatch.minutes = 1;
gameMatch.seconds = 60;
gameMatch.flag = true;
gameMatch.score = 0;
gameMatch.mode = "normal";
/** Docstring **
* grab emoji unicode from 😀 up to 🙄, + 💩 = total 70 emojis faces
* can ultimately loop all emoji to 1F1FF (http://www.unicode.org/Public/emoji/6.0/)
*/
gameMatch.grabEmoji = function(){
	for (var i = 0x1F600; i <= 0x1F644; i += 1){
		gameMatch.emojiset.push(String.fromCodePoint(i));
	}// the poop one
	gameMatch.emojiset.push(String.fromCodePoint(0x1F4A9));
}
/** Docstring **
* Randomly select unique emojis from the list by shuffle it first then slice the size
* @param {array} array that needs to be shuffled
* @param {int} number of emoji needs to slice depends on the level
* @return {array}
*/
gameMatch.randomSelect = function(array, num) {
	var pointer = array.length;
	// while still exists more items in the array, starting at last one
	while (0 !== pointer) {
		//select remaining one and point to next
		var randomPointer = Math.floor(Math.random()*pointer);
		pointer -= 1;
		var tempVal = array[pointer];
		//swaping the value with the current one
		array[pointer] = array[randomPointer];
		array[randomPointer] = tempVal;
	}
	return array.slice(0, num);
}
/** Docstring **
* Count down timer for two minuites 
*/
gameMatch.countDown = function(){
	//setinterval for 1 second 
	gameMatch.timer = setInterval(function() {
		//when 60 sec passed, minute - 1, second resets to 59
		if (gameMatch.seconds === 0) {
			gameMatch.minutes -= 1;
			gameMatch.seconds = 59;
		} else {
			gameMatch.seconds -= 1;
		}
		// when only 30sec left, warn with red text
		if (gameMatch.minutes === 0 && gameMatch.seconds < 30) {
			$('#timerCountdown').css("color","red");
		}
		// if mintes is greater than 0, OR gameMatch.seconds is greater than 0
		if (gameMatch.minutes > 0 || gameMatch.seconds > 0) {
			$('#timerCountdown').html(`${gameMatch.minutes}:${gameMatch.leadingZero(gameMatch.seconds)}`);
		}
		//else times up
		else if (gameMatch.minutes === 0 && gameMatch.seconds === 0) {
			//add the 0
			$('#timerCountdown').html(`${gameMatch.minutes}:${gameMatch.leadingZero(gameMatch.seconds)}`);
			//**!! need another sub-interval, or else alerts at 0:01 instead of 0:00 !!**
			clearInterval(gameMatch.timer);
			let subTimer = setInterval(function(){
				// sweet alert plugin
				swal({
					title: 'Sorry, You Lose!',
					type: 'error',
					width: 500,
					padding: 50,
					allowOutsideClick: false,
					onClose: function() {
						location.reload();
					},
					background: 'url(assets/backgroundLight.png)',
					html:
					'<h3>Your Final Score is: <span class="result_score">' + gameMatch.score + '</span></h3>' +
					'<a href="https://twitter.com/share">' +
					'<span class="fa-stack fa-lg">' +
						'<i class="fa fa-circle fa-stack-2x"></i>' +
						'<i class="fa fa-twitter fa-inverse fa-stack-1x"></i>' +
					'</span>' +'</a>'
					})
				clearInterval(subTimer);
			}, 0)//clears the subinterval
		}//end of times up
	}, 1000);
};
/** Docstring **
* Helper function for gameMatch.countDown
* @param {int} number that needs to be add a 0
* @return {string}
*/
gameMatch.leadingZero = function(n){
	// append zero when gameMatch.seconds goto 1 digit
	if (n < 10 && n >= 0){
		return '0' + n;
	}else{
		return n;
	}
}
/** Docstring **
* append li into ul on gameboard
* @param {int} board size that needs to be duplicated
*/
gameMatch.shuffleBoard = function(n){
	gameMatch.size = n;
	var randomSelected = gameMatch.randomSelect(gameMatch.emojiset, n);
	var gameSample = [];
	for(var i = 0; i< randomSelected.length; i+=1){
		gameSample.push(randomSelected [i]);
		gameSample.push(randomSelected [i]);
	}
	//shuffle the duplicated board
	var finalBoard = gameMatch.randomSelect(gameSample, gameSample.length);
	for (var i = 0; i < finalBoard.length; i++) {
		$('#board').append($(`<li class="emojicard"><div class="front">?</div><div class="back">${finalBoard[i]}</div></li>`));
	}
}
/** Docstring **
* event listeners for click li event
*/
gameMatch.matchListener = function(){
	$("ul").on("click touchstart", "li", function(event){
		event.preventDefault();
		//flag for determine first click or not
		if (gameMatch.flag){
			gameMatch.countDown();
			gameMatch.flag = false;
		}
		var $current = ($(this));
		// cant change level during the game
		$("#hardMode").prop('disabled', true);
		$("#normalMode").prop('disabled', true);
		// if the li has not been flipped
		if (!$current.hasClass("flip")) {
			// creating an object that consist of the li's index and the value then add to an array
			var emoInfo = {"index": $current.index(),"value":$current.find(".back").text()}
			gameMatch.compare.push(emoInfo);
			gameMatch.counter += 1;
			$current.addClass("flip");
			// if this is the second one:
			if (gameMatch.counter == 2){
				//locks other li
				$("li").addClass("off");
				// if their value are the same
				if (gameMatch.compare[0].value === gameMatch.compare[1].value){
					//😈 Devil deducts your score, heh
					if (gameMatch.compare[0].value === String.fromCodePoint(0x1F608)){
						gameMatch.score -= 5;
					}//the poooop bonus
					else if (gameMatch.compare[0].value === String.fromCodePoint(0x1F4A9)){
						gameMatch.score += 100;
					} else if (gameMatch.mode === "hard"){
						gameMatch.score += 20;
					}else{
						gameMatch.score += 10;
					}
					$("#scoreCounter").text(gameMatch.score);
					//look for the previous' index and let them stay
					var preIndex = gameMatch.compare[0].index;
					$current.addClass("correct");
					$current.find(".back").css("background-color", "#66BB6A" );
					$current.parent().children().eq(preIndex).addClass("correct");
					$current.parent().children().eq(preIndex).find(".back").css("background-color", "#66BB6A");
					//initialize
					gameMatch.counter = 0;
					gameMatch.compare = [];
					$("li").removeClass('off');
					// wait for fliping to finish
					setTimeout(function() {
						// if all li are correct, stop timer, calc score, alert
						if ($("#board > li.correct").length === gameMatch.size*2){
							clearInterval(gameMatch.timer);
							var bonus = (gameMatch.minutes*60 + gameMatch.seconds);
							gameMatch.score += bonus;
							//sweet alert plugin
							swal({
								title: 'GREAT JOB! YOU WIN!',
								type: 'success',
								width: 500,
								padding: 50,
								background: 'url(assets/backgroundLight.png)',
								allowOutsideClick: false,
								onClose: function() {
									location.reload();
								},
								html:
								'<h3>Remaining Time: <span class="result_score">' + gameMatch.minutes + ':' + gameMatch.leadingZero(gameMatch.seconds) + '</span></h3>' +
								'<h3>Your Final Score is: <span class="result_score">' + gameMatch.score  + '</span></h3>' +
								'<a href="https://twitter.com/share">' +
								'<span class="fa-stack fa-lg">' +
									'<i class="fa fa-circle fa-stack-2x"></i>' +
									'<i class="fa fa-twitter fa-inverse fa-stack-1x"></i>' +
								'</span>' +'</a>'
							});
							$("li").removeClass('flip');
						}
					}, 350);//else they do not match
				} else {
					// wait for displaying
					setTimeout(function() {
						$("li").removeClass('flip off');
					}, 600);
					//initialize
					gameMatch.compare = [];
					gameMatch.counter = 0;
				}
			}//end of counter == 2
		}//end of if statement 
	});//end of onclick listener for emo
}
/** Docstring **
* event listeners for rules, gamemode and reset button
*/
gameMatch.optionListener = function(){
	$("#normalMode").click(function(event){
		event.preventDefault();
		gameMatch.mode = "normal"
		$("#board").empty();
		gameMatch.shuffleBoard(10);
		gameMatch.hint();
	});

	$("#hardMode").click(function(event){
		event.preventDefault();
		gameMatch.mode = "hard"
		$("#board").empty();
		gameMatch.shuffleBoard(18);
		// 14% margin + 13% each * 6  = 98% of page
		$('li.emojicard').css("flex-basis", "14%");
		$('li.emojicard').css("margin", "1% 1%");
		gameMatch.hint();
	});

	$("#reset").click(function(event){
		event.preventDefault();
		gameMatch.clearall();
		gameMatch.hint();
	});

	$("#FAQ").click(function(event){
		//sweet alert plugin
		swal({
			title: 'RULES',
			width: 600,
			padding: 20,
			background: 'url(assets/backgroundLight.png)',
			html:
			'<p>- There are total of <span class="result_score">70 emoji faces</span> to randomly shuffle from</p>' +
			'<p>- Click <span class="result_score">( Normal )</span> or <span class="result_score">( Hardcore )</span> Button to shuffle the borad/Change difficulty</p>' +
			'<p>- When first card is being clicked, the game is on!</p>' +
			'<p>- Click <span class="result_score">( <i class="fa fa-repeat" aria-hidden="true"></i> )</span> to reset page during the game</p>' +
			'<p>***Score Calculation***</p>' +
			'<p>&#x1F3AE Normal: One Correct match = <span class="result_score">10 points</span> </p>' +
			'<p>&#x1F525 Hardcore: One Correct match = <span class="result_score">20 points</span> </p>' +
			'<p>Matching &#x1F4A9 = <span class="result_score">100 points!</span></p>' +
			'<p>Matching &#x1F608 deducts <span class="result_score"> 5 points!</span></p>' +
			'<p>&#x1F4AF Final Score = total points + remaining time</p>' +
			'<br>' + '<p>Thank you for playing!</p>'
		})
	});
}
/** Docstring **
* helper function for reset button that reset all other than just location.reload()
*/
gameMatch.clearall = function(){
	// reset to defaults
	gameMatch.counter = 0; 
	gameMatch.flag = true; 
	gameMatch.compare = [];
	//stop timer and back to default
	clearInterval(gameMatch.timer);
	gameMatch.minutes = 1;
	gameMatch.seconds = 60;
	$("#timerCountdown").html("2:00");
	//clear score
	gameMatch.score = 0;
	$("#scoreCounter").text("00");
	//clear then reshuffle board
	$("#board").empty();
	if (gameMatch.mode === "hard"){
		gameMatch.shuffleBoard(18);
		// 14% margin + 13% each * 6  = 98% of wrapper
		$('li.emojicard').css("flex-basis", "14%");
		$('li.emojicard').css("margin", "1% 1%");
	}else{
		gameMatch.shuffleBoard(10);	
	}
	$("#hardMode").prop('disabled', false);
	$("#normalMode").prop('disabled', false);
}
/** Docstring **
* helper function for listener that show 0.5 sec of board with flip
*/
gameMatch.hint = function(){
	$("li").addClass('flip');
	setTimeout(function() {
		$("li").removeClass('flip');
	}, 500);
}
//(document).ready(function(){
$(function() {
	gameMatch.init();
});
