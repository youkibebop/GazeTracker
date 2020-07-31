///////////////////////////////////////////////////////////////////////
/// DATA.JS  //////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

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
