# toddler-checklist
## Description
### Basic Premise
A daily checklist web app, with a toddler friendly UI that prompts toddlers to check off daily tasks: put on clothes (morning), change diaper (morning), wash hands after school (evening), eat dinner (evening), put toys back (evening), change diaper (evening). Each of these prompts shows an 8-bit animation of a boy performing that very action in Thre.JS. The prompts are time-based and expires past a point, eg `put on clothes` becomes active at 7:30 am and inactive at 8:30 am, and prompts are in a sequence. Once expired, prompts are stored as `unchecked`, otherwise as `checked`. 

### Animation
As a prompt is checked, display a higher resolution full screen animation with three.js showing a boy perform that verye activity (an better, more engaging version of the 8-bit animation).

### Game map 
1. After the acitivty animation is played, show a Super Mario like game map, with circle steps representing all prompts scheduled for the day, leading to a metaphorical castle that is bedtime. 
- the goal of the Super Mario like game map is to gamify the progress of the day. it should be clear and captivating to children
2. The start of the game map should be a bulleye, indicating starting point (not represented by any prompt). 
3. The last circle step should represent the last prompt of the day before bedtime closest to the castle
4. When a prompt is checked, game map should show another animation with an 8-bit toddler character moving from one step to the next. 
5. Initially the 8-bit character should be standing on the starting point rendered in a bull's eye, and is not represented by any prompt. 
6. On the game map, if a check is not done show the cirle in red, otherwise shiny green.

### Navigation
The prompt should be a full screen takeover with an X on bottom left and a Check Mark on bottom right, upon tapping X should take user to the game map, showing where the toddler animation-icon is (again similar to Super Mario). After one minute the screen again activates the current unchecked prompt. Upon tapping the Check Mark should activate the aforementioned animation and then game map post-animation. 
## Tech Stack
The basic display and navigation should be done in React & Typescript. The game engine, animation, and 3D world view should be implemented with Three.JS.