var slider = document.getElementById('myRange');
var output = document.getElementById('val');

var sizeSlider = document.getElementById('mySize');
var sizeOutput = document.getElementById('size');

output.innerHTML = "Number of Random Walks: " + slider.value;
sizeOutput.innerHTML = "Size of Grid: " + sizeSlider.value + "x" + sizeSlider.value;

var n = 100;
var numWalks = 100;
slider.oninput = function() {
	output.innerHTML = "Number of Random Walks: " + this.value;
	numWalks = this.value;
}

sizeSlider.oninput = function() {
	sizeOutput.innerHTML = "Size of Grid: " + this.value + "x" + this.value;
	console.log(this.value);
	n = parseInt(this.value);
}


const container = document.getElementById("DLAgrid");
matrix = [];

function generateCells () {
	var s = "";
	var i=0;
	var j=0;
	while(++i<n) {
		s+= '<div class="row">'
		for(j=1; j<n; j++){
			if (matrix[i][j] == 2) {
				matrix[i][j] = 0;
				s+= `<div class="startercell">  </div>`;
			}
			else if (matrix[i][j] == 1) {
				s+= `<div class="filledcell">  </div>`;
			} else {
				s+= `<div class="cell">  </div>`;
			}
		}
		s+= '</div>'
	}
	return s;
}

function check(x, y){
	if (matrix[x + 1][y] == 1){
		return true;
	}
	if (matrix[x - 1][y] == 1){
		return true;
	}
	if (matrix[x][y + 1] == 1){
		return true;
	}
	if (matrix[x][y - 1] == 1){
		return true;
	}
	return false;
}

function randomWalk(x, y){
	var xx = x;
	var yy = y;
	while(true){
		if(check(xx,yy)){
			matrix[xx][yy] = 1;
			break;
		}
		var randDirection = Math.floor(Math.random()*4);
		
		if (randDirection == 0 && xx < 99){
			xx += 1;
		} else if (randDirection == 1 && xx > 1){
			xx -= 1;
		} else if (randDirection == 2 && yy < 99){
			yy += 1;
		} else if(randDirection == 3 && yy > 1){
			yy -= 1;
		} else{
			continue;
		}
	}
		
}

function toggleVisible(className, displayState){
    var elements = document.getElementsByClassName(className);

    for (var i = 0; i < elements.length; i++){
        elements[i].style.border = "1px solid transparent";
    }
}

var id = null;
var walks = document.getElementById('walks');
var iter = 0;
function main() {
	if(iter == numWalks){
		clearInterval(id);
		walks.innerHTML = "DONE: " + iter + " Random Walks Completed";
		// toggleVisible('cell', 'none');
	} else{
		container.innerHTML = generateCells();

		var randSide = Math.floor(Math.random()*4);
		var randPos = Math.floor(Math.random()*n) + 1;
		if (randSide == 0){
			matrix[1][randPos] = 2;
			randomWalk(1, randPos);
		} else if (randSide == 1){
			matrix[n - 1][randPos] = 2;
			randomWalk(n - 1, randPos);
		} else if (randSide == 2){
			matrix[randPos][1] = 2;
			randomWalk(randPos, 1);
		} else if(randSide == 3){
			matrix[randPos][n - 1] = 2;
			randomWalk(randPos, n - 1);
		}

		iter ++;
		walks.innerHTML = iter + " Random Walks Completed";
	}
}

function begin() {
	iter = 0;
	matrix = new Array(n + 2).fill(0).map(() => new Array(n + 2).fill(0));
	matrix[Math.floor(n/2)][Math.floor(n/2)] = 1;
	clearInterval(id);
	id = setInterval(main, 10);
}

function stop() {
	clearInterval(id);
}