var emojiSet = [];
var counter = 0;
var compare = [];
var minutes = 2;
var seconds = 60;
var flag = true;
var timer;
var score;

$(function() {
	//grab emoji from 😀 up to 🙄, total 69 emojis faces
	for (var i = 0x1F600; i <= 0x1F644; i += 1){
		emojiSet.push(String.fromCodePoint(i));
	}
	/** Docstring **
	* Randomly select unique emojis from the list by shuffle it first and slice the number
	* @param {array[]} array that needs to be shuffled.
	* @param {int} number of emoji needs to slice depends on the level.
	* @return {array[]}
	*/
	function randomSelect(array, num) {
		var pointer = array.length;
		// while still exists more items in the array
		while (0 !== pointer) {
		//select remaining one and point to next
		var randomPointer = Math.floor(Math.random() * pointer);
		pointer -= 1;
		var tempVal = array[pointer];
		//swaping the value with the current one
		array[pointer] = array[randomPointer];
		array[randomPointer] = tempVal;
		}
		return array.slice(0, num);
	}
	/** Docstring **
	* countDown for three minuites 
	*/
	function countDown() {
		//setinterval for 1 second 
	    timer = setInterval(function() {
	    	//when 60 sec passed, minute - 1, second resets to 59
	    	if (seconds === 0) {
	    		minutes -= 1;
	    		seconds = 59;
	    	} else {
	    		seconds -= 1;
	    	}
	    	// if mintes is greater than 0, OR, seconds is greater than 0
	        if (minutes > 0 || seconds > 0) {
	        	$('#timerCountdown').html(`<p>${minutes}:${leadingZero(seconds)}</p>`);
	        }
	        //else times up
	        else if (minutes === 0 && seconds === 0) {
	        	//add the 0
	        	$('#timerCountdown').html(`<p>${minutes}:${leadingZero(seconds)}</p>`);
	        	// need another sub interval, or else alerts at 0:01 instead of 0:00
	           	clearInterval(timer);
	            let subTimer = setInterval(function(){
	            	alert("sorry out of time")
	            	clearInterval(subTimer);
	            }, 0)
	        }
	    }, 1000);
	};
	//helper function for adding leading zero when 
	var leadingZero = function(n) {
	    if (n < 10 && n >= 0)
	        return '0' + n;
	    else
	        return n;
	};

	function shuffleBoard(n){
		var randomSelected = randomSelect(emojiSet, n);
		var gameSample = [];
		for(var i = 0; i< randomSelected.length; i+=1){
			gameSample.push(randomSelected [i]);
			gameSample.push(randomSelected [i]);
		}
		//shuffle the duplicated board
		var finalBoard = randomSelect(gameSample, gameSample.length);
		for (var i = 0; i < finalBoard.length; i++) {
			$('#board').append($(`<li class="emojicard"><div class="front">?</div><div class="back">${finalBoard[i]}</div></li>`));
		}
	}//end of shuffle board

	//onClick listener
	/**
	* TODO: Trigger timer when counter is 1
	* TODO: Trigger alertbox when fisinsh, or triiger it when timeout
	*/
	$("ul").on("click", "li", function(event){
		event.preventDefault();
		if (flag){
			countDown();
			flag = false;
		}
		var $current = ($(this));
		$('Button').prop('disabled', true);
		// if the li has not been flipped
		if (!$current.hasClass("flip")) {
			// creating an object that consist of the li's index and the value then add to an array
			var emoInfo = {"index": $current.index(),"value":$current.find(".back").text()}
			compare.push(emoInfo);
			counter += 1;
			$current.addClass("flip");
			// if this is the second one:
			if (counter == 2){
				//locks other li
				$("li").addClass("off");
				// if their value are the same
				if (compare[0].value === compare[1].value){
					//look for the previous' index and let them stay
					var preIndex = compare[0].index;
					$current.addClass("correct");
					$current.parent().children().eq(preIndex).addClass("correct");
					//initialize
					counter = 0;
					compare = [];
					$("li").removeClass('off');
					setTimeout(function() {
						// wait for fliping to finish
						// console.log($("#board > li.correct").length);
						if ($("#board > li.correct").length == n*2){
							alert("you win");
							$("li").removeClass('flip');
						}
					}, 350);
				} else {
					// wait a bit for displaying
					setTimeout(function() {
						$("li").removeClass('flip off');
					}, 600);
					//initialize
					compare = [];
					counter = 0;
				}
			}
		}
	});//end of onclick listener for emoji

	/*
	* All board filp when function triggers
	*/
	shuffleBoard(10);

 	$("button").click(function(event){
 		event.preventDefault();
		$("li").addClass('flip');
		setTimeout(function() {
			$("li").removeClass('flip');
		}, 500);
	});

	$("#normalMode").click(function(event){
		$("#board").empty();
		shuffleBoard(10);
		event.preventDefault();
		$("li").addClass('flip');
		setTimeout(function() {
			$("li").removeClass('flip');
		}, 500);
	});

	$("#hardMode").click(function(){
		$("#board").empty();
		shuffleBoard(18);
		$('li.emojicard').css("flex", "0 0 4%");
		$("li").addClass('flip');
		setTimeout(function() {
			$("li").removeClass('flip');
		}, 500);
	});
});
