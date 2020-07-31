# GazeTracker
Chrome Extension that tracks your gaze via Machine Learning and visualises your gaze using a Heatmap. A group project for the University of Sydne by: Youki Iijima, Ethan Shi and Crystal Hu.

## Installation
1. Open your chrome browser
2. Go Preference -> Extension (on the left sidebar)
3. Turn on the developer mode
4. Click 'Load unpacked' -> choose the 'Gaze Tracker' folder (root)
5. If it is not visible, click on the jigsaw icon labelled 'extensions' in the top right corner of your browser window. Select the pin icon next to the Gaze Tracker extension icon that you just loaded.
6. Now you should notice a green chrome extension icon shows up at the top-right corner
7. Go to any website
8. When the webpage loaded up, click on the eye tracking extension icon to load the application. The application UI will be overlaid on your browser window.


## Instructions to Run
1. Clicking the 'Calibrate' button on the left to start calibration
2. Clicking 'Start Training' Button when you finised the calibration
3. Now you should see a red dot represents your gaze on the screen  
  

***Hint: If the gaze tracker isn't very accurate, you will want to re-train it with a few more training samples. To capture a new sample, focus on your cursor with your eyes, and hit the right Alt key. After you've captured a bunch of samples, press the 'Start Training' button again to re-train the neural network***
