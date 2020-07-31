import * as tf from '@tensorflow/tfjs';
import '@babel/polyfill';

////////////////////////////////////////////////////////////////
//////// Convolutional Neural Network using Tensorflow. ////////
////////     Contains Data.js and Model.js modules      ////////
////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
/// DATA.JS  ///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

//global data object, which stores training and validation datasets
//also features functions for capturing samples and adding them to the datasets
window.data = {
	
	//width and height of training samples
	sampleWidth: $('#eyes').width(),
	sampleHeight: $('#eyes').height(),

	//training and validation data for training a Convolutional Neural Network
	//'a' stores a tensor representing an image of the user's eyes
	//'b' stores a 1D tensor representing the XY coordinates of a cursor.
	//n is the size of each dataset
	training_data: {
		n: 0,
		a: null,
		b: null,
	},
	validation_data: {
		n: 0,
		a: null,
		b: null,
	},
	
	//https://cpury.github.io/learning-where-you-are-looking-at/
	//Retrieves an image from an HTML canvas and converts it into a TensorFlow tensor
	getTensor: function(){
		return tf.tidy(function() {

			//Retrieves an image from an HTML canvas and converts it into a TensorFlow tensor
			const image = tf.browser.fromPixels(document.getElementById('eyes'));
			//Adds a batch dimension to the tensor
			const batched_img = image.expandDims(0);
			//converts the batched tensor into appropriate form for input into a Conv. Neural Network
			return batched_img
				.toFloat()
				.div(tf.scalar(127))
				.sub(tf.scalar(1));
		});
	},

	//collects a training sample by cropping a rectangular image of the user's eyes out of a webcam frame
	getSample: function(){
		tf.tidy(function() {
			//extract an image of the user's eyes and store it as a TF tensor.
			const img_tensor = data.getTensor();
			//get the cursor position on the window
			const mouseXY = cursor.getCursorPos();
			mouseXY[0] = mouseXY[0] -0.5;
			mouseXY[1] = mouseXY[1] -0.5;

			//store the mouse position as a 1D tensor
			var mouse_tensor = tf.tidy(function() {
				return tf.tensor1d(mouseXY).expandDims(0);
			});

			//add sample tensors to a dataset.
			data.addSample(img_tensor, mouse_tensor);

		});
	},

	
	testGetSample: function(){
		tf.tidy(function() {
			//extract an image of the user's eyes and store it as a TF tensor.
			const img_tensor = data.getTensor();
			
			var mouseXY = [];
			mouseXY.push(Math.random() -0.5);
			mouseXY.push(Math.random() -0.5);
			
			//store the mouse position as a 1D tensor
			mouse_tensor = tf.tidy(function() {
				return tf.tensor1d(mouseXY).expandDims(0);
			});

			//add sample tensors to a dataset.
			data.addSample(img_tensor, mouse_tensor);
		});
	},
	
	//Add Samples to either a training or validation data set in the global "data" object
	addSample: function(img_tensor, mouse_tensor){
		//choose whether to add to training dataset or validation dataset.
		//80% of the sample will be training data, 20% validation data
		var key = Math.random() > 0.2 ? 'training_data' : 'validation_data';
		const set = data[key];
		
		//if the datasets are empty, add the tensors to the empty set
		if (set.a == null){
			set.a = tf.keep(img_tensor);
			set.b = tf.keep(mouse_tensor);
		
		//if the sets aren't empty, concatenate the new tensor with 
		//the previously stored tensor
		} else {
			const old_img_tensor = set.a;
			set.a = tf.keep(old_img_tensor.concat(img_tensor, 0));

			const old_mouse_tensor = set.b;
			set.b = tf.keep(old_mouse_tensor.concat(mouse_tensor, 0));

			old_img_tensor.dispose();
			old_mouse_tensor.dispose();
			mouse_tensor.dispose();
		}
		//increment the size of the set.
		set.n += 1;

		//update the UI
		data.onAddSample(data.training_data.n + data.validation_data.n, key);
	},
	
	//Update the UI with size of training and val datasets
	onAddSample: function(n, key){
		if (data.validation_data.n > 1){
			ui.onTrainPossible("Start Training");
		}
		var sample_num = null;
		if (key =='training_data'){
			sample_num = document.getElementById("num_train");
			if (sample_num != null){
				sample_num.innerHTML = data.training_data.n;
			}
		} else {
			sample_num = document.getElementById("num_val");
			if (sample_num != null){
				sample_num.innerHTML = data.validation_data.n;
			}
		}	
	},
};

///////////////////////////////////////////////////////////////////////
/// MODEL.JS  /////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

//global variable, which stores a Convolutional Neural Network
// The CNN has 2 hidden convolutional layers, 2 max pooling layers, and a dropout layer
//features functions to train the Neural Network
//and a function to make a prediction when a sample is inputted into the NN
window.model ={
	current_model: null,
	isTraining: false,

	//inspired by tutorials from:
	//https://rubikscode.net/2019/03/25/image-classification-with-tensorflow-js/
	//https://github.com/cpury/lookie-lookie
	//Convolutional Neural Network with 2 hidden layers and 2 max pooling layers

	createCNNModel: function() {
		
		//define the input format
		const input_img_tensor = tf.input({
			name: 'image',
			shape: [data.sampleHeight, data.sampleWidth, 3],
		});


		//first hidden layer
		const convolutional_layer_1 = tf.layers
		.conv2d({
			kernelSize: 5,
			filters: 20,
			strides: 1,
			activation: 'relu',
			kernelInitializer: 'varianceScaling',
		})
		.apply(input_img_tensor);

		//first max pooling layer
		const max_pool_layer_1 = tf.layers
		.maxPooling2d({
			poolSize: [2, 2],
			strides: [2, 2],
		})
		.apply(convolutional_layer_1);

		//second convolutional layer
		const convolutional_layer_2 = tf.layers
		.conv2d({
			kernelSize: 5,
			filters: 40,
			strides: 1,
			activation: 'relu',
			kernelInitializer: 'varianceScaling',
		})
		.apply(max_pool_layer_1);

		//second max pooling layer
		const max_pool_layer_2 = tf.layers
		.maxPooling2d({
			poolSize: [2, 2],
			strides: [2, 2],
		})
		.apply(convolutional_layer_2);

		//flatten the data for efficient processing
		const flat = tf.layers.flatten().apply(max_pool_layer_2);

		//dropout layer
		const dropout = tf.layers.dropout(0.2).apply(flat);


		//Use this line when incorporating metainfo for better accuracy
		//const concat = tf.layers.concatenate().apply(dropout);

		//output of the neural network appplies all the previous layers in order, using the .apply() function
		const output = tf.layers
		.dense({
			//output units = 2, because it represents an XY coordinate of a cursor's position 
			//maps the user's gaze to an XY position in the webpage.
			units: 2,
			//use the tanh activation function
			activation: 'tanh',
			kernelInitializer: 'varianceScaling',
		})
		.apply(dropout);

		//the Convolutional Neural Network model is defined by the inputs and output
		const model = tf.model({
			inputs: input_img_tensor,
			outputs: output,
		});

		return model;
	},

	//trains the neural network with the dataset stored in the global "data" object
	trainModel: async function() {
		
		model.isTraining = true;
		
		//if the model hasn't been created yet, generate a new one.
		if (model.current_model == null){
			model.current_model = model.createCNNModel();
		}

		//compile the model 
		model.current_model.compile({
			//use the "Adam" learning rate optimisation algorithm
			optimizer: tf.train.adam(0.0005),
			//set loss function to meanSquaredError
			loss: 'meanSquaredError',
		});
		

		//the following code is adapted from cpury @ https://github.com/cpury/lookie-lookie
		//after all training epochs save the best model based on training and validation loss


		//set the batch size to be 1/10th of the training data as long as the size of the batch is 
		//greater than 4 and no greater than 64
		let batchSize = Math.max(4, Math.min(Math.floor(data.training_data.n * 0.1), 64));
		
		let bestEpoch = -1;
		let bestTrainLoss = Number.MAX_SAFE_INTEGER;
		let bestValLoss = Number.MAX_SAFE_INTEGER;
		const bestModelPath = 'localstorage://best-model';
		
		//Train the Convolutional Neural network with the training data.
		//repeat for 10 epochs
		//and choose the model from the epoch with the smallest loss on the validation data
		await model.current_model.fit(data.training_data.a, data.training_data.b, {
			batchSize: batchSize,
			epochs: 10,
			shuffle: true,
			validationData: [data.validation_data.a, data.validation_data.b],
			callbacks: {
				//At the end of each epoch
				onEpochEnd: async function(epoch, logs) {

					//model.epochsTrained += 1;

					// Store the best model with the smallest loss on the validation data:
					if (logs.val_loss < bestValLoss) {
					// Save model
						bestEpoch = epoch;
						bestTrainLoss = logs.loss;
						bestValLoss = logs.val_loss;
			
						//save the model in local storage
						await model.current_model.save(bestModelPath);
					}
		
					return await tf.nextFrame();
				},
				//When the model is finished training
				onTrainEnd: async function() {
					model.isTraining = false;


					ui.onTrainPossible("Train Again");

					//Load the model with the smallest loss on the validation data
					model.current_model = await tf.loadLayersModel(bestModelPath);

					storageFunctions.isModelTrained(true);

					//toggle disabled buttons. allow heatmap toggling and model reset
					ui.enableButtons();
					
				},
			},
		});
	},

	resetModel: function() {
		model.current_model = null;
		storageFunctions.isModelTrained(false);

	},

	//Function, which takes an image of the user's eyes, inputs it into a Convolutional Neural network,
	//and returns a prediction as to the coordinates on the webpage, the user is focusing on
	//based on the training data supplied and used to train the neural network
	predict: function(){

		if (model.current_model == null){			
			console.error("Prediction was called, but model does not exist.")
			return;
		}

		return tf.tidy(function() {
			//extract the eye region image from a webcam stream and convert it to a tensor
			let img_tensor = data.getTensor();
			//console.log(model.current_model);
			//make a precition using the current conv. NN model
			const prediction = model.current_model.predict(img_tensor);

			//return the results of the prediction -> XY mouse coordinates
			//dataSync() is a tensorflow function which allows access to specific values in the returned tensor -> in this case, the output
			//predictions are between -0.5 and 0.5 so adjust to make it between 0 and 1
			return [prediction.dataSync()[0] + 0.5, prediction.dataSync()[1] + 0.5];
		});
	}
}

window.storageFunctions = {
	isModelTrained: function(x){
		chrome.storage.local.set({model_trained: x}, function() {
			console.log('model_trained set to ' + x);
		});
	},
	loadBestModel: async function(){
		model.current_model = await tf.loadLayersModel('localstorage://best-model');
	},
}
