
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

					//toggle disabled buttons. allow heatmap toggling and model reset
					ui.enableButtons();
					
				},
			},
		});
	},

	resetModel: function() {
		model.current_model = null;

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