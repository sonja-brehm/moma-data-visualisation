//set initial variables
var paper = Snap("#svgContainer");

var paperWidth = window.innerWidth;
var paperHeight = window.innerHeight;

let departmentCountArray = [0, 0, 0, 0];
let departmentCountArraySplit = [0, 0, 0, 0];
var possibleDepartments = ["Architecture & Design", "Drawings", "Painting & Sculpture", "Photography"];

var previousRects = 0;

var colorDark = ["#631F5C", "#3F2357", "#294063", "#0B4C4F"];
var colorBright = ["#D354CD", "#A35AE0", "#5E94E5", "#1BA8A8"];

init();

function init() {
  sortDepartments();
  clean();
  drawStartScreen();
}

//Counts how many artworks are in which department and saves it in the departmentCountArray
function sortDepartments() {
  for (let i = 0; i < data.length; i++) {
    switch (data[i]["department"]) {
      case "Architecture & Design":
        departmentCountArray[0]++;
        break;
      case "Drawings":
        departmentCountArray[1]++;
        break;
      case "Painting & Sculpture":
        departmentCountArray[2]++;
        break;
      case "Photography":
        departmentCountArray[3]++;
        break;
      default:
        data.slice(i, 1);
        i--;
    }
  }
}

//clean the data (delete objects with undefined attributes)
function clean() {
  for (var i = 0; i < data.length; i++) {
    if (data[i].width == null ||
      data[i].width === undefined ||
      data[i].width === 0 ||
      data[i].height == null ||
      data[i].height === undefined ||
      data[i].height === 0 ||
      data[i].m2 == null ||
      data[i].m2 == undefined ||
      data[i].m2 == 0 ||
      data[i].acquisitionYear == null ||
      data[i].acquisitionYear == undefined ||
      data[i].acquisitionYear == 0) {
      data.splice(i, 1);
      i--; //as objects move up, e.g. if object 5 is deleted, object 6 becomes 5
    }
  }

  //clean up date + correct incorrectly formatted dates
  for (var i = 0; i < data.length; i++) {
    if (data[i].date == null || data[i].date < 1800 || isNaN(data[i].date) === true || data[i]["date"] == undefined || data[i]["date"] === "") {
      data.splice(i, 1);
      i--;
    } else {
      data[i].date = data[i].date.toString();
      for (var j = 3; j < data[i].date.length; j++) {
        if (
          isDigit(data[i].date.charAt(j - 3)) &&
          isDigit(data[i].date.charAt(j - 2)) &&
          isDigit(data[i].date.charAt(j - 1)) &&
          isDigit(data[i].date.charAt(j))) {
          data[i].date = data[i].date.substr(j - 3, 4);
        }
      }
    }
  }
}

//function for incorrectly formatted dates
function isDigit(input) {
  input = input.toString();
  var digitChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  var isDigit = false;
  for (var j = 0; j < digitChars.length; j++) {
    if (input === digitChars[j] &&
      input !== " " &&
      input !== "-") {
      isDigit = true;
    }
  }
  return isDigit;
}

//function to remove all elements from the paper (needed when we open a new visualisation screen)
function deleteAll() {
  paper.selectAll("*").remove();
}

//draw the start screen
function drawStartScreen() {
  let totalRects = 0;
  for (let i = 0; i < departmentCountArray.length; i++) { // departmentCountArray.length = 4
    departmentCountArraySplit[i] = Math.round(departmentCountArray[i] / 10); //calculate 1 rectangle for 10 artworks
    totalRects += departmentCountArraySplit[i];
  }

  const blockMargin = paperWidth * 0.03; //distance between the blocks
  const totalMargin = (departmentCountArray.length - 1) * blockMargin;
  const rectSize = (paperHeight * (paperWidth - totalMargin) / totalRects); //calculate the size of the rectangles
  const rectEdgeLength = Math.sqrt(rectSize); //edge length of the rectangles

  const rectsPerCol = Math.floor((totalRects) / ((paperWidth - totalMargin) / rectEdgeLength)); //Rectangles per column


  let colsPerBlock = []; //How many columns does a block have?
  for (let i = 0; i < departmentCountArray.length; i++) {
    colsPerBlock.push(Math.ceil(departmentCountArraySplit[i] / rectsPerCol) - 1);
  }

  let xOffset = 0;
  //set colour for each block
  for (let i = 0; i < departmentCountArray.length; i++) {
    let color = colorBright[i];
    //Calculate x and y pos for blocks
    for (let j = 0; j < departmentCountArraySplit[i]; j++) {
      let yPos = (j % rectsPerCol) * rectEdgeLength;
      let xPos = xOffset + Math.floor(j / rectsPerCol) * rectEdgeLength;

      //draw rectangles
      paper.rect(xPos, yPos, rectEdgeLength * 0.50, rectEdgeLength * 0.50).attr({ // 0.50 for the space between the rectangles
        fill: color
      });
    }
    xOffset += (colsPerBlock[i] * rectEdgeLength) + blockMargin; // Offset = how much the next block on the x-axis must be moved
  }


//Transparent clickable rectangles to get to the dimensions screen (rectangles at the bottom)
  var rectArrayDimensions = [];
  for (var i = 0; i < departmentCountArray.length; i++) {
    var xPos = 0;
    for (var j = 0; j < i; j++) {
      xPos += colsPerBlock[j] * rectEdgeLength + blockMargin
    }
    var yPos = paperHeight / 2;
    var w = colsPerBlock[i] * rectEdgeLength + blockMargin
    var h = paperHeight / 2;
    rectArrayDimensions.push(paper.rect(xPos, yPos, w, h).attr({
      opacity: 0,
      fill: "red"
    }));

    //Click Event
    rectArrayDimensions[i].click(drawDimensions.bind(null, i));
  }


//Transparent clickable rectangles to get to the date screen (rectangles at the top)
  var rectArrayDates = [];
  for (var i = 0; i < departmentCountArray.length; i++) {
    var xPos = 0;
    for (var j = 0; j < i; j++) {
      xPos += colsPerBlock[j] * rectEdgeLength + blockMargin
    }
    var yPos = 0;
    var w = colsPerBlock[i] * rectEdgeLength + blockMargin
    var h = paperHeight / 2;
    rectArrayDates.push(paper.rect(xPos, yPos, w, h).attr({
      opacity: 0,
      fill: "blue"
    }));

    //Click Event
    rectArrayDates[i].click(drawDates.bind(null, i));
  }
}

//function to draw the date screen
function drawDates(index) {
  deleteAll();
  var department = possibleDepartments[index];

  //draw dates for department Architecture & Design
  if (department == "Architecture & Design") {
    for (var i = 0; i < data.length; i++) {
      if (data[i].department == "Architecture & Design") {
        x1Pos = map(Math.abs(data[i].date), 1840, 2016, 0, paperWidth);
        x2Pos = map(data[i].acquisitionYear, 1840, 2016, 0, paperWidth);
        y1Pos = 0;
        y2Pos = paperHeight;
        paper.line(x1Pos, y1Pos, x2Pos, y2Pos).attr({
          fill: colorBright[index],
          stroke: colorBright[index],
          strokeWidth: 0.1,
        });
      }
    }
  }

  //draw dates for department Drawings
  if (department === "Drawings") {
    for (var i = 0; i < data.length; i++) {
      if (data[i].department == "Drawings") {
        x1Pos = map(Math.abs(data[i].date), 1840, 2016, 0, paperWidth);
        x2Pos = map(data[i].acquisitionYear, 1840, 2016, 0, paperWidth);
        y1Pos = 0;
        y2Pos = paperHeight;
        paper.line(x1Pos, y1Pos, x2Pos, y2Pos).attr({
          fill: colorBright[index],
          stroke: colorBright[index],
          strokeWidth: 0.1
        });
      }
    }
  }

  //draw dates for department Painting & Sculpture
  if (department === "Painting & Sculpture") {
    for (var i = 0; i < data.length; i++) {
      if (data[i].department == "Painting & Sculpture") {
        x1Pos = map(Math.abs(data[i].date), 1840, 2016, 0, paperWidth);
        x2Pos = map(data[i].acquisitionYear, 1840, 2016, 0, paperWidth);
        y1Pos = 0;
        y2Pos = paperHeight;
        paper.line(x1Pos, y1Pos, x2Pos, y2Pos).attr({
          fill: colorBright[index],
          stroke: colorBright[index],
          strokeWidth: 0.1
        });
      }
    }
  }

  //draw dates for department Photography
  if (department === "Photography") {
    for (var i = 0; i < data.length; i++) {
      if (data[i].department == "Photography") {
        x1Pos = map(Math.abs(data[i].date), 1840, 2016, 0, paperWidth);
        x2Pos = map(data[i].acquisitionYear, 1840, 2016, 0, paperWidth);
        y1Pos = 0;
        y2Pos = paperHeight;
        paper.line(x1Pos, y1Pos, x2Pos, y2Pos).attr({
          fill: colorBright[index],
          stroke: colorBright[index],
          strokeWidth: 0.1
        });
      }
    }
  }

  //Go back (trnsparent clickable rectangle in the to left corner)
  var rectBack = paper.rect(0, 0, paperWidth * 0.10, paperHeight * 0.15).attr({
    fill: 'red',
    opacity: 0
  });
  rectBack.click(goBack);
}


//function to draw the dimensions screen
function drawDimensions(index) {
  deleteAll();
  var department = possibleDepartments[index];

  drawPoints();

  function drawPoints() {
    //draw dots (for the scatter plot) for department Architektur & Design
    if (department == "Architecture & Design") {
      for (var i = 0; i < data.length; i++) {
        if (data[i].department == "Architecture & Design") {
          xPos = map(data[i].width, 0, 300, 0, (paperWidth));
          yPos = paperHeight - map(data[i].height, 0, 300, 0, paperHeight);
          size = 2.5;
          roundedSquareMeters = "m" + Math.ceil(data[i].m2).toString();
          paper.rect(xPos, yPos, size, size).attr({
            fill: colorBright[index],
            id: roundedSquareMeters,
            class: "points"
          });
        }
      }
    }

    //draw dots for department Drawings
    if (department === "Drawings") {
      for (var i = 0; i < data.length; i++) {
        if (data[i].department === "Drawings") {
          xPos = map(data[i].width, 0, 300, 0, (paperWidth));
          yPos = paperHeight - map(data[i].height, 0, 300, 0, paperHeight);
          size = 2.5;
          roundedSquareMeters = "m" + Math.ceil(data[i].m2).toString();
          paper.rect(xPos, yPos, size, size).attr({
            fill: colorBright[index],
            id: roundedSquareMeters,
            class: "points"
          });
        }
      }
    }

    //draw dots for department Painting & Sculpture
    if (department === "Painting & Sculpture") {
      for (var i = 0; i < data.length; i++) {
        if (data[i].department === "Painting & Sculpture") {
          xPos = map(data[i].width, 0, 300, 0, (paperWidth));
          yPos = paperHeight - map(data[i].height, 0, 300, 0, paperHeight);
          size = 2.5;
          roundedSquareMeters = "m" + Math.ceil(data[i].m2).toString();
          paper.rect(xPos, yPos, size, size).attr({
            fill: colorBright[index],
            id: roundedSquareMeters,
            class: "points"
          });
        }
      }
    }

    //draw dots for department Photography
    if (department === "Photography") {
      for (var i = 0; i < data.length; i++) {
        if (data[i].department == "Photography") {
          xPos = map(data[i].width, 0, 300, 0, (paperWidth));
          yPos = paperHeight - map(data[i].height, 0, 300, 0, paperHeight);
          size = 2.5;
          roundedSquareMeters = "m" + Math.ceil(data[i].m2).toString();
          paper.rect(xPos, yPos, size, size).attr({
            fill: colorBright[index],
            id: roundedSquareMeters,
            class: "points"
          });
        }
      }
    }
  }

  //invisible rectangle above the screen, which queries where the mouse is located when MouseMove is performed.
  var invisibleRect = paper.rect(0, 0, paperWidth, paperHeight).attr({
    opacity: 0
  });

  //Mouse-Events
  invisibleRect.mousemove(handleMove);
  invisibleRect.mousedown(handleDown);
  invisibleRect.mouseup(handleUp);


  var currentSquareMeters = 0;

  //Deletes all Dimension-Rectangles
  function killDimensionRects() {
    paper.selectAll("#dimensionRect").remove();
  }

  //Draws the dimension rectangles & recolours points
  function drawRects(squaremeters) {
    //if the square metre the mouse is on does not correspond to the displayed dimension rects...
    if (currentSquareMeters !== squaremeters) {
      //...all dimension rects are deleted
      killDimensionRects();
      //All points are coloured dark
      paper.selectAll("rect").attr({
        fill: colorDark[index]
      });
      //the points selected with the mouse are coloured brightly
      paper.selectAll("#m" + squaremeters).attr({
        fill: colorBright[index],
      });
      //Dimension Rects are mapped and drawn
      for (var i = 0; i < data.length; i++) {
        if (data[i]["department"] === department && data[i]["m2"] >= squaremeters && data[i].m2 <= squaremeters + 1) { //clicked area
          var paintWidth = map(data[i].width, 0, 700, 0, paperWidth); //width of the respective artwork
          var paintHeight = map(data[i].height, 0, 700, 0, paperHeight); //height of the respective artwork
          xPos = (paperWidth / 2) - (paintWidth / 2); //Centre of the respective artwork on the x-axis
          yPos = (paperHeight / 2) - (paintHeight / 2); //Centre of the respective artwork on the y-axis

          if (isOnScreen(paintWidth) && isOnScreen(paintHeight) && isOnScreen(xPos) && isOnScreen(yPos)) {
            paper.rect(xPos, yPos, paintWidth, paintHeight).attr({ //draw rectangles
              stroke: colorBright[index],
              opacity: 0.5,
              strokeWidth: 1,
              fill: "none",
              id: "dimensionRect"
            });
          }
        }
      }
      //Go back (transparent clickable rectangle in the to left corner)
      var rectBack = paper.rect(0, 0, paperWidth * 0.10, paperHeight * 0.15).attr({
        fill: 'red',
        opacity: 0
      });
      rectBack.click(goBack);
    }
    currentSquareMeters = squaremeters;
  }

  //to avoid error message
  function isOnScreen(val) {
    var isinrange = false;
    if (val >= 0 && val <= paperWidth) {
      isinrange = true;
    }
    return isinrange;
  }

  //Mousemove-Event, draws dimension rects in the selected area (square metres)
  function handleMove(evt) {
    var mouseX = evt.clientX;
    var mouseY = evt.clientY;
    var width = map(mouseX, 0, paperWidth, 0, 3);
    var height = map(paperHeight - mouseY, 0, paperHeight, 0, 3);
    var area = width * height;
    var rectGroup = Math.ceil(area);
    if (rectGroup !== previousRects) {
      drawRects(rectGroup);
      previousRects = rectGroup;
      console.log("rectGroup: " + rectGroup);
    }
  }

  //Mousedown-Event, removes all points so that you only see the dimension rects
  function handleDown() {
    paper.selectAll(".points").remove();
  }


  //Mouseup-Event, colours all points light again and removes the dimension rectangles
  function handleUp() {
    drawPoints();
    paper.selectAll("rect").attr({
      fill: colorBright[index]
    });
    paper.selectAll("#dimensionRect").remove();
  }
}

//Function for "go-back-rectangle" at the top right of the screen
function goBack() {
  deleteAll();
  drawStartScreen();
}
