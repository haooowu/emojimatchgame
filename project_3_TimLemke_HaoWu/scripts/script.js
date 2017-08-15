var emojiSet = [];
//grab emoji from 😀 up to 🙄, total 69 emojis faces
for (var i = 0x1F600; i <= 0x1F644; i += 1){
	// console.log(String.fromCodePoint(i));
	emojiSet.push(String.fromCodePoint(i));
}
/** Docstring **
* Randomly select unique emojis from the list by shuffle it first and slice the number
* @param  {array[]} array that needs to be shuffled.
* @param  {int} number of emoji needs to slice depends on the level.
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
// console.log(randomSelect(emojiSet, 4));
var gameSample = [];
	for(var i = 0; i< randomSelected.length; i+=1){
		gameSample.push(randomSelected [i]);
		gameSample.push(randomSelected [i]);
	}
//shuffle the duplicated board
var finalBoard = randomSelect(gameSample, gameSample.length);

for (var i = 0; i < finalBoard.length; i++) {
	$('#board').append($(`<li class="emoji tile">${finalBoard[i]}</li>`));
}

