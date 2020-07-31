///////////////////////////////////////////////////////////////////////
/// CURSOR.JS  ///////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
//Track and update cursor position.  

$(document).ready(function() {

    //global cursor object for tracking the cursor in the browser window.
    window.cursor = {
        X: 0.5,
        Y: 0.5,
        //gets the cursor's xy coordinates
        getCursorPos: function() {
            console.log("Cursor Pos: (" + cursor.X + ", " + cursor.Y + ")");
            return [cursor.X, cursor.Y];
        },

        //updates the cursor's XY coordinates every time the mouse is moved
        updateCursorPos: function(event) {
            cursor.X = event.clientX / $('body').width();
            //cursor.Y = event.clientY / $('body').height();
            cursor.Y = event.clientY /window.innerHeight
        },
    };

    //every time the mouse is moved, update the cursor object's X and Y variables
    document.onmousemove = cursor.updateCursorPos;


});