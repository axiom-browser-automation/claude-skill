---
title: Better sheets integration, loop controls, and fixes
date: 2022-02-03
version: 3.6
releasevideo: https://www.youtube.com/embed/yLtvtx1YKVg
featuredimg: /version3-6-new.jpg
---


::HeroMedia{video="https://www.youtube.com/embed/yLtvtx1YKVg?rel=0&amp;"}
::


## New features
***

- New interface to select Google Sheets directly from your drive account - you no longer have to copy and paste the URLs (unless you want to of course - the old way is still supported).
- New interface to explicitly present the concept of looping, and to allow it to be toggled on and off. Previously the implementation of loops happened automatically, with a hidden mechanism that could be confusing if you didn’t know the trick.
- Max Wait parameter removed from scrapers; it was a trap for new users.
- Improved error messages for some Google Sheets problems.
- We now warn you if no output step has been added (and therefore the automation won’t do anything). You are prompted to either add an output step or to run anyway, in which case the automation engine will automatically display any scraped results.
- Link to documentation added to the Custom Selector interface.


## Bug fixes
***

- More contextual information added to tokens to help aid in understanding.
- Runs that are terminated for running over their maximum allowed runtime send a more helpful error message.
- Improvements to how tokens created within loops work to prevent common errors.
