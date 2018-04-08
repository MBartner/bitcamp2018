# ARPT
#### Created by Harrison Linowes and Mike Bartner

### Requirements
Android device capable of running Firefox Nightly.
### Testing Steps
##### To host:
  On Firefox Nightly, go to http://ec2-34-235-88-175.compute-1.amazonaws.com/Client/bitcamp.html
  Allow the website to share your camera.
  Point your camera at the image found here: https://upload.wikimedia.org/wikipedia/commons/0/08/Pattern-hiro.png
  Select rotate to manipulate object on axis, position to move object on the grid, and pinch to scale.
##### To observe:
  On Firefox Nightly, go to http://ec2-34-235-88-175.compute-1.amazonaws.com/Client/observe.html
  Allow the website to share your camera.
  Point your camera at the image found here: https://upload.wikimedia.org/wikipedia/commons/0/08/Pattern-hiro.png
  Observe.
  
## Inspiration
We were inspired by movies such as the Avengers where the team looks at AR holograms before going on a mission. The idea that a group of individuals can easily view and interact with a hologram to facilitate understanding is futuristic but possible with today's technology.

## What it does
ARPT allows users to visit a web page on a mobile or desktop device where they can view augmented reality holograms of various models such as 3D landscapes, machined components, or 3D data visualizations. With ARPT a presenter can control the model's position, rotation, and scale in order to modify it for easiest understanding by the group. As the presenter modifies the model it will be updated on observers view port in real time.

This technology can be used in various situations for a variety of people. ARPT is web based making it accessible to all people with web enabled devices, this overall allows anyone with a mobile device to easily and comfortably view the presentation. Other applications of ARPT are for visualizing models and 3D terrain maps on the go, including disaster and rescue situations when proper presentation equipment is not available.

## How we built it
We built ARPT using node.js, javascript, three.js, and aframe.

## Challenges we ran into
We ran into challenges related to transferring data on the server.

## Accomplishments that we're proud of
We are excited that we were able to connect devices and properly update elements of the model for all users.
