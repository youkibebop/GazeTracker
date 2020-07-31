$(document).ready(function() {
	
	//global boolean toggles for pausing tracking, and video/menu displays
	window.pauseToggle = false;
	window.videoToggle = false;
	window.menuToggle = false;
	
	function renderPrediction(prediction){
		
		//make a prediction using the Convolutional neural network
		//exteracts an image of the user's eyes from the current webcam frame
		//and uses the classifier to predict where the user is gazing
		if (model.current_model == null){	
			return;
		} else if (model.isTraining == true){
			console.log("model in training");
			return;
		} 

		console.log("");

		//performance testing of execution time
		var start = window.performance.now();
		console.time('Execution Time');

		//generate a prediction by extracting an image of the user's eyes
		//and inputting it into the Neural Network.
		console.time('model.predict()');
		const gaze_prediction = model.predict();
		console.timeEnd('model.predict()');

		var gaze_x = gaze_prediction[0];
		const gaze_y = gaze_prediction[1];

		/////////////////////////////////////////////////////////////////////
		//Integration Test which checks the validity of the output prediction
		integrationTests.test_prediction_output(gaze_x, gaze_y);
		/////////////////////////////////////////////////////////////////////
		

		//extract the x and y coordinates of the prediciton
		const x = gaze_x * ($('body').width() - pointer.pointer_size);
		const y= gaze_y * (window.innerHeight - pointer.pointer_size);
		
		//for the heatmap, add a datapoint at the location of the pointer
		//plus the offset from the top of the page after scrolling
		const y_offset = y + window.scrollY;

		//if not paused, draw pointer and heatmap
		if (pauseToggle == false){
			pointer.movePointer(x,y);
			heatmap.draw(x,y_offset);	
		}
		

		//performance testing of execution time
		console.timeEnd('Execution Time');
		var end = window.performance.now();
		
		//Performance test: assert execution time isn't longer than 100ms
		var ex_time = end - start;
		var errorMsg = "Execution time was longer than 100ms";
		console.assert(ex_time < 100, {ex_time: ex_time, errorMsg: errorMsg});


		//output prediction result to console
		console.log("Prediction: (" + x + ", " + y + ")");

	}

	//if a model has already been trained in the browser session, load it
	chrome.storage.local.get(['model_trained'], async function(result){
		console.log(result.model_trained);
		if (result.model_trained == true){
			storageFunctions.loadBestModel();
			ui.enableButtons();
			console.log("Model Loaded on Startup");
		}
	});

	////////////////////////////////////////////////////////
	// Process a prediction every 150ms                    //
	////////////////////////////////////////////////////////

	//set the interval at which to refresh the predictions and draw the pointer
	setInterval(renderPrediction, 150);

	////////////////////////////////////////////////////////
	// Process a prediction every 150ms                    //
	////////////////////////////////////////////////////////

});