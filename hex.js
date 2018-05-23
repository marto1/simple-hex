main();


function handleMouseDown(e, offsetX, offsetY, ctx, bounding){
    // get the mouse position
    var mouseX=parseInt(e.clientX-offsetX);
    var mouseY=parseInt(e.clientY-offsetY);
    console.log("x:" + mouseX + ";y:" + mouseY);
    console.log(dot_within(mouseX, mouseY, bounding));
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
	    return i;
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
    paragram(ctx, bounding); 	// board hit box
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
    document.getElementById('glCanvas').onmousedown = function(e){
	handleMouseDown(e, offsetX, offsetY, ctx, b);
    };
}
