 var lightFlagNS = false;
 var lightFlagEW = true;
 var color = ['red', 'green'];
 var speed = [0.25, 0.4];
 var carAcross = [true, true, true, true, true, true, true, true];
 var carStatus = [true, true, true, true, true, true, true, true];
 var carMoving = [false, false, false, false, false, false, false, false];
 var statusNS = true;
 var statusEW = true;

$(document).ready(function() {
	setInterval(function() {
		lightChange();
		traverseCar();
	}, 8000);
});

function lightChange(){
	lightFlagEW = !lightFlagEW;
	lightFlagNS = !lightFlagNS;
	$('.lightNS').css('background-color',color[lightFlagNS+0]);
	$('.lightEW').css('background-color',color[lightFlagEW+0]);
}

function statusCalculate(){
	statusEW = carAcross[0] && carAcross[1] && carAcross[4] && carAcross[5];
	statusNS = carAcross[2] && carAcross[3] && carAcross[6] && carAcross[7];
}

var left1 = [350, 0, -350, 0];
var top1 = [0, -150, 0, 150];

function startMove(id){

	if(carMoving[id]) return;
	carMoving[id] = true;

	var road = parseInt(id/2);
	var type = id % 2;
	var time = Math.abs(left1[road]+top1[road])/speed[type];
	var varLeft = "+=" + left1[road];
	var varTop = "+=" + top1[road];
	var canMoveOn = true;
	
	$('#car'+id).animate({
		left: varLeft,
		top: varTop
	}, time, function(){
		carStatus[id] = false;
		statusCalculate();
		if(0 === road%2){
			canMoveOn = (type||lightFlagEW) && statusNS;
		}else{
			canMoveOn = (type||lightFlagNS) && statusEW;
		}
		if(canMoveOn){
			crossroadAcross(id);
		}
	});
}

var left2 = [250, 0, -250, 0];
var top2 = [0, -250, 0, 250];

function crossroadAcross(id){
	var road = parseInt(id/2);
	var type = id % 2;
	var varLeft = "+=" + left2[road];
	var varTop = "+=" + top2[road];
	var time = 250/speed[type]-200;

	carStatus[id] = true;
	carAcross[id] = false;

	$('#car'+id).animate({
		left: varLeft,
		top: varTop
	}, time, 'linear', function(){
		carAcross[id] = true;
		traverseCar();
		continueMove(id);
	});
}


var left3 = [350, 0, -350, 0];
var top3 = [0, -150, 0, 150];
var left4 = [-950, 0, 950, 0];
var top4 = [0, 550, 0, -550];

function continueMove(id){
	var road = parseInt(id/2);
	var type = id % 2;
	var varLeft = "+=" + left3[road];
	var varTop = "+=" + top3[road];
	var returnLeft = "+=" + left4[road];
	var returnTop = "+=" + top4[road];
	var time = Math.abs(left3[road]+top3[road])/speed[type]-200;

	$('#car'+id).animate({
		left: varLeft,
		top: varTop
	}, time, 'linear', function(){
		carMoving[id] = false;
		$('#car'+id).css({
			'left': returnLeft,
			'top': returnTop
		});
	});
}

function traverseCar(){
	statusCalculate();
	for(var i = 0; i < 8; ++i){
		if(carStatus[i]) continue;
		road = parseInt(i/2);
		type = i % 2;
		var canMoveOn = true;
		if(0 === road%2){
			canMoveOn = (type||lightFlagEW) && statusNS;
		}else{
			canMoveOn = (type||lightFlagNS) && statusEW;
		}		
		if(canMoveOn){
			crossroadAcross(i);
		}
	}
}
