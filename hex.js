main();

function set_if_true(expr, arr, key, value) {
    if (expr){
	arr[key] = value
    }
}

function neighbor(mask, index) {
    // up down rup rdown lup ldown
    var k = Math.floor(index/11); // column
    var neighbors = [
	index-1, index+1, 
	(k+1)*11 + index, (k+1)*11 + index+1,
	(k-1)*11 + index, (k-1)*11 + index+1
    ];
    var results = [0,0,0,0,0,0];
    function if_nab_true(expr, index) {
	set_if_true(expr, results, index, mask[neighbors[index]]);
    }
    console.log("=========");
    console.log(k);
    console.log(k*11-1);
    if_nab_true(neighbors[0] > k*11-1, 0);
    if_nab_true(neighbors[1] < (k+1)*11, 1);
    // if_nab_true(neighbors[2] < 11, 2);
    // if_nab_true(neighbors[3] < 11, 3);
    // if_nab_true(neighbors[4] < 11, 4);
    // if_nab_true(neighbors[5] < 11, 5);
    console.log(neighbors);
    console.log(results);
}

function winning(mask, move, index) {
    // start exploring paths from index until you find
    // valid winning path
    var visited = {};
    console.log(index);
    console.log(neighbor(mask, index));
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
	winning(mask, ALTERNATE, within[0]);	
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
	    coord = hexagon(ctx, 10+k*25, 150+18*i-k*10, 10, fill);
	    hexagon_coords.push(coord);
	}
    }
    var bounding = [10-0.6*10, // x1 - upper left
		    150, // y1 - upper left
		    11*25,	// x2 - upper right
		    150-11*10, // y2 - upper right
		    11*25, // x3 - lower right
		    150-10*10+18*11+5,
		    10-0.6*10,
		    150+18*11+5];  
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
    var b = hexagon_field(ctx, "#000", 640, 480);
    b.push(occupied);
    document.getElementById('glCanvas').onmousedown = function(e){
	handleMouseDown(e, offsetX, offsetY, ctx, b);
    };
}
