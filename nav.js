var controlHeight=44;
var controlWidth=0;
var canvasHeight=0;
var canvasWidth=0;
var fullHeight=0;
var navDivRef=new Object();
function createNavDiv(){
  var newdiv = document.createElement('div');
  newdiv.setAttribute('id', "navDiv");
  newdiv.className="navBarHolder";
  document.body.appendChild(newdiv);
  
  navDivRef=newdiv;
  navDivRef.style.overflow="hidden";
  }
function screenLayout(){
  fullHeight=window.innerHeight;
  canvasHeight=window.innerHeight-controlHeight;
  canvasWidth=window.innerWidth;
  navDivRef.style.height=controlHeight+"px";
  navDivRef.style.width=canvasWidth+"px";
  navDivRef.style.top=canvasHeight+"px";
  }

window.onorientationchange = function () {
  screenLayout();
  displayWidth=canvasWidth-controlWidth;
  //document.getElementById('displayDiv').style.width=displayWidth+"px";
  }

function addControl(newId, labelString, float, buttonWidth){
  controlWidth+=buttonWidth+2;
  htmlBlock="";
  htmlBlock+="  <div class=\"controlButton float"+float+"\" style=\"width:"+buttonWidth+"px;\">";
  htmlBlock+="    <div class=\"controlRelative\" style=\"width:"+buttonWidth+"px;\">";
  htmlBlock+="      <div id=\""+newId+"_label\" class=\"controlLabel\" style=\"width:"+buttonWidth+"px;\">"+labelString+"</div>";
  htmlBlock+="      <div id=\""+newId+"_touch\" class=\"controlTouch\" style=\"width:"+buttonWidth+"px;\"></div>";
  htmlBlock+="    </div>";
  htmlBlock+="  </div>";
  htmlBlock+="  <div class=\"controlDivider float"+float+"\"></div>";
  navDivRef.innerHTML+=htmlBlock;
  }
var displayAdded=false;

function addDisplay(newId, displayWidth){
  displayAdded=true;
  htmlBlock="";
  htmlBlock+="  <div id=\""+newId+"\" class=\"displayText\" style=\"width:"+displayWidth+"px;\"></div>";
  navDivRef.innerHTML+=htmlBlock;
  }

function displayText(theString){
  if(displayAdded){
    document.getElementById('displayDiv').innerHTML=theString;
    }
  }

/*
function touchCancel(event){
  event.preventDefault(); 
  }
function touchStart(event){
  event.preventDefault(); 
  handleEvent(event);
  }
function touchMove(event){
  event.preventDefault();
  handleEvent(event);
  }
function touchEnd(event){
  event.preventDefault();
  handleEvent(event);
  }
*/