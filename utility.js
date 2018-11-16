function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

// The higher this value, the less the fps will reflect temporary variations
// A value of 1 will only keep the last value
var filterStrength = 20;
var frameTime = 0, lastLoop = new Date, thisLoop;

function fpsCheck(){
  var thisFrameTime = (thisLoop=new Date) - lastLoop;
  frameTime+= (thisFrameTime - frameTime) / filterStrength;
  lastLoop = thisLoop;
  fps = (1000/frameTime).toFixed(1);
}
