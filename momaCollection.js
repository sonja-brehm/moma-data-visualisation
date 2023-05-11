//console.log("Hello World.");
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

//Wie viele Kunstwerke sind in welchem Department?
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

//die Daten aufräumen
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
      //da Objekte hochrücken, z.B. 5=eine Niete, Objekt 6 wird zu 5
      i--;
    }
  }

  //Aufräumen von Date + Falsch Formatierte Dates korrigieren
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

//Für falsch formatierete Dates
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

//um alle Elemente vom Paper zu entfernen
function deleteAll() {
  paper.selectAll("*").remove();
}

//den ersten Screen zeichnen
function drawStartScreen() {
  let totalRects = 0;
  for (let i = 0; i < departmentCountArray.length; i++) { // departmentCountArray.length = 4
    departmentCountArraySplit[i] = Math.round(departmentCountArray[i] / 10); //1 rechteck für 10 Kunstwerke
    totalRects += departmentCountArraySplit[i]; //wegen eventueller rundungsfehler
  }

  const blockMargin = paperWidth * 0.03; //Abstand zwischen den Blöcken
  const totalMargin = (departmentCountArray.length - 1) * blockMargin; //Abstand insgesamt
  const rectSize = (paperHeight * (paperWidth - totalMargin) / totalRects); //Flächeninhalt der Quadrate
  const rectEdgeLength = Math.sqrt(rectSize); //Kantenlänge der Quadrate

  const rectsPerCol = Math.floor((totalRects) / ((paperWidth - totalMargin) / rectEdgeLength)); //Rechtecke pro Spalte


  let colsPerBlock = []; //Wie viele Cols hat ein Block?
  for (let i = 0; i < departmentCountArray.length; i++) { // departmentCountArray.length = 4
    colsPerBlock.push(Math.ceil(departmentCountArraySplit[i] / rectsPerCol) - 1);
  }

  let xOffset = 0;
  for (let i = 0; i < departmentCountArray.length; i++) { // departmentCountArray.length = 4
    let color = colorBright[i];
    for (let j = 0; j < departmentCountArraySplit[i]; j++) {

      let yPos = (j % rectsPerCol) * rectEdgeLength;
      let xPos = xOffset + Math.floor(j / rectsPerCol) * rectEdgeLength;

      paper.rect(xPos, yPos, rectEdgeLength * 0.50, rectEdgeLength * 0.50).attr({ // 0.50 für den Abstand zwischen den Rechtecken
        fill: color
      });
    }
    xOffset += (colsPerBlock[i] * rectEdgeLength) + blockMargin;
    // Offset = wie viel der nächste Block auf der x-Achse verschoben werden muss
  }


  //Klickbare Quadrate für Height&Width Darstellung (Rechtecke unten)
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


  //Klickbare Quadrate für Date Darstellung (Rechtecke oben)
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

function drawDates(index) {
  deleteAll();
  var department = possibleDepartments[index];

  //Draw Dates für Department Architektur & Design
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

  //Draw Dates für Department Drawings
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

  //Draw Dates für Department Painting & Sculpture
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

  //Draw Dates für Department Photography
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

  //ZURÜCK
  var rectBack = paper.rect(0, 0, paperWidth * 0.10, paperHeight * 0.15).attr({
    fill: 'red',
    opacity: 0
  });
  rectBack.click(goBack);
}


// Dimensions zeichnen
function drawDimensions(index) {
  deleteAll();
  var department = possibleDepartments[index];

  drawPoints();

  function drawPoints() {
    //Draw Punkte für Department Architektur & Design
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

    //Draw Punkte für Department Drawings
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

    //Draw Punkte für Department Painting & Sculpture
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

    //Draw Punkte für Department Photography
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

  //unsichtbares Rect über dem Screen, welches bei MouseMove abfrägt, wo sich die Maus befindet
  var invisibleRect = paper.rect(0, 0, paperWidth, paperHeight).attr({
    opacity: 0
  });

  //Mouse-Events
  invisibleRect.mousemove(handleMove);
  invisibleRect.mousedown(handleDown);
  invisibleRect.mouseup(handleUp);


  var currentSquareMeters = 0;

  //Löscht alle Dimension-Rects
  function killDimensionRects() {
    paper.selectAll("#dimensionRect").remove();
  }

  //Zeichnet die Dimension-Rects & färbt Punkte neu ein
  function drawRects(squaremeters) {
    //wenn der Quadratmeter, auf dem die Maus ist, nicht den angezeigten Dimension-Rects entspricht...
    if (currentSquareMeters !== squaremeters) {
      //...werden alle Dimension-Rects gelöscht
      killDimensionRects();
      //Alle Punkte werden dunkel eingefärbt
      paper.selectAll("rect").attr({
        fill: colorDark[index]
      });
      //die mit der Maus ausgewählten Punkte werden hell eingefärbt
      paper.selectAll("#m" + squaremeters).attr({
        fill: colorBright[index],
      });
      //Dimension-Rects werden gemappt und gezeichnet
      for (var i = 0; i < data.length; i++) {
        if (data[i]["department"] === department && data[i]["m2"] >= squaremeters && data[i].m2 <= squaremeters + 1) { //angeklickter Bereich
          var paintWidth = map(data[i].width, 0, 700, 0, paperWidth); //Breite des jeweiligen Kunstwerks
          var paintHeight = map(data[i].height, 0, 700, 0, paperHeight); //Höhe des jeweiligen Kunstwerks
          xPos = (paperWidth / 2) - (paintWidth / 2); //Mittelpunkt des jeweiligen Kunstwerks auf der x-Achse
          yPos = (paperHeight / 2) - (paintHeight / 2); //Mittelpunkt des jeweiligen Kunstwerks auf der y-Achse

          if (isOnScreen(paintWidth) && isOnScreen(paintHeight) && isOnScreen(xPos) && isOnScreen(yPos)) {
            paper.rect(xPos, yPos, paintWidth, paintHeight).attr({ //Rechteck zeichnen
              stroke: colorBright[index],
              opacity: 0.5,
              strokeWidth: 1,
              fill: "none",
              id: "dimensionRect"
            });
          }
        }
      }
      //ZURÜCK
      var rectBack = paper.rect(0, 0, paperWidth * 0.10, paperHeight * 0.15).attr({
        fill: 'red',
        opacity: 0
      });
      rectBack.click(goBack);
    }
    currentSquareMeters = squaremeters;
  }

  //um Fehlermeldung zu vermeiden
  function isOnScreen(val) {
    var isinrange = false;
    if (val >= 0 && val <= paperWidth) { //dirty
      isinrange = true;
    }
    return isinrange;
  }

  //Mousemove-Event, zeichnet Dimension-Rects in der ausgewählten Area (Quadratmeter)
  function handleMove(evt) {
    var mouseX = evt.clientX;
    var mouseY = evt.clientY;
    //  console.log(mouseY);
    var width = map(mouseX, 0, paperWidth, 0, 3);
    var height = map(paperHeight - mouseY, 0, paperHeight, 0, 3);
    var area = width * height;
    //console.log(area);
    var rectGroup = Math.ceil(area);
    if (rectGroup !== previousRects) {
      drawRects(rectGroup);
      previousRects = rectGroup;
      console.log("rectGroup: " + rectGroup);
    }
  }

  //Mousedown-Event, entfernt alle Punkte, sodass man nur die Dimension-Rects sieht
  function handleDown() {
    paper.selectAll(".points").remove();
  }


  //Mouseup-Event, färbt alle Punkte wieder hell ein und entfernt die Dimension-Rects
  function handleUp() {
    drawPoints();
    paper.selectAll("rect").attr({
      fill: colorBright[index]
    });
    paper.selectAll("#dimensionRect").remove();
  }
}

//Funktion für Zurück-Rechteck oben rechts im Screen
function goBack() {
  deleteAll();
  drawStartScreen();
}
