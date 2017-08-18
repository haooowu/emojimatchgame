var emojiSet = [];
var counter = 0;
var compare = [];
var minutes = 1;
var seconds = 60;
var flag = true;
var timer;
var score = 0;
var size;
var mode;

$(function() {
	//grab emoji from 😀 up to 🙄, total 69 emojis faces + 💩 for bonus 100 points
	for (var i = 0x1F600; i <= 0x1F644; i += 1){
		emojiSet.push(String.fromCodePoint(i));
	}
	emojiSet.push(String.fromCodePoint(0x1F4A9));
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
	        	// need another sub-interval, or else alerts at 0:01 instead of 0:00
	           	clearInterval(timer);
	            let subTimer = setInterval(function(){
	            	// sweet alert plugin
	            	swal({
	            	  title: 'So Sorry! You Lose!',
	            	  type: 'error',
	            	  width: 600,
	            	  padding: 100,
	            	  allowOutsideClick: false,
	            	  onClose: function() {
	            	  	location.reload();
	            	  },
	            	  background: 'url(assets/backgroundLight.png)',
	            	  html:
	            	 '<h3>Your final score is: ' + score + '</h3>' +
	            	 '<a href="https://twitter.com/share">' +
						'<span class="fa-stack fa-lg">' +
							'<i class="fa fa-circle fa-stack-2x"></i>' +
							'<i class="fa fa-twitter fa-inverse fa-stack-1x"></i>' +
						'</span>' +
					'</a>',
	            	})
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
		size = n;
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
					if (compare[0].value === String.fromCodePoint(0x1F4A9)){
						score += 100;
					} else if (mode === "hard"){
						score += 20;
					}else{
						score += 10;
					}
					$("#scoreCounter").text(score);
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
						if ($("#board > li.correct").length == size*2){
							clearInterval(timer);
							var bonus = (minutes*60 + seconds);
							score += bonus;
							//sweet alert plugin
			            	swal({
			            	  title: 'GREAT JOB! YOU WIN!',
			            	  type: 'success',
			            	  text: '&#x1F601',
			            	  width: 600,
			            	  padding: 100,
			            	  allowOutsideClick: false,
			            	  onClose: function() {
			            	  	location.reload();
			            	  },
			            	  html:
			            	 '<h3>Your final score is: ' + score + '</h3>' +
			            	 '<h3>Your time left is: ' + minutes + ':' + leadingZero(seconds) + '</h3>' +
			            	 '<a href="https://twitter.com/share">' +
								'<span class="fa-stack fa-lg">' +
									'<i class="fa fa-circle fa-stack-2x"></i>' +
									'<i class="fa fa-twitter fa-inverse fa-stack-1x"></i>' +
								'</span>' +
							'</a>',
			            	});
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
	$("#normalMode").click(function(event){
		mode = "normal"
		$("#board").empty();
		shuffleBoard(10);
		event.preventDefault();
		$("li").addClass('flip');
		setTimeout(function() {
			$("li").removeClass('flip');
		}, 500);
	});

	$("#hardMode").click(function(event){
		mode = "hard"
		event.preventDefault();
		$("#board").empty();
		shuffleBoard(18);
		$('li.emojicard').css("flex-basis", "7%");
		$("li").addClass('flip');
		setTimeout(function() {
			$("li").removeClass('flip');
		}, 500);
	});
	//default
	shuffleBoard(10);
});
