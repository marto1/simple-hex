main();

var contains = function(needle) {
    // Per spec, the way to identify
    // NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;
    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                var item = this[i];

                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }
            return index;
        };
    }
    return indexOf.call(this, needle) > -1;
};


function customAlert(msg,duration)
{
 var styler = document.createElement("div");
 styler.setAttribute("style","border: solid 2px Red;width:278;height:auto;top:50%;left:40%;background-color:#444;color:Silver");
 styler.innerHTML = "<h3>"+msg+"</h3>";
 setTimeout(function()
 {
   styler.parentNode.removeChild(styler);
 },duration);
 var child = document.getElementById('glCanvas');
 child.parentNode.insertBefore(styler, child);
 // document.body.appendChild(styler);
}


function winnigMessage(msg)
{
  customAlert(msg,"3000");
}


function set_if_true(expr, arr, key, value) {
    if (expr){
	arr[key][1] = value;
    }
}

function neighbor(mask, index) {
    // up down rup rdown lup ldown
    var k = Math.floor(index/11); // column
    var neighbors = [
	index-1, 
	index+1, 
	11+index, 
	12+index,
	index-12,
	index-11
    ];
    var results = [
	[neighbors[0], 0],
	[neighbors[1], 0],
	[neighbors[2], 0],
	[neighbors[3], 0],
	[neighbors[4], 0],
	[neighbors[5], 0]];
    function if_nab_true(expr, index) {
	set_if_true(expr, 
		    results, 
		    index,
		    mask[neighbors[index]]);
    }
    if_nab_true(neighbors[0] > k*11-1, 0);
    if_nab_true(neighbors[1] < (k+1)*11, 1);
    if_nab_true(neighbors[2] < 121, 2);
    if_nab_true(neighbors[3] < 121, 3);
    if_nab_true(neighbors[4] > 0, 4);
    if_nab_true(neighbors[5] > 0, 5);
    return results;
}

function is_winning(index, limits) {
    if (contains.call(limits, index)) {
	return 1;
    }
    return 0;
}

// [2,3,4,5], [17,18,19], [13]
var paths = {"player1":[], "player2":[]};

function winning(mask, move, index) {
    if (move){
	var limits1 = [0, 11, 22, 33, 44, 55, 66, 77, 88, 99, 110];
	var limits2 = [10, 21, 32, 43, 54, 65, 76, 87, 98, 109, 120];
	var player = "player1";
	var color = 1;
    } else {
	var limits1 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	var limits2 = [110, 111, 112, 113, 114, 115, 
		       116, 117, 118, 119, 120];
	var player = "player2";
	var color = 2;	
    }
    console.log(index);
    // console.log(player);
    // console.log(paths);
    var a = neighbor(mask, index);
    var available = [];
    for (var i = 0; i < a.length; i++) {
	if (a[i][1] == color) {
	    available.push(a[i]);
	}
    }
    if (available.length == 0){
	paths[player].push([index]) //no neighbors, new path
	return 0;
    }
    var insets = {};
    for (var i = 0; i < paths[player].length; i++) { // each path
    	for (var k = 0; k < paths[player][i].length; k++) { //each node in path
	    for (var j = 0; j < available.length; j++) { //neighbor
		if (available[j][0] == paths[player][i][k]){
		    insets[i] = null; //save path indexes *uniquely*
		}
	    }
    	}
    }
    insets = Object.keys(insets);
    var newpath = [];
    if (insets.length == 1){
	paths[player][insets[0]].push(index); // add to path
	newpath = paths[player][insets[0]];
    } else {
	// merge paths[player] and push index node
	newpath = [index];
	for (var i = 0; i < insets.length; i++){
	    Array.prototype.push.apply(newpath, paths[player][insets[i]]);
	    delete paths[player][insets[i]];
	}
	paths[player] = paths[player].filter(function(val){return val});
	paths[player].push(newpath);
    }
    if (newpath.length < 11) {
	return 0;		// no point in checking if path too short
    }
    var l1 = false;
    var l2 = false;
    // win check on new path[player]
    for (var k = 0; k < newpath.length; k++) { //each node in path
	if (is_winning(newpath[k], limits1)) {
	    l1 = true;
	}
	if (is_winning(newpath[k], limits2)) {
	    l2 = true;
	}
    }
    if (l1 && l2) {
	return color;
    }
    return 0;
}

var ALTERNATE = false;

function handleMouseDown(e, offsetX, offsetY, ctx, bounding){
    // get the mouse position
    var mouseX=parseInt(e.clientX-offsetX);
    var mouseY=parseInt(e.clientY-offsetY);
    var mask = bounding[2];
    console.log("x:" + mouseX + ";y:" + mouseY);
    var within = dot_within(mouseX, mouseY, bounding);
    if (within != -1){
	if (ALTERNATE) {
	    hexagon2(ctx, within[1], "#f00");
	    mask[within[0]] = 1;
	} else {
	    hexagon2(ctx, within[1], "#00f");
	    mask[within[0]] = 2;
	}
	var res = winning(mask, ALTERNATE, within[0]);
	if (res != 0){
	    winnigMessage("Winner is player " + res + "!");
	    bounding[2] = [	// reset board
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	    ];
	    var newf = hexagon_field(ctx, "#000", 300, 400);
	    bounding[0] = newf[0];
	    bounding[1] = newf[1];
	    paths["player1"] = [];
	    paths["player2"] = [];
	}
	ALTERNATE = !ALTERNATE;
    }
    
}

function hexagon(ctx, x, y, size, fill){
    var coord = [
	[x, y], [x+size,y], [x+1.6*size,y+0.8*size], 
	[x+size,y+1.6*size], [x, y+1.6*size], [x-0.6*size,y+0.8*size]]
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(coord[0][0], coord[0][1]);
    ctx.lineTo(coord[1][0], coord[1][1]);
    ctx.lineTo(coord[2][0], coord[2][1]);
    ctx.lineTo(coord[3][0], coord[3][1]);
    ctx.lineTo(coord[4][0], coord[4][1]);
    ctx.lineTo(coord[5][0], coord[5][1]);
    ctx.closePath();
    ctx.fill();
    return coord
}

function hexagon2(ctx, coord, fill) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(coord[0][0], coord[0][1]);
    ctx.lineTo(coord[1][0], coord[1][1]);
    ctx.lineTo(coord[2][0], coord[2][1]);
    ctx.lineTo(coord[3][0], coord[3][1]);
    ctx.lineTo(coord[4][0], coord[4][1]);
    ctx.lineTo(coord[5][0], coord[5][1]);
    ctx.closePath();
    ctx.fill();
    return coord    
}


function inside(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf
    // /Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

function dot_within(x, y, b) {
    var board = b[0];
    var hexagons = b[1];
    var bcoords = [[board[0], board[1]],
		   [board[2], board[3]],
		   [board[4], board[5]],
		   [board[6], board[7]]];
    if (!inside([x, y], bcoords)){
	return -1;
    }
    for (var i = 0; i < hexagons.length; i++){
	if (inside([x,y], hexagons[i])){
	    return [i, hexagons[i]];
	}
    }
    return -1;
    
}

function paragram(ctx, coord){
    ctx.fillStyle = "#f00";
    ctx.beginPath();
    ctx.moveTo(coord[0], coord[1]); 		          
    ctx.lineTo(coord[2], coord[3]);
    ctx.lineTo(coord[4], coord[5]);
    ctx.lineTo(coord[6], coord[7]);
    ctx.closePath();
    ctx.stroke();
}

function hexagon_field(ctx, fill, w, h){
    hexagon_coords = [];
    for (var k = 0; k < 11; k++){
	for (var i = 0; i < 11; i++){
	    coord = hexagon(ctx, 10+k*25, 110+18*i-k*10, 10, fill);
	    hexagon_coords.push(coord);
	}
    }
    var bounding = [10-0.6*10, // x1 - upper left
		    110, // y1 - upper left
		    11*25,	// x2 - upper right
		    110-11*10, // y2 - upper right
		    11*25, // x3 - lower right
		    110-10*10+18*11+5,
		    10-0.6*10,
		    110+18*11+5];  
    console.log("bounding rect: " + bounding);
    // paragram(ctx, bounding); 	// board hit box
    return [bounding, hexagon_coords];
}

function main() {
    var occupied = [
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];
    var canvas = document.getElementById('glCanvas');
    var ctx = canvas.getContext('2d');
    var canvasOffset=canvas.getBoundingClientRect();
    var offsetX=canvasOffset.left;
    var offsetY=canvasOffset.top;
    var scrollX=canvas.scrollLeft;
    var scrollY=canvas.scrollTop;
    var b = hexagon_field(ctx, "#000", 300, 400);
    b.push(occupied);
    document.getElementById('glCanvas').onmousedown = function(e){
	handleMouseDown(e, offsetX, offsetY, ctx, b);
    };
}
