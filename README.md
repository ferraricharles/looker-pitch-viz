Looker Football Pitch Custom Visualization

A custom visualization for Looker built with pure JavaScript to plot coordinate-based data onto a football (soccer) pitch. This allows you to visualize player positions, events, or any other data that has X and Y coordinates directly within a Looker Explore.

This visualization requires no external dependencies or backend services.

<img width="962" height="615" alt="image" src="https://github.com/user-attachments/assets/bf31e708-f973-46ef-a989-63bc5a48cfec" />


# How to Use
To use this visualization, your Looker Explore query must contain at least two dimensions in the following order:

X Coordinate: A numeric dimension representing the horizontal position (ideally from 0 to 105).

Y Coordinate: A numeric dimension representing the vertical position (ideally from 0 to 68).

Category (Optional): A string dimension (e.g., Team Name) to color-code the dots.

Once you run the query, select "Football Pitch" from the visualization dropdown menu.

# Installation

Add the Visualization to Your Looker Project 

Place the visualization's JavaScript file (e.g., pitch.js) in the root of your LookML project.

In your project's main manifest.lkml file, add the following visualization block:
    project_name: "your_project_name"
    
    visualization: {
      id: "js-football-pitch"
      label: "Football Pitch"
      file: "pitch.js"
    }
Deploy your project. The visualization will now be available to all users within that project.


