$(document).ready(function() {
    window.ui = {

        //when the calibration process ends, hide the calibration interface
        onCalEnd: function(){
            var btn = document.getElementById('cal_btn');

            //hide calibration dots
            btn.innerHTML = "Calibrate";
            var dots = document.getElementById("cal-ui");
            if (dots != null){
                document.body.removeChild(dots);
            }
            return;
        },
    
        //show the calibration interface
        onCalStart: function(btn){
            //show calibration dots
            if (btn != null){
                dots();
                btn.innerHTML = "Stop Calibrating";
            }
        },

        //toggle the training button and  train the convolutuional neural network
        onTrainPossible: function(msg){
            var tbtn = document.getElementById("train_btn");
            tbtn.innerHTML = msg;
			if (tbtn != null){
				tbtn.className = "button t-btn";
				tbtn.disabled = false;
			}
        },


        //toggle the training button and  train the convolutuional neural network
        onTrainStart: function(btn){
            if (btn != null){
                btn.innerHTML = "In Training...";
                btn.className = "button disabled t-btn";
                btn.disabled = true;
                btn.title = "";
            }
            ui.onCalEnd();
            return;
        },

        
        //clear the stored heatmap
        onClearHeatmap: async function(btn){
            if (btn != null){
                btn.innerHTML = "Clearing...";
                btn.className = "button disabled h-btn";
                btn.disabled = true;
                await heatmap.clearHeatmap();
                if (model.current_model == null || pauseToggle == true){
                    await heatmap.heat.draw();
                }
                btn.innerHTML = "Clear Heatmap";
                btn.className = "button h-btn";
                btn.disabled = false;
            
            }
            
        },
        
        //toggle heatmap display
        onToggleHeatmap: function(btn){
            var hm = document.getElementById("heatmap-container");
            
            //show heatmap display
            if (heatmap.display == false){
                heatmap.display = true;
                hm.style.display = 'block';
                btn.innerHTML = "Hide Heatmap";
            
            //hide heatmap display
            } else {
                heatmap.display = false;
                hm.style.display = 'none';
                btn.innerHTML = "Show Heatmap";
            }    
        },

        //toggle display of red pointer predicting gaze location
        onTogglePointer: function(btn){
            var p = document.getElementById("pointer");
            
            //show pointer
            if (pointer.isHidden == false){
                pointer.isHidden = true;
                p.style.display = 'none';
                btn.innerHTML = "Show Pointer";
            
            //hide pointer
            } else {
                pointer.isHidden = false;
                p.style.display = 'block';
                btn.innerHTML = "Hide Pointer";
            }    
        },

        //pause or resume gaze tracking
        onTogglePause: function(btn, tog){
            if (tog == false){
                btn.innerHTML = "Resume Tracking";
            } else {
                btn.innerHTML = "Pause Tracking";
            }    
        },

        //show or hide webcam stream video
        onToggleVideo: function(btn,tog){
            var v = document.getElementById('webcam-video');
            var o = document.getElementById('overlay');
            
            if (tog == false){
                btn.innerHTML = "+";
                btn.title = "Show Video";
                v.style.display = "none";
                o.style.display = "none";
            } else {
                btn.innerHTML = "-";
                btn.title = "Hide Video";
                v.style.display = "block";
                o.style.display = "block";
            }    
        },


        //show or hide menu interface
        onToggleMenu: function(btn,tog){
            var interface = document.getElementById('interface');
    
            if (tog == false){
                btn.innerHTML = "+";
                btn.title = "Show Menu";
                interface.style.display = "none";
                
            } else {
                btn.innerHTML = "-";
                btn.title = "Hide Menu";
                interface.style.display = "block";
                
            }    
        },        

        //when the neural network model has been trained, enable all the buttons that were disabled on startup
        //buttons: toggle heatmap, clear heatmap, reset model, toggle pointer, pause tracking
        enableButtons: function(){
            var tog = document.getElementById("toggle-heatmap");
            var clr = document.getElementById("clear-heatmap");
            var rst = document.getElementById("reset-model");
            var ptr = document.getElementById("toggle-pointer");
            var ps = document.getElementById("pause-track");
            
            clr.className = "button h-btn";
            clr.disabled = false;
            clr.title = "";
            tog.innerHTML = "Hide Heatmap";
            tog.className = "button h-btn";
            tog.disabled = false;
            tog.title = "";

            rst.className = "button t-btn";
            rst.disabled = false;
            rst.title = "";

            if (pointer.isHidden){
                ptr.innerHTML = "Show Pointer";
            } else {
                ptr.innerHTML = "Hide Pointer";
            }
            ptr.className = "button ptr-btn";
            ptr.disabled = false;
            ptr.title = "";

            if (pauseToggle == false){
                ps.innerHTML = "Pause Tracking";
            }  else {
                ps.innerHTML = "Resume Tracking";
            } 

            ps.className = "button p-btn";
            ps.disabled = false;
            ps.title = "";
            

        },

    };

});