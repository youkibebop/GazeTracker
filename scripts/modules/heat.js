///////////////////////////////////////////////////////////////////////
/// HEAT.JS  //////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
//use simpleheat.js library to generate a heatmap overlay in the 
//user's browser

$(document).ready(function() {

	const canvas = document.getElementById('heatmap-canvas');
	var display_height = Math.min($('body').height(), (2 * window.innerHeight)); 
	canvas.height = display_height;
	canvas.width = window.innerWidth;
	
	//set up the simpleheat.js heatmap parameters
	const heat = simpleheat('heatmap-canvas').max(20);
	heat.radius(40, 15)

	//global heatmap object for updating and rendering a heatmap display
	window.heatmap = {
		heat: heat,
		display: true,
		display_height: display_height,

		//clear the heatmap data
		clearHeatmap: function(){
			heat.clear();
		},
		
		//draw the heatmap overlay
		draw: function(x,y) {
			if (y <= display_height){
				//add the prediction coordinates to the heatmap data structure
				heatmap.heat.add([x,y,1]);
				//timing the performance of the heatmap rendering
				console.time('heatmap.draw()');
				//render the heatmap display
				if (heatmap.display == true){
					heat.draw();
				}
				console.timeEnd('heatmap.draw()');				
			}
		},
	};
	
});