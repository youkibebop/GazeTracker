//track mouse movement
document.onmousemove = function(e){
    var x = e.pageX;
    var y = e.pageY;
};
//track mouse clicks
document.onclick = function(e){
    var x = e.pageX;
    var y = e.pageY;
    //console.log(" " + x +" " + y);
};


//Add HTML elements for gaze tracking to the webpage the user is browsing
function setUp_HTML_Elements(){
	console.log($('body').height());
	
	//add the CSS style sheet which defines the appearance and behaviour of the elements below
	var style_sheet = document.createElement('link');
	style_sheet.rel="stylesheet";
	style_sheet.href="style.css";
	document.head.appendChild(style_sheet);

	//pointer element which displays the prediction of the user's gaze location
	var pointer_HTML = document.createElement( 'div' );
	pointer_HTML.id = "pointer";
		
	//video element to display webcam stream
	var video_HTML = document.createElement( 'video' );
	video_HTML.id = "webcam-video";
	video_HTML.width = "320";
	video_HTML.height = "240";
	video_HTML.autoplay = true;

	//canvas element to capture the user's eyes from the webcam stream
	var eyes_HTML = document.createElement( 'canvas' );
	eyes_HTML.id = "eyes";
	eyes_HTML.width = "40";
	eyes_HTML.height = "20";

	//canvas element to display facial landmark overlay
	var overlay_HTML = document.createElement( 'canvas' );
	overlay_HTML.id = "overlay";
	overlay_HTML.width = "320";
	overlay_HTML.height = "240";

	//container for the heatmap display
	var heatmap_container = document.createElement( 'div' );
	heatmap_container.id = "heatmap-container";

	//canvas to draw the heatmap
	var heatmap_canvas = document.createElement( 'canvas' );
	heatmap_canvas.id = "heatmap-canvas";

	//add the heatmap to the html page
	heatmap_container.appendChild(heatmap_canvas);


////////////////////////////////////////////////////////////////
//////// COMMENT THIS OUT AFTER POPUP MENU IS FUCNTIONAL////////
////////////////////////////////////////////////////////////////

	Calibration_Menu_Setup();

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

	//Add all the created HTML elements to the webpage
	document.body.appendChild(video_HTML);
	document.body.appendChild(overlay_HTML);
	document.body.appendChild(eyes_HTML);
	document.body.appendChild(pointer_HTML);
	document.body.appendChild(heatmap_container);	
}

//Set up the HTML elements for the menu UI
function Calibration_Menu_Setup(){
	
	//create div for menu UI
	var interface = document.createElement( 'div' );
	interface.id = "interface";

	//create a table for displaying information about the training samples collected
	var menu_table = document.createElement( 'table' );
	var tr1 = document.createElement( 'tr' );
	var td1a = document.createElement( 'td' );
	var td1b = document.createElement( 'td' );
	var tr2 = document.createElement( 'tr' );
	var td2a = document.createElement( 'td' );
	var td2b = document.createElement( 'td' );
	

	td1a.innerHTML = "Training examples";
	td1b.id = "num_train"; 
	td1b.dataset.content = "n-train"; 
	td1b.innerHTML = "0";
	td2a.innerHTML = "Validation examples";
	td2b.id = "num_val"; 
	td2b.dataset.content = "n-val"; 
	td2b.innerHTML = "0";

	tr1.appendChild(td1a);
	tr1.appendChild(td1b);
	tr2.appendChild(td2a);
	tr2.appendChild(td2b);
	menu_table.appendChild(tr1);
	menu_table.appendChild(tr2);
	

	//create a div for the buttons
	var interface_2 = document.createElement( 'div' );
	
	var cal_button = document.createElement( 'button' );
	cal_button.id = "cal_btn";
	cal_button.className = "button t-btn";
	cal_button.style.display = "block";
	cal_button.innerHTML = "Calibrate";
	cal_button.disabled = false;
	cal_button.title = "Collect training samples";

	
	var train_button = document.createElement( 'button' );
	train_button.id = "train_btn";
	train_button.className = "button disabled t-btn";
	train_button.style.display = "block";
	train_button.innerHTML = "Start Training";
	train_button.disabled = true;
	train_button.title = "Collect more samples";


	var reset_button = document.createElement( 'button' );
	reset_button.id = "reset-model";
	reset_button.className = "button disabled t-btn";
	reset_button.style.display = "block";
	reset_button.innerHTML = "Reset Model";
	reset_button.disabled = true;
	reset_button.title = "Neural Network not trained";

	var heatmap_tog_button = document.createElement( 'button' );
	heatmap_tog_button.id = "toggle-heatmap";
	heatmap_tog_button.className = "button disabled h-btn";
	heatmap_tog_button.style.display = "block";
	heatmap_tog_button.innerHTML = "Toggle Heatmap";
	heatmap_tog_button.disabled = true;
	heatmap_tog_button.title = "Neural Network not trained";

	var clear_heatmap_button = document.createElement( 'button' );
	clear_heatmap_button.id = "clear-heatmap";
	clear_heatmap_button.className = "button disabled h-btn";
	clear_heatmap_button.style.display = "block";
	clear_heatmap_button.innerHTML = "Clear Heatmap";
	clear_heatmap_button.disabled = true;
	clear_heatmap_button.title = "Neural Network not trained";

	//Screenshot button for future implementation
	// var screenshot_button = document.createElement( 'button' );
	// screenshot_button.id = "save-screenshot";
	// screenshot_button.className = "button";
	// screenshot_button.style.display = "block";
	// screenshot_button.innerHTML = "Screenshot";
	// screenshot_button.disabled = false;
	// screenshot_button.title = "Save browser screenshot";

	var pointer_tog_button = document.createElement( 'button' );
	pointer_tog_button.id = "toggle-pointer";
	pointer_tog_button.className = "button disabled ptr-btn";
	pointer_tog_button.style.display = "block";
	pointer_tog_button.innerHTML = "Toggle Pointer";
	pointer_tog_button.disabled = true;
	pointer_tog_button.title = "Neural Network not trained";


	var pause_button = document.createElement( 'button' );
	pause_button.id = "pause-track";
	pause_button.className = "button disabled p-btn";
	pause_button.style.display = "block";
	pause_button.innerHTML = "Pause Tracking";
	pause_button.disabled = true;
	pause_button.title = "Neural Network not trained";

	//add all the buttons to the UI
	interface_2.appendChild(cal_button);
	interface_2.appendChild(train_button);
	interface_2.appendChild(reset_button);
	interface_2.appendChild(heatmap_tog_button);
	interface_2.appendChild(clear_heatmap_button);
	interface_2.appendChild(pointer_tog_button);
	interface_2.appendChild(pause_button);


	//create a div for usage tips
	var interface_3 = document.createElement( 'div' );
	var instructions = document.createElement('p');
	instructions.innerHTML = "Tip: If the gaze tracker isn't very accurate, you will want to re-train it with a few more training samples. To capture a new sample, focus on your cursor with your eyes, and hit the right Alt key. After you've captured a bunch of samples, press the 'Start Training' button again to re-train the neural network";
	interface_3.appendChild(instructions);

	//add all the components of the UI together
	interface.appendChild(menu_table);
	interface.appendChild(interface_2);
	interface.appendChild(interface_3);


	//Add the Menu UI to the HTML page
	document.body.appendChild(interface);


	var video_hide_button = document.createElement( 'button' );
	video_hide_button.id = 'video-toggle';
	video_hide_button.innerHTML = '-';
	video_hide_button.title = "Hide Video";

	document.body.appendChild(video_hide_button);



	var menu_hide_button = document.createElement( 'button' );
	menu_hide_button.id = 'menu-toggle';
	menu_hide_button.innerHTML = '-';
	menu_hide_button.title = "Hide Menu";

	document.body.appendChild(menu_hide_button);	

}


setUp_HTML_Elements();