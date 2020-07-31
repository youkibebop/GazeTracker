window.integrationTests = {
    testSuccess: true,
    
    //tests that the output of the neural network prediction is valid
    test_prediction_output: function(x,y){
        console.assert(!isNaN(x) && x != null, {x: x, errorMsg: "Calling model.predict() returned an invalid x-value"});
        console.assert(!isNaN(y) && y != null, {y: y, errorMsg: "Calling model.predict() returned an invalid y-value"});
        console.assert(y != null, {y:y, errorMsg: "Calling model.predict() returned an invalid y-value"});
        console.assert(x < 1, {x: x, errorMsg: "Calling model.predict() returned an out-of-bounds x-value"});
		console.assert(y < 1, {y: y, errorMsg: "Calling model.predict() returned an out-of-bounds y-value"});
		console.assert(x > 0, {x: x, errorMsg: "Calling model.predict() returned a negative x-value"});
		console.assert(y > 0, {y: y, errorMsg: "Calling model.predict() returned a negative y-value"});
        if (isNaN(x) || x == null || isNaN(y) || y == null || x < 0 || y < 0 || x > 1 || y > 1){
            integrationTests.testSuccess = false;
            return false;
            
        }
        return true;
    },

    //mocks mouse.getCursorPos()
    mock_getCursorPos: function(){
        const x = Math.random();
        const y = Math.random();
        return [x,y];
    },
    

    //simulates registering 
    test_data_capture: function(){
        //original dataset before data capture
        // const init_training_set = data.training_data;
        // const init_val_set = data.val_data'
        data.getSampleTest()
        

    },


    


};