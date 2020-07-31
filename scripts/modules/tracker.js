///////////////////////////////////////////////////////////////////////
/// TRACKER.JS  ///////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
//Sets up the Video recording and Facial Landmark Tracking using the
//clmtrackr.js Face Tracking Library
//This module was inspired by Max 'cpury' who developed a gaze tracker 
//here at https://github.com/cpury/lookie-lookie. Many of the set up functions
//were adapted from his the video and tracking set-up functions he wrote.

$(document).ready(function() {
        
    const video = document.getElementById('webcam-video');
    const overlay = document.getElementById('overlay');

    //Video capture functions adapted from cpury @ https://github.com/cpury/lookie-lookie
    window.tracker = {
        video: video,
        //video dimensions
        vid_width: video.width,
        vid_height: video.height,
        vid_vidWidth: video.videoWidth,
        vid_vidHeight: video.videoHeight,
        
        //HTML overlay element for displaying graphics
        overlay: overlay,
        overlay_ctx: overlay.getContext('2d'),
        
        trackingStarted: false,
        
        //stores 64 facial features as coordinates, having been extracted by clmtrackr.js
        face_positions: null,
        //the current image of the user's eyes for a particular frame
        //to be used as an input into the Convolutional Neural network
        eye_canvas: null,


        //set up the video stream
        setUpStream: function(stream) {
            if ('srcObject' in tracker.video) {
                tracker.video.srcObject = stream;
            } else {
                tracker.video.src =
                window.URL && window.URL.createObjectURL(stream);
            }
            tracker.video.onloadedmetadata = function() {
                tracker.video.play();
            };
            tracker.video.onresize = function() {
                if (tracker.trackingStarted) {
                    tracker.clm_facetracker.stop();
                    tracker.clm_facetracker.reset();
                    tracker.clm_facetracker.start(tracker.video);
                }
            };
        },

        //start the webcam stream and display it on the webpage
        startVideo: function() {
            // start webcam stream to page
            tracker.video.play();
            // use clm to track face in video element
            tracker.clm_facetracker.start(tracker.video);
            tracker.trackingStarted = true;
            // use clmtrackr to extract the user's facial features
            tracker.getFacialFeatures();
        },

        getFacialFeatures: function() {
            // Check if a face is detected, and if so, track it.
            requestAnimationFrame(tracker.getFacialFeatures);

            //get the facial feature positions.
            tracker.face_positions = tracker.clm_facetracker.getCurrentPosition();
            
            //clear the overlay canvas so that new graphics can be drawn on the page.
            tracker.overlay_ctx.clearRect(
                0,
                0,
                tracker.vid_width,
                tracker.vid_height,
            );

            //if the clm_facetracker has returned a list of facial feature positions...
            if (tracker.face_positions) {

                
                //extract the eye region of the user from the webcam stream frame
                tracker.trackFace(tracker.face_positions);
                
                ////draw over the relevant facial features in the webpage, so that the user can see if their 
                //face is being accurately detected
                tracker.clm_facetracker.draw(tracker.overlay);
            }
        },

        
        //adapted from cpury @ https://cpury.github.io/learning-where-you-are-looking-at/
        // get a rectangle surrounding the eyes from clmtrackr vertices
        getEyes: function(position) {
            // Given a tracked face, returns a rectangle surrounding the eyes.
            const minX = position[19][0];
            const maxX = position[15][0];
            const minY =
                Math.min(
                position[20][1],
                position[21][1],
                position[17][1],
                position[16][1],
                ) + 6;
            const maxY =
                Math.max(
                position[23][1],
                position[26][1],
                position[31][1],
                position[28][1],
                ) + 3;

            const width = maxX - minX;
            const height = maxY - minY - 5;

            return [minX, minY, width, height * 1.25];
        },

        //adapted from cpury @ https://cpury.github.io/learning-where-you-are-looking-at/
        // draw a rectangle surrounding the user's eyes in an HTML canvas.
        //this will be turned into a tensor and used as inputs into a neural network
        trackFace: function(positions) {
            // Given a tracked face, crops out the eyes and draws them in the eyes canvas.
            const rect = tracker.getEyes(positions);
            tracker.eye_canvas = rect;

            const eyesCanvas = document.getElementById('eyes');
            const eyesCtx = eyesCanvas.getContext('2d');

            // resize the eye canvas to the correct size for input into the neural network
            const resizeFactorX = video.videoWidth / video.width;
            const resizeFactorY =video.videoHeight / video.height; 
            
            //draw the eyes onto the webpage, so that the user can tell that their eyes are being accurately tracked
            eyesCtx.drawImage(
                tracker.video,
                rect[0] * resizeFactorX,
                rect[1] * resizeFactorY,
                rect[2] * resizeFactorX,
                rect[3] * resizeFactorY,
                0,
                0,
                eyesCanvas.width,
                eyesCanvas.height,
            );
        },
    };

    //Alert that the video is ready to start playing
    //callback -> start the video
    video.addEventListener('canplay', tracker.startVideo, false);

    // adapted from cpury @ https://cpury.github.io/learning-where-you-are-looking-at/
    // set up video
    if (navigator.mediaDevices) {
        navigator.mediaDevices
        .getUserMedia({
            video: true,
        })
        .then(tracker.setUpStream);
    } else if (navigator.getUserMedia) {
        navigator.getUserMedia(
        {
            video: true,
        },
        tracker.setUpStream,
        );
    } 

    //set up a clmtrackr face tracker for tracking the user's face and extracting 
    //the coordinates of 64 major facial features
    tracker.clm_facetracker = new clm.tracker();
    tracker.clm_facetracker.init();
});