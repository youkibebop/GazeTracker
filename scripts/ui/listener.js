$(document).ready(function() {
    //when Right Alt key is pressed, collect a new sample image of the user's eyes
    $('body').keyup(function(e) {
        if (e.keyCode === 18) {
            //get a sample image of the user's eyes, and add it to the dataset as a tensor
            data.getSample();
            e.preventDefault();
            return false;
        }
    });
    
    //when the calibration button is clicked, start training.
    $('#cal_btn').click(function(e) {
        if (this != null && this.innerHTML === "Stop Calibrating"){
            ui.onCalEnd();
        } else {
            ui.onCalStart(this);
        }
    });

    //when the training button is clicked, start training.
    $('#train_btn').click(async function(e) {
        ui.onTrainStart(this);
        //await ui.onTrainStart(this);
        //train the convolutional neural network
        model.trainModel();
    });

    //when the training button is clicked, start training.
    $('#clear-heatmap').click(function(e) {
        //var ch_btn = document.getElementById("clear-heatmap");
        ui.onClearHeatmap(this);
    });

    //when the training button is clicked, start training.
    $('#toggle-heatmap').click(function(e) {
        ui.onToggleHeatmap(this);
    });

    //when the training button is clicked, reset the neural network model and toggle buttons disabled.
    $('#reset-model').click(function(e) {
        heatmap.display = true;
        model.resetModel();
        if (pointer.isHidden == false){
            var btn = document.getElementById('toggle-pointer');
            ui.onTogglePointer(btn);
        }
    });
    
    //toggle display of red pointer
    $('#toggle-pointer').click(function(e) {
        ui.onTogglePointer(this);
    });
    
        //toggle display of red pointer
    $('#pause-track').click(function(e) {
        ui.onTogglePause(this, pauseToggle);
        pauseToggle = !pauseToggle;
        var pauseMessage = pauseToggle ? "Tracking Paused" : "Tracking Resumed";
        console.log(pauseMessage);
    });

    //toggle display of webcam stream
    $('#video-toggle').click(function(e) {
        ui.onToggleVideo(this, videoToggle);
        videoToggle = !videoToggle;
        var videoMessage = videoToggle ? "Video Hidden" : "Video Shown";
        console.log(videoMessage);
    });

    //toggle display of sidebar menu
    $('#menu-toggle').click(function(e) {
        ui.onToggleMenu(this, menuToggle);
        menuToggle = !menuToggle;
        var menuMessage = menuToggle ? "Menu Hidden" : "Menu Shown";
        console.log(menuMessage);
    });

});