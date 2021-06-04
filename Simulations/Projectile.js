var graphed = false;
var layout = {
	title:'Trajectory of the Cannonball',
	xaxis:{
		title: 'X Position (meters)'
	},
	yaxis:{
		title: 'Z Position (meters)'
	}
};
function init() {
	if (graphed) {
		return;
	} else{
		Plotly.newPlot('graph',[],layout);
	}
	return;
}


var g = 9.81;
var rho = 11340;
var rhoAir = 1.23;
var k = 0;
var m = 0;

function f_ri(x, xdot, y, ydot) {
	return xdot;
}

function f_vi(x, xdot, y, ydot) {
	var totV = Math.sqrt(xdot*xdot + ydot*ydot);
	totV *= xdot;
	return -1*k*totV/m;
}

function f_rj(x, xdot, y, ydot) {
	return ydot;
}

function f_vj(x, xdot, y, ydot) {
	var totV = Math.sqrt(xdot*xdot + ydot*ydot);
	totV *= ydot;
	return -1*k*totV/m - g;
}

function f_stop(y) {
	if (y > 0) {
		return true;
	} else {
		return false;
	}
}

function RK4StepN(x, xdot, y, ydot, h) {
	var k1 = new Array(4).fill(0);
	var k2 = new Array(4).fill(0);
	var k3 = new Array(4).fill(0);
	var k4 = new Array(4).fill(0);
	var ytmp = new Array(4).fill(0);

	k1[0] = h*f_ri(x, xdot, y, ydot);
	ytmp[0] = x + k1[0]/2;
	k1[1] = h*f_vi(x, xdot, y, ydot);
	ytmp[1] = xdot + k1[1]/2;
	k1[2] = h*f_rj(x, xdot, y, ydot);
	ytmp[2] = y + k1[2]/2;
	k1[3] = h*f_vj(x, xdot, y, ydot);
	ytmp[3] = ydot + k1[3]/2;

	k2[0] = h*f_ri(ytmp[0], ytmp[1], ytmp[2], ytmp[3]);
	ytmp[0] = x + k2[0]/2;
	k2[1] = h*f_vi(ytmp[0], ytmp[1], ytmp[2], ytmp[3]);
	ytmp[1] = xdot + k2[1]/2;
	k2[2] = h*f_rj(ytmp[0], ytmp[1], ytmp[2], ytmp[3]);
	ytmp[2] = y + k2[2]/2;
	k2[3] = h*f_vj(ytmp[0], ytmp[1], ytmp[2], ytmp[3]);
	ytmp[3] = ydot + k2[3]/2;

	k3[0] = h*f_ri(ytmp[0], ytmp[1], ytmp[2], ytmp[3]);
	ytmp[0] = x + k3[0];
	k3[1] = h*f_vi(ytmp[0], ytmp[1], ytmp[2], ytmp[3]);
	ytmp[1] = xdot + k3[1];
	k3[2] = h*f_rj(ytmp[0], ytmp[1], ytmp[2], ytmp[3]);
	ytmp[2] = y + k3[2];
	k3[3] = h*f_vj(ytmp[0], ytmp[1], ytmp[2], ytmp[3]);
	ytmp[3] = ydot + k3[3];

	k4[0] = h*f_ri(ytmp[0], ytmp[1], ytmp[2], ytmp[3]);
	k4[1] = h*f_vi(ytmp[0], ytmp[1], ytmp[2], ytmp[3]);
	k4[2] = h*f_rj(ytmp[0], ytmp[1], ytmp[2], ytmp[3]);
	k4[3] = h*f_vj(ytmp[0], ytmp[1], ytmp[2], ytmp[3]);

	ytmp[0] = x + k1[0]/6 + k2[0]/3 + k3[0]/3 + k4[0]/6;
	ytmp[1] = xdot + k1[1]/6 + k2[1]/3 + k3[1]/3 + k4[1]/6;
	ytmp[2] = y + k1[2]/6 + k2[2]/3 + k3[2]/3 + k4[2]/6;
	ytmp[3] = ydot + k1[3]/6 + k2[3]/3 + k3[3]/3 + k4[3]/6;

	return ytmp;
}

var xpoints = new Array();
var ypoints = new Array();
function begin() {
	xpoints = [];
	ypoints = [];
	var values = [];
	m = document.getElementById('m').value;
	var thetaDeg = document.getElementById('theta').value;
	var theta = thetaDeg * (Math.PI/180);
	var z = document.getElementById('z').value;
	var muzzleV = document.getElementById('muzzleV').value;

	var r = Math.cbrt(3*m/(rho*4*Math.PI));
	k = rhoAir*Math.PI*r*r/4;

	var x = 0;
	var xdot = muzzleV*Math.cos(theta);
	var y = Number(z);
	var ydot = muzzleV*Math.sin(theta);
	
	do{
		values = RK4StepN(x, xdot, y, ydot, 0.01);
		x = values[0];
		xdot = values[1];
		y = values[2];
		ydot = values[3];
		xpoints.push(x);
		ypoints.push(y);
	} while(f_stop(y) == true);

	var trace = {
		x: xpoints,
		y: ypoints,
		type: 'scatter',
		name: "m="+m+",θ="+thetaDeg+",z0="+z+",V="+muzzleV
	};
	Plotly.addTraces('graph', trace);
	graphed = true;
}

function remove() {
	Plotly.deleteTraces('graph', [-1]);
}

function removeFirst() {
	Plotly.deleteTraces('graph', [0]);
}