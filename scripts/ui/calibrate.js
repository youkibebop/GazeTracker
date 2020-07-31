////////////////////////////////////////////////////////////
// TODO:
// Calibration canvas dots
///////////////////////////////////////////////////////////
function dots() {

	//To be integrated in the future. Need to refactor the dot functions and store 
	//the num-clicked value in the HTML element
	
	// function onDotClick(btn, counter){
	// 	c = counter + 1;
	// 	data.getSample();
	// 	if (c == 2) {
	// 		var dot_ui = document.getElementById("cal-ui");
	// 		dot_ui.removeChild(btn);
	// 		return c;
	// 	}
	// 	return c;

	// }

	// Instructions
	var guide = document.createElement("div");
	guide.id = "guide";
	var guide_title = document.createElement("p");
	var guide_text = document.createElement("p");
	guide_title.style.fontWeight = 'bold';
	guide_title.innerHTML = "Calibration Guide:";	
	guide_text.innerHTML = "To capture a training sample for the Neural Net, focus your eyes on each dot, and click each one twice.</br>Capture samples between the dots by focusing on your cursor and pressing the Right Alt key."
	
	guide.appendChild(guide_title);
	guide.appendChild(guide_text);


	// create a div section for calibration layer
	var layer = document.createElement( 'div' );
	layer.id= "cal-ui";
	layer.appendChild(guide);
	layer.setAttribute('data-clicked', '0');

	// Dot 1
	var dot1 = document.createElement("button");
	dot1.id = "Pt1";
    dot1.className = "dot r0 c0";
    dot1.innerHTML = "1";
	var c1 = 0
	dot1.title = "Click me 2 times";
	dot1.onclick = function onClick1() {
        c1 += 1;
        data.getSample();
		if (c1 == 3) {
			layer.removeChild(this);
		}
	};

	// Dot 2
	var dot2 = document.createElement("button");
	dot2.id = "Pt2";
    dot2.className = "dot r0 c1";
    dot2.innerHTML = "2";
	var c2 = 0
	dot2.title = "Click me 2 times";
	dot2.onclick = function onClick2() {
        c2 += 1;
        data.getSample();
		if (c2 == 2) {
			layer.removeChild(this);
		}
	};

	// Dot 3
	var dot3 = document.createElement("button");
	dot3.id = "Pt3";
    dot3.className = "dot r0 c2";
	dot3.innerHTML = "3";
	dot3.title = "Click me 2 times";
	var c3 = 0
	dot3.onclick = function onClick3() {
        c3 += 1;
        data.getSample();
		if (c3 == 2) {
			layer.removeChild(this);
		}
	};

	// Dot 4
	var dot4 = document.createElement("button");
	dot4.id = "Pt4";
    dot4.className = "dot r0 c3";
	dot4.innerHTML = "4";
	dot4.title = "Click me 2 times";
	var c4 = 0
	dot4.onclick = function onClick4() {
        c4 += 1;
        data.getSample();
		if (c4 == 2) {
			layer.removeChild(this);
		}
	};

	// Dot 5
	var dot5 = document.createElement("button");
	dot5.id = "Pt5";
    dot5.className = "dot r0 c4";
	dot5.innerHTML = "5";
	dot5.title = "Click me 2 times";
	var c5 = 0
	dot5.onclick = function onClick5() {
        c5 += 1;
        data.getSample();
		if (c5 == 2) {
			layer.removeChild(this);
		}
	};

	// Dot 6
	var dot6 = document.createElement("button");
	dot6.id = "Pt6";
    dot6.className = "dot r1 c0";
	dot6.innerHTML = "6";
	dot6.title = "Click me 2 times";
	var c6 = 0;
	dot6.onclick = function onClick6() {
        c6 += 1;
        data.getSample();
		if (c6 == 2) {
			layer.removeChild(this);
		}
	};

	// Dot 7
	var dot7 = document.createElement("button");
	dot7.id = "Pt7";
    dot7.className = "dot r1 c1";
	dot7.innerHTML = "7";
	dot7.title = "Click me 2 times";
	var c7 = 0;
	dot7.onclick = function onClick7() {
        c7 += 1;
        data.getSample();
		if (c7 == 2) {
			layer.removeChild(this);
		}
	};

	// Dot 8
	var dot8 = document.createElement("button");
	dot8.id = "Pt8";
    dot8.className = "dot r1 c2";
	dot8.innerHTML = "8";
	dot8.title = "Click me 2 times";
	var c8 = 0;
	dot8.onclick = function onClick8() {
        c8 += 1;
        data.getSample();
		if (c8 == 2) {
			layer.removeChild(this);
		}
	};

	// Dot 9
	var dot9 = document.createElement("button");
	dot9.id = "Pt9";
    dot9.className = "dot r1 c3";
	dot9.innerHTML = "9";
	dot9.title = "Click me 2 times";
	var c9 = 0;
	dot9.onclick = function onClick9() {
        c9 += 1;
        data.getSample();
		if (c9 == 2) {
			layer.removeChild(this);
			
		}
	};
	// Dot 10
	var dot10 = document.createElement("button");
	dot10.id = "Pt10";
    dot10.className = "dot r1 c4";
	dot10.innerHTML = "10";
	dot10.title = "Click me 2 times";
	var c10 = 0;
	dot10.onclick = function onClick10() {
        c10 += 1;
        data.getSample();
		if (c10 == 2) {
			layer.removeChild(this);
			
		}
	};
	// Dot 11
	var dot11 = document.createElement("button");
	dot11.id = "Pt11";
    dot11.className = "dot r2 c0";
	dot11.innerHTML = "11";
	dot11.title = "Click me 2 times";
	var c11 = 0;
	dot11.onclick = function onClick11() {
        c11 += 1;
        data.getSample();
		if (c11 == 2) {
			layer.removeChild(this);
			
		}
	};
	// Dot 12
	var dot12 = document.createElement("button");
	dot12.id = "Pt12";
    dot12.className = "dot r2 c1";
	dot12.innerHTML = "12";
	dot12.title = "Click me 2 times";
	var c12 = 0;
	dot12.onclick = function onClick12() {
        c12 += 1;
        data.getSample();
		if (c12 == 2) {
			layer.removeChild(this);
			
		}
	};

	// Dot 13
	var dot13 = document.createElement("button");
	dot13.id = "Pt13";
    dot13.className = "dot r2 c2";
	dot13.innerHTML = "13";
	dot13.title = "Click me 2 times";
	var c13 = 0;
	dot13.onclick = function onClick13() {
        c13 += 1;
        data.getSample();
		if (c13 == 2) {
			layer.removeChild(this);
			
		}
	};
	// Dot 14
	var dot14 = document.createElement("button");
	dot14.id = "Pt14";
    dot14.className = "dot r2 c3";
	dot14.innerHTML = "14";
	dot14.title = "Click me 2 times";
	var c14 = 0;
	dot14.onclick = function onClick14() {
        c14 += 1;
        data.getSample();
		if (c14 == 2) {
			layer.removeChild(this);
			
		}
	};
	// Dot 15
	var dot15 = document.createElement("button");
	dot15.id = "Pt15";
    dot15.className = "dot r2 c4";
	dot15.innerHTML = "15";
	dot15.title = "Click me 2 times";
	var c15 = 0;
	dot15.onclick = function onClick15() {
        c15 += 1;
        data.getSample();
		if (c15 == 2) {
			layer.removeChild(this);
			
		}
	};			
	// Dot 16
	var dot16 = document.createElement("button");
	dot16.id = "Pt16";
    dot16.className = "dot r3 c0";
	dot16.innerHTML = "16";
	dot16.title = "Click me 2 times";
	var c16 = 0;
	dot16.onclick = function onClick16() {
        c16 += 1;
        data.getSample();
		if (c16 == 2) {
			layer.removeChild(this);
			
		}
	};	
	// Dot 17
	var dot17 = document.createElement("button");
	dot17.id = "Pt17";
    dot17.className = "dot r3 c1";
	dot17.innerHTML = "17";
	dot17.title = "Click me 2 times";
	var c17 = 0;
	dot17.onclick = function onClick17() {
        c17 += 1;
        data.getSample();
		if (c17 == 2) {
			layer.removeChild(this);
			
		}
	};
	// Dot 18
	var dot18 = document.createElement("button");
	dot18.id = "Pt18";
    dot18.className = "dot r3 c2";
	dot18.innerHTML = "18";
	dot18.title = "Click me 2 times";
	var c18 = 0;
	dot18.onclick = function onClick18() {
        c18 += 1;
        data.getSample();
		if (c18 == 2) {
			layer.removeChild(this);
			
		}
	};
	// Dot 19
	var dot19 = document.createElement("button");
	dot19.id = "Pt19";
    dot19.className = "dot r3 c3";
	dot19.innerHTML = "19";
	dot19.title = "Click me 2 times";
	var c19 = 0;
	dot19.onclick = function onClick19() {
        c19 += 1;
        data.getSample();
		if (c19 == 2) {
			layer.removeChild(this);
			
		}
	};
	// Dot 20
	var dot20 = document.createElement("button");
	dot20.id = "Pt20";
    dot20.className = "dot r3 c4";
	dot20.innerHTML = "20";
	dot20.title = "Click me 2 times";
	var c20 = 0;
	dot20.onclick = function onClick20() {
        c20 += 1;
        data.getSample();
		if (c20 == 2) {
			layer.removeChild(this);
			
		}
	};

	// Add all dots to calibration layer
	layer.appendChild(dot1);
	layer.appendChild(dot2);
	layer.appendChild(dot3);
	layer.appendChild(dot4);
	layer.appendChild(dot5);
	layer.appendChild(dot6);
	layer.appendChild(dot7);
	layer.appendChild(dot8);
	layer.appendChild(dot9);
	layer.appendChild(dot10);
	layer.appendChild(dot11);
	layer.appendChild(dot12);
	layer.appendChild(dot13);
	layer.appendChild(dot14);
	layer.appendChild(dot15);
	layer.appendChild(dot16);
	layer.appendChild(dot17);
	layer.appendChild(dot18);
	layer.appendChild(dot19);
	layer.appendChild(dot20);
	

	document.body.appendChild(layer);
}

//dots();