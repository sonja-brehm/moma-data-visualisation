# moma-data-visualisation

This project was created during my undergraduate studies in the course "Programmed Design II" from March to June 2019.
The task was to program an interactive graphic from a set of data. No pictograms or texts were allowed, meaning you had to use different shapes, sizes or colours to communicate the data.

## Dataset
I chose the dataset of the [Museum of Modern Art Collection](https://www.kaggle.com/datasets/momanyc/museum-collection). It contains all of MoMA's artworks, their artists, creation date, acquisition date, medium, dimensions, department and classification.

As the original dataset is very large, I decided to shorten it and keep only the following departments:
- Architecture & Design
- Drawings
- Painting & Sculpture
- Photography

The data was then compiled into json format, you can find it [here](https://dl.dropbox.com/s/3i8qx2fyfjx587o/data.js?dl=0).

## Colour Scheme
Each department was given a different colour. All of them have roughly the same saturation, work harmoniously together and are still distinguishable from each other.
- Pink: Architecture & Design
- Violet: Drawings
- Blue: Painting & Sculpture
- Turquoise: Photography

## Functionality
### Start screen
Here you can see how many artworks there are per department. One rectangle represents ten artworks.

![start screen](https://github.com/sonja-brehm/moma-data-visualisation/blob/main/screenshots/1_startscreen.jpg?raw=true)

If you click on the upper part of a department, you will get a visualisation of the creation and acquisition date for this department. If you click on the lower area, you will get a visualisation of the dimensions. You can return to the start screen by clicking in the upper left corner.

![explanation of navigation](https://github.com/sonja-brehm/moma-data-visualisation/blob/main/screenshots/2_navigation.jpg?raw=true)

### Visualisation of Creation & Acquisition Date
An invisible timeline is located at the top and bottom of this screen. At the top, you can see the creation date, which is linked to the acquisition date at the bottom. Based on these visualisations, you can gather information such as when more pieces were created/acquired or in which departments older artworks are located.

![Creation & Acquisition Screen](https://github.com/sonja-brehm/moma-data-visualisation/blob/main/screenshots/3_timeline.jpg?raw=true)

### Visualisation of Dimensions
The scatterplot shows the distribution of the dimensions, the x-axis showing the width of the piece and the y-axis showing the height. If you hover over the points, you get an additional visualisation for a certain amount of artworks (e.g. all up to 1m² size). 

You can also switch between these two visualisations by mouse-down and mouse-up. If you press and hold the mouse, you will only see the large rectangles. If you rerelease it, you will see the scatterplot until you start to move the mouse again.

Here it is interesting to see how the formats vary in each department, e.g. in photography, you see many standard formats and a few panorama shapes.

![Dimensions Screen](https://github.com/sonja-brehm/moma-data-visualisation/blob/main/screenshots/4_dimensions.gif?raw=true)

### Click-Through Video
A screen recording can be found here: https://vimeo.com/422341899

## Setup
To run the code, you need to download the following library files and place them in a "lib" folder:
- [chroma.min.js](https://gka.github.io/chroma.js/#installation)
- [gmynd.js](https://github.com/hfg-gmuend/gmynd)
- [snap.svg-min](http://snapsvg.io)

Then open momaCollection.html, preferably in Google Chrome, and you're good to go.
