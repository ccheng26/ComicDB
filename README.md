# ComicDB

##  Don't Be Late

**User Stories**

As someone who hasn't been in (or is new) the graphic novel scene, I want to be able to look up characters so I know which characters people are talking about.

**Minimum Viable Product**

Original MVP: Player has to get collect objects and get from point A to point B
This game initially started out with two stages:
* a point and click game
* collision detection game

The second one didn't happen.

**Final MVP**: Player has to collect all objects within a set time frame. If timer runs out, player loses; if all objects are collected, player wins.


**Technologies Used**:
* HTML: to render the server in browser
* CSS: page formatting
* JavaScript: page funcationality
  * jQuery: selecting items, appending them to the dom, running onclick functions such as ajax calls (getting data from external api)
  * node package manager: package installation
	* express: standard framework for site post and get requests
	* mustache: page templating
	* pg-promise: for database item retreval
	* method-override: allowing post requests to delete and update items
	* express-session: user save sessions 
	* bcrypt: password encryption for security
* GitHub: version control
* Heroku: for making the page live complete with server hosing

**The Approach Taken**:
* Started with API research, upon deciding on an idea, started user stories,
* Established table structure based on information needed for display, then began wireframing
* Began coding JavaScript ajax calls and working on the client side display
* Created routes for items 
 * started with search route, to make sure ajax calls were working correctly, click listener added to page and render the results in browser
 * moved onto signup route for get and post information to a database table
 * used the same process for posting information to save item data to a seperate table
 * created login route to check on user sessions, passwords and emails would be compared before allowing login and remembers user session until logout
 * changed page renders and redirects
* Uploaded to Heroku

**Installation Instructions**
* download node package manager at https://nodejs.org/en/
* initialize file: in terminal type "npm init"
* install node packages by typing "npm install 'package-name' --save
 * --save will add it to your package.json (which will create dependencies)
 * following package names for items are listed below:
  * bcryptjs: "bcryptjs"
  * body parser: "body-parser",
  * express: "express",
  * express session: "express-session",
  * method override: "method-override",
  * mustache: "mustache",
  * mustache express: "mustache-express",
  * pg promise:"pg-promise"

**Unsolved Problems**
* Creating an alert for page errors was an issue (via express-flash), I was able to hack this by displaying an alert before a page redirect, but for a catch I would've liked to implement some notification as opposed to a sent page. There were several issues targeting specific resources in the API.


Special Thanks to the Stack Overflow community, various students, instructors, and instructional assistants at GA who've tested my site and helped with code revisions along the way. This site wouldn't have been possible without their help and the ridiculous amount of things I've learned from the previous homework assignments.


