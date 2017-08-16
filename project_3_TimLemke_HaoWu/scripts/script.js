var emojiSet = [];
var counter = 0;
var compare = [];

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
	var randomSelected = randomSelect(emojiSet, 8);
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
	//onClick listener
	/**
	* TODO: Trigger timer when counter is 1
	* TODO: Trigger alertbox when fisinsh, or triiger it when timeout
	*/
	$("ul").on("click", "li", function(){
		var $current = ($(this));
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
						if ($("#board > li.correct").length == 16){
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
	});
	console.log($("#board > li.correct").length)
});

/* clip() handler with jQuery plugin (https://nnattawat.github.io/flip/#back)
// $(".card").flip()
// var flag = true;
// $(".card").on('flip:done',function(){
// 	if (flag){
// 		$(this).flip(true);
// 		//triggger timer function
// 		console.log(flag);
// 		flag = false;
// 	} else {
// 		$(".card").flip(false);
// 		flag = true;
// 	}
// });

/** Docstring **
* simple counter
*/
// var count = 60;
// //https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval
// var countdown = setInterval(function() {
// 	count = count - 1;
// 	console.log(count);
// 	if (count === 0) {
// 		clearInterval(countdown);
// 	}
// }, 1000);