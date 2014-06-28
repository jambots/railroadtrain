// ------------------- completed var and object declairations

var trainData=new Object();
var trainCount=0;
var turnTimer;

var destCount=0;
var destData=new Object();

var sourceTimer;


var sourceData=new Object();
var sourceCount=0;
var carData=new Object();
var carCount=0;
var carList=new Array();

var checkTrainNum=0;
var checkSourceNum=0;

var collisionData=new Object();

var scoreObject=new Object;
var possibleObject=new Object;
var buildSequence=new Array();

var degByDir=new Object();
degByDir['r']=90;
degByDir['l']=270;
degByDir['t']=0;
degByDir['b']=180;

var xDeltaByDir=new Object();
xDeltaByDir.l=-1;
xDeltaByDir.r=1;
xDeltaByDir.t=0;
xDeltaByDir.b=0;

var yDeltaByDir=new Object();
yDeltaByDir.l=0;
yDeltaByDir.r=0;
yDeltaByDir.t=-1;
yDeltaByDir.b=1;

var reverseObject= new Object();
reverseObject['l']="r";
reverseObject['r']="l";
reverseObject['t']="b";
reverseObject['b']="t";

var rightObject= new Object();
rightObject['l']="t";
rightObject['r']="b";
rightObject['t']="r";
rightObject['b']="l";

var leftObject= new Object();
leftObject['l']="b";
leftObject['r']="t";
leftObject['t']="l";
leftObject['b']="r";

var carHtmlByColor=new Object();
carHtmlByColor['blue']  ="<div id=\"carId\" class=\"notransit\" style><div class=\"coupler\"></div><div class=\"blueTank\"></div></div>";
carHtmlByColor['green'] ="<div id=\"carId\" class=\"notransit\" style><div class=\"coupler\"></div><div class=\"greenCar\"></div></div>";
carHtmlByColor['orange']="<div id=\"carId\" class=\"notransit\" style><div class=\"coupler\"></div><div class=\"orangeTank\"></div></div>";
carHtmlByColor['black'] ="<div id=\"carId\" class=\"notransit\" style><div class=\"coupler\"></div><div class=\"blackCar\"></div></div>";

var trainHtmlByColor=new Object();
trainHtmlByColor['blue']  ="<div id=\"trainId\" class=\"transit\" style><div class=\"coupler\"></div><div class=\"blueTrainBody\"></div><div class=\"blueTrainCatcher\"></div><div class=\"blueTrainTank\"></div><div class=\"blueTrainRear\"></div></div>";
trainHtmlByColor['green'] ="<div id=\"trainId\" class=\"transit\" style><div class=\"coupler\"></div><div class=\"greenTrainBody\"></div><div class=\"greenTrainCatcher\"></div><div class=\"greenTrainTank\"></div><div class=\"greenTrainRear\"></div></div>";
trainHtmlByColor['orange']="<div id=\"trainId\" class=\"transit\" style><div class=\"coupler\"></div><div class=\"orangeTrainBody\"></div><div class=\"orangeTrainCatcher\"></div><div class=\"orangeTrainTank\"></div><div class=\"orangeTrainRear\"></div></div>";
trainHtmlByColor['black'] ="<div id=\"trainId\" class=\"transit\" style><div class=\"coupler\"></div><div class=\"blackTrainBody\"></div><div class=\"blackTrainCatcher\"></div><div class=\"blackTrainTank\"></div><div class=\"blackTrainRear\"></div></div>";

var fullCellGlom=""; //needed for testing the path cells of tiles in viable code
var destTimer;

var freezeMode=false;
var dirList=new Array('t', 'b', 'r', 'l');
var colorList=new Array('black', 'orange', 'blue', 'green');
var colorCycle=0;
var tileList= new Array('trees', 'water', 'houses');


// ------------------- geometry util, display, and game functions

// used maybe for debugging
function returnObjectInfo(theObject){
  dstring=" prev: "+theObject.prevX+" "+theObject.prevY+" next: "+theObject.nextX+" "+theObject.nextY+" "+theObject.dir;
  return dstring;
  }
function dbug(theString){
  
  document.getElementById("debugDiv").style.display="block";
  document.getElementById("debugDiv").innerHTML=""+theString;
  }
function dbuga(theString){
  document.getElementById("debugDiv").style.display="block";  
  document.getElementById("debugDiv").innerHTML+=theString+"<br>";
  }

function followObject(leader, follower){
  follower.prevX=follower.nextX;
  follower.prevY=follower.nextY;
  follower.nextX=leader.nextX;
  follower.nextY=leader.nextY;
  follower.dir=leader.dir;
  follower.deg=leader.deg;
  follower.track=leader.track;
  follower.transformCache=leader.transformCache;
  return follower;
  }


function degDeltaFromDirs(dir1, dir2){
  theDelta=0;
  if ((dir1=="r")&&(dir2=="t")){theDelta-=90;}
  if ((dir1=="t")&&(dir2=="l")){theDelta-=90;}
  if ((dir1=="l")&&(dir2=="b")){theDelta-=90;}
  if ((dir1=="b")&&(dir2=="r")){theDelta-=90;}

  if ((dir1=="r")&&(dir2=="b")){theDelta+=90;}
  if ((dir1=="b")&&(dir2=="l")){theDelta+=90;}
  if ((dir1=="l")&&(dir2=="t")){theDelta+=90;}
  if ((dir1=="t")&&(dir2=="r")){theDelta+=90;}
  return theDelta;
  }

function lineStringFromXYD(x, y, dir){
  if((dir=="l")||(dir=="r")){
    axis="v";
    if(dir=="l"){x-=1;}
    }
  if((dir=="t")||(dir=="b")){
    axis="h";
    if(dir=="t"){y-=1;}
    }
  lineString=axis+x+"_"+y;
  return lineString;
  }

function getTransformString(x,y,deg, dir){
  var destX=x*cellSize+cellSizeHalf;
  var destY=y*cellSize+cellSizeHalf;
  if (dir=="r"){destX+=cellSizeHalf;}
  if (dir=="b"){destY+=cellSizeHalf;}
  if (dir=="l"){destX-=cellSizeHalf;}
  if (dir=="t"){destY-=cellSizeHalf;}
  var transformString="translate("+destX+"px, "+destY+"px) rotate("+deg+"deg)";     
  return transformString;
  }

function makeGrid(){
  // obsolete
  for (x=0; x<cellsAcross; x++){
    for (y=0; y<cellsDown; y++){
      var newdiv = document.createElement('div');
      newdiv.innerHTML = "<div id=\"grid_"+x+"_"+y+"\" class=\"tile L"+x+" T"+y+"\"></div>";
      document.getElementById('gridHolder').appendChild(newdiv);
      }
    }
  }

function returnTracksInCell(x,y){
  var tempArray= new Array();
  var examineCell="grid_"+x+"_"+y;
  //var cn=document.getElementById(examineCell).childNodes;
  var cn=tilesByGridXY[examineCell];
  var cnl=cn.length;  
  for (var n=0; n<cnl; n++){
    var thisClass=cn[n];
    if (thisClass.indexOf('tile')==-1){
      tempArray.push(thisClass);
      }
    }
  return tempArray;
  }
function lineIsOccupied(lineString){
  //debugString="";
  occupied=false;
  for (var k in collisionData){
    //debugString+=" "+collisionData[k];
    if(collisionData[k]==lineString){
      occupied=true;
      }
    }
  return occupied;
  }

function findDest(x, y, dir, color){
  var found="none";
  carOppDir=reverseObject[dir];
  tracksInCell=returnTracksInCell(x,y);
  for (var d=0; d<destCount; d++){
    if ((destData[d].xIntake==x)&&(destData[d].yIntake==y)&&(destData[d].color==color)){
      destOppDir=reverseObject[destData[d].dir];
      // check for compatable tracks... 
      for(var t=0; t<tracksInCell.length; t++){
        thisTrack=tracksInCell[t];
        if ((thisTrack.indexOf(carOppDir)>-1)&&(thisTrack.indexOf(destOppDir)>-1)){
          found=d;
          }
        }
      }
    }
  return found;
  }

function findCar(x, y, dir, color){
  found="none";
  for (c=0; c<carList.length; c++){
    carId=carList[c];
    carOppDir=reverseObject[carData[carId].dir];
    tracksInCell=returnTracksInCell(x,y);

    if((carData[carId].nextX==x)&&(carData[carId].nextY==y)&&(carData[carId].attached==false)&&(carData[carId].color==color)){
      for(var t=0; t<tracksInCell.length; t++){
        thisTrack=tracksInCell[t];
        if ((thisTrack.indexOf(dir)>-1)&&(thisTrack.indexOf(carOppDir)>-1)){
          found=carId;
          }
        }
      }
    }
  return found;
  }

// ------------------- functions related to touch and creating tracks

var tilesByGridXY=new Array();

function createTrack(cellType, targetCell){
  //new database
  //dbuga(cellType+' ');
  tilesByGridXY[targetCell].push(cellType);

  //old div database
  if(cellType.indexOf('tile')>-1){
    var newdiv = document.createElement('div');
    trackHtml=document.getElementById(cellType).innerHTML;
    newdiv.innerHTML = trackHtml;
    newdiv.className=cellType;
    document.getElementById(targetCell).appendChild(newdiv);
    }
  }
function touchCancel(event){
  event.preventDefault(); 
  }
function touchStart(event){
  //debugString="";
  event.preventDefault(); 
  
  if ((event.touches[0].pageY < boardWidth)&&(infoUp=="false")){
    handleEvent(event);
    }
  else {
    handleUiEvent(event);
    }
  }

function touchMove(event){
  event.preventDefault();
  handleEvent(event);
  }
function touchEnd(event){
  event.preventDefault();
  handleEvent(event);
  }
var lastX=0;
var lastY=0;
var centerSize=24;
function xyOn(x,y, dir, dist){
  var leftPx=x*cellSize;
  var topPx=y*cellSize;
  document.getElementById("prerails").style.top=topPx+"px";
  document.getElementById("prerails").style.left=leftPx+"px";
  if((dist>centerSize)&&(x<cellsAcross)){
    if(dir=="l"){leftPx-=cellSizeHalf;}
    if(x<(cellsAcross-1)){
      if(dir=="r"){leftPx+=cellSizeHalf;}
      }
    if(dir=="t"){topPx-=cellSizeHalf;}
    if(dir=="b"){topPx+=cellSizeHalf;}
    }
  document.getElementById("highlighter").style.top=topPx+"px";
  document.getElementById("highlighter").style.left=leftPx+"px";
  document.getElementById("highlighter").style.display="block";
  }
function xyOff(x,y){
  document.getElementById("highlighter").style.display="none";
  }
var cachePageX=0;
var cachePageY=0;

function xydirFromTouch(thisTouch){
  var xydirObject=new Object();
  xydirObject.x=Math.floor((thisTouch.pageX)/cellSize);
  xydirObject.y=Math.floor((thisTouch.pageY)/cellSize);

  centerX=cellSizeHalf+(cellSize*xydirObject.x);
  centerY=cellSizeHalf+(cellSize*xydirObject.y);
  if(Math.abs(centerX-thisTouch.pageX)>(Math.abs(centerY-thisTouch.pageY))){
    // further on X axis
    if (centerX-thisTouch.pageX > 0){
      xydirObject.dir="l";
      }
    else{
      xydirObject.dir="r";
      }
    }
  else{
    // further on Y axis
    if (centerY-thisTouch.pageY > 0){
      xydirObject.dir="t";
      }
    else{
      xydirObject.dir="b";
      }
    }
  distX=Math.abs(centerX-thisTouch.pageX);
  distY=Math.abs(centerY-thisTouch.pageY);
  xydirObject.dist=Math.sqrt(distX*distX + distY*distY);
  return xydirObject;

  }
// global vars for touch metrics
var lastSquare="";
var startDir="";
var lastDir="";
var lastDist=0;
var inSquare="";
//These are really global
var squareX=99;
var squareY=99;
var lastLastDir="";
function handleEvent(e){
  typ = e.type;
  attemptDraw=false;
  if ((typ == "touchstart")||(typ == "touchmove")){  
    target=e.touches[0].target.id;
    xydir=xydirFromTouch(e.touches[0]);
    }

  if (typ == "touchmove"){
    if (xydir.y>=cellsDown){
      // out of bounds
      typ="outofbounds";
      lastSquare="";
      lastDir="";
      startDir="";
      }
    }
  if (typ == "touchstart"){
    inSquare=xydir.x+" "+xydir.y;
    lastSquare=xydir.x+" "+xydir.y;
    squareX=xydir.x;
    squareY=xydir.y;
    startDir=xydir.dir
    }
  if ((typ == "touchmove")||(typ == "touchstart")){
    xyOn(xydir.x, xydir.y, xydir.dir, xydir.dist);
    }
  if(typ=="touchmove"){
    inSquare=xydir.x+" "+xydir.y;
    if (lastSquare != inSquare){

      //dbuga("<br> inSquare="+inSquare +" != lastSquare="+lastSquare+" ");
      //xyOff(squareX, squareY);
      if(startDir != lastDir){
        //dbuga(" startDir="+startDir +" != lastDir="+lastDir+" ");
        }
      attemptDraw=true;


      }
    else{
      //just moved within square
      lastDir=xydir.dir;
      squareX=xydir.x;
      squareY=xydir.y;
      lastDist=xydir.dist;
      cellType="none";

      hidePretracks();

      if((startDir=="t")&&(lastDir=="b")){cellType="tbPre";}
      if((startDir=="b")&&(lastDir=="t")){cellType="tbPre";}
      if((startDir=="l")&&(lastDir=="r")){cellType="lrPre";}
      if((startDir=="r")&&(lastDir=="l")){cellType="lrPre";}
      if((startDir=="t")&&(lastDir=="l")){cellType="tlPre";}//ccw
      if((startDir=="l")&&(lastDir=="t")){cellType="tlPre";}//cw
      if((startDir=="t")&&(lastDir=="r")){cellType="trPre";}//ccw
      if((startDir=="r")&&(lastDir=="t")){cellType="trPre";}//cw
      if((startDir=="b")&&(lastDir=="l")){cellType="blPre";}//ccw
      if((startDir=="l")&&(lastDir=="b")){cellType="blPre";}//cw
      if((startDir=="b")&&(lastDir=="r")){cellType="brPre";}//ccw
      if((startDir=="r")&&(lastDir=="b")){cellType="brPre";}//cw
      if(lastDist<centerSize){
        if(startDir=="r"){cellType="rPre";}
        if(startDir=="l"){cellType="lPre";}
        if(startDir=="t"){cellType="tPre";}
        if(startDir=="b"){cellType="bPre";}
        }
      if(cellType != "none"){
        document.getElementById(cellType).style.display="block";
        }
      }
    }
  if(typ=="touchend"){
    if(lastDir != startDir){
      // end having moved across square
      if (lastDist>centerSize){
        // but not ending in the center
        attemptDraw=true;
        }
      }
    }



  if(attemptDraw == true){
    attemptDrawTrack();
    }
  if (lastSquare != inSquare){
    if(typ=="touchmove"){
      lastSquare=inSquare;
      startDir=xydir.dir;
      lastDir="";
      }
    }
  if(typ=="touchend"){
    hidePretracks();
    if(squareY<cellsDown){
      xyOff(squareX, squareY);
      }
    lastSquare="";
    startDir="";
    lastDir="";
    inSquare="";
    }
  }

function attemptDrawTrack(){
  // DRAW TRACK!!!!
  targetCell="grid_"+squareX+"_"+squareY;
  //dbuga(" attemptDraw targetCell="+targetCell+" ");
  cellType="error";
  if((startDir=="t")&&(lastDir=="b")){cellType="tb";}
  if((startDir=="b")&&(lastDir=="t")){cellType="tb";}
  if((startDir=="l")&&(lastDir=="r")){cellType="lr";}
  if((startDir=="r")&&(lastDir=="l")){cellType="lr";}
  if((startDir=="t")&&(lastDir=="l")){cellType="tl";}//ccw
  if((startDir=="l")&&(lastDir=="t")){cellType="tl";}//cw
  if((startDir=="t")&&(lastDir=="r")){cellType="tr";}//ccw
  if((startDir=="r")&&(lastDir=="t")){cellType="tr";}//cw
  if((startDir=="b")&&(lastDir=="l")){cellType="bl";}//ccw
  if((startDir=="l")&&(lastDir=="b")){cellType="bl";}//cw
  if((startDir=="b")&&(lastDir=="r")){cellType="br";}//ccw
  if((startDir=="r")&&(lastDir=="b")){cellType="br";}//cw
  
  if (isTiled(squareX, squareY)==true){cellType="error";}// can't track on a tiled cell
//dbug("isTiled("+squareX+", "+squareY+")="+isTiled(squareX, squareY));
  // source hookups pass at this point... 
  if (cellType != "error"){
    passSourceTests=true;
    var dirsArray=cellType.split("");
    for (d=0; d<2; d++){
      thisDir=dirsArray[d];
      tX=Number(squareX)+Number(xDeltaByDir[thisDir]);
      tY=Number(squareY)+Number(yDeltaByDir[thisDir]);
      if ((isSourceInDir(tX, tY, thisDir)==false)&&(isTiled(tX, tY)==true)){
        passSourceTests=false;
        }
      }
    if (passSourceTests == false){
      cellType="error";
      }
    }
   //dbuga(" cellType="+cellType);
  if (cellType != "error"){
    // test cell for extant track
    //var cn=document.getElementById(targetCell).childNodes;
    cn=tilesByGridXY[targetCell];
    cnl=cn.length;
    tracksGlom="|";
    for (n=0; n<cnl; n++){
      //thisClass=cn[n].className;
      thisClass=cn[n];
      tracksGlom+=thisClass+"|";
      }
    if (tracksGlom.indexOf(cellType)==-1){
      fullCellGlom+="grid_"+squareX+"_"+squareY;
      createTrack(cellType, targetCell);
      createCanvasTrack(cellType, squareX, squareY);
      buildSequence.push(new buildObject("track", "", cellType, squareX, squareY, 0));
      //playSound("laytrack");
      lastLastDir=lastDir;
      ////lastDir="";// try to fix pretack
      hidePretracks();
      } 
    }
  }
var pretrackArray=new Array("blPre","brPre","tlPre","trPre","lrPre","tbPre","tPre","bPre","lPre","rPre");
function hidePretracks(){
  for (p=0; p<pretrackArray.length; p++){
    pId=pretrackArray[p];
    document.getElementById(pId).style.display="none";
    }
  }

//functions that examine the board state



function isSourceInDir(xx,yy,d){
  useD=reverseObject[d];
  cellIsSource=false;
  if((xx>-1)&&(xx<cellsAcross)&&(yy>-1)&&(yy<cellsDown)){
    testCell="grid_"+xx+"_"+yy;
    //var cn=document.getElementById(testCell).childNodes;
    var cn=tilesByGridXY[testCell];
    for (n=0; n<cn.length; n++){
      //thisClass=cn[n].className;
      thisClass=cn[n];
      if ((thisClass==useD+"s")||(thisClass==useD+"d")){
        cellIsSource=true;
        }
      }
    }
  return cellIsSource;
  }
function isTiled(x,y){
  tiled=false;
  if((x<0)||(x>=cellsAcross)||(y<0)||(y>=cellsDown)||(isNaN(x))){
    //out of bounds, call it tiled
    //dbuga('<br>out of bounds, call it tiled'+x+" "+y);
 
    tiled=true;
    }
  else{
    testCell2="grid_"+x+"_"+y;
    //var cn=document.getElementById(testCell2).childNodes;
    var cn=tilesByGridXY[testCell2];
    for (n=0; n<cn.length; n++){
      //thisClass=cn[n].className;
      thisClass=cn[n];
      //if ((thisClass.indexOf('source')>-1)||(thisClass.indexOf('dest')>-1)){
      if (thisClass.indexOf('tile')>-1){
        tiled=true;
        }
      }
    }
  return tiled;
  }

function openAdjacentCellsArray(x, y, excludeCell){
  var openArray=new Array();
  var returnArray=new Array();
  xMinus=x-1;
  xPlus=x+1;
  yMinus=y-1;
  yPlus=y+1;

  if (isTiled(xMinus, y)==false){
    if(excludeCell != "grid_"+xMinus+"_"+y){
      openArray.push("grid_"+xMinus+"_"+y);
      }
    }
  if (isTiled(xPlus, y)==false){
    if(excludeCell != "grid_"+xPlus+"_"+y){
      openArray.push("grid_"+xPlus+"_"+y);
      }
    }
  if (isTiled(x, yPlus)==false){
    if(excludeCell != "grid_"+x+"_"+yPlus){
      openArray.push("grid_"+x+"_"+yPlus);
      }
    }
  if (isTiled(x, yMinus)==false){
    if(excludeCell != "grid_"+x+"_"+yMinus){
      openArray.push("grid_"+x+"_"+yMinus);
      }
    }
  if(openArray.length==3){
    excludeNum=Math.floor(Math.random()*3);
    }
  else{
    excludeNum=4;
    }
  for (o=0; o<openArray.length; o++){
    if(o != excludeNum){
      returnArray.push(openArray[o]);
      }
    }
  return returnArray;
  }

