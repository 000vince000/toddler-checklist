# toddler-checklist
## Description
### Basic Premise
A daily checklist web app, with a toddler friendly UI that prompts toddlers to check off daily tasks: put on clothes (morning), change diaper (morning), wash hands after school (evening), eat dinner (evening), put toys back (evening), change diaper (evening). Each of these prompts shows an 8-bit animation of a boy performing that very action in Thre.JS. The prompts are time-based and expires past a point, eg `put on clothes` becomes active at 7:30 am and inactive at 8:30 am, and prompts are in a sequence. Once expired, prompts are stored as `unchecked`, otherwise as `checked`. 
### Animation
As a prompt is checked, display a higher resolution full screen animation with three.js showing a boy perform that verye activity (an better, more engaging version of the 8-bit animation).
### Post-Animation
After the acitivty animation is played, show a Super Mario like game map, with a roadmap showing circles as checks (representing all checks scheduled for the day) leading to a castle that is bedtime. When a task is checked and animation played, roadmap should show another animation with an 8-bit toddler character moving from one circle to the next. On the roadmap, if a check is not done show the cirle in red, otherwise shiny green.
### Navigation
The prompt should be a full screen takeover with an X on bottom left and a Check Mark on bottom right, upon tapping X should take user to the roadmap, showing where the toddler animation-icon is (again similar to Super Mario). After one minute the screen again activates the current unchecked prompt. Upon tapping the Check Mark should activate the aforementioned animation and then roadmap post-animation. 
## Tech Stack
The basic display and navigation should be done in React & Typescript. The game engine, animation, and 3D world view should be implemented with Three.JS.