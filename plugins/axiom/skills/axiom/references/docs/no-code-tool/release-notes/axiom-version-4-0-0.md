---
title: Build smarter with nesting, chatgpt 4, and cloud sessions
version: "4.0"
date: 2024-01-11
featuredimg: /release-4-0.png
video: https://www.youtube.com/embed/9NTJ8yA3xyY?rel=0&amp
---

::HeroMedia
::

## Axiom 4.0 is here
***

After many months of development, we are proud to release Axiom 4.0!

This overhaul of the UI and underlying engine lays the groundwork for the 4.x version updates, which will focus on simplifying the onboarding and increasing the power of the features available in the builder.

We've also refreshed the design of the builder, with the main focus being reducing visual noise and making everything more compact and consistent.

## Introducing nested steps
***

Axiom previously used a flat structure in the builder. This works fine for simple axioms, but for more complex use cases builds can become confusing due to the use of multiple "Jump" steps. Looping functionality was also limited to "Interact" steps like clicking, which made some more complex builds difficult or even impossible to pull off.

With axiom 4.0 you can now nest steps within other steps in a more generalised way.

<img src="/releases/nesting-example.jpg" alt="new nesting features in  - axiom.ai">

### Loop through data

<img src="/releases/loop-through.jpg" alt="Loop through data step - axiom.ai">

Similar to the old "Interact with a page's interface" step, but much more flexible. You can now place any step inisde a loop (including another loop).

### If statement

<img src="/releases/if-condition-r.jpg" alt="If condition step - axiom.ai">

When the condition in the If statement is true, all nested steps are run. If the condition is false, all steps are skipped.

### Try / Catch

<img src="/releases/try-catch.jpg" alt="Try catch step - axiom.ai">

Enhance error handling with this step for advanced builders. First, the steps in the "try" section are run. Then, if an error is hit, execution switches to the "catch" section, running those steps. This opens the door to flexible and powerful error handling, well beyond what can be done with the existing notifications system.

## New snippets to get started faster
***

<img src="/releases/snippets.jpg" alt="start makig an axiom with snippets - axiom.ai">

You can now get into building in a single click by using the new beginner snippets, which cover common design patterns in axiom. Click to add and then fill in the details as you need.

## Store cookies for use in the cloud
***

<img src="/releases/stored-cookies.jpg" alt="store cookies for use in the cloud - axiom.ai">

You can now optionally store local session cookies remotely. This will allow you to use your local session to connect to websites using the cloud system, which allows the use of the cloud scheduler and API calls.

Cookies are stored encrypted and the feature is opt-in and fully configurable - no cookies are saved except the ones you specify.

## Enhanced select, move and copy commands
***

<img src="/releases/move.jpg" alt="organizing your steps - axiom.ai">

We have cleared up and improved the move and copy commands to work with the new interface. The toolbar has also been enhanced with new features, including adding the ability to loop all the selected steps.

## Improved step finder
***

<img src="/releases/enter-text-finder.jpg" alt="new step finder in the axiom builder - axiom.ai">

The step finder has been improved with a more compact design and significantly enhanced keyboard controls. You can now move up and down the list with the cursor keys after searching, press enter to add a step, and even add multiple steps by using the "\*x" suffix. For example, "Enter Text\*4" will add 4 of the "Enter Text" step to your axiom. This will always add the highlighted step, so you can still move the cursor to another step and keep the multiplier.

## Support for Chat GPT 4.0
***

<img src="/releases/chatgptv4.jpg" alt="support for ChatGpt4 - axiom.ai">

Chat GPT 4.0 can now be selected for the AI steps, if you have an account with this enabled. You can still use 3.5 as the default.

## Internal docs page
***

<img src="/releases/internal-docs.jpg" alt="new internal docs display - axiom.ai">

Documentation is now available from within the sidebar while you're working on an axiom. You no longer have to switch to a separate tab to get advice on your issue.

## Set your own run limits
***

<img src="/releases/runtime-limit.jpg" alt="new run limit - axiom.ai">

You can now set a maximum time your axiom can run to manually cut off slow or hanging bot runs. You cannot set this higher than the maximum enforced by your account level, of course!

## Improved iframe support in the selector tool
***

<img src="/releases/iframe-selector.jpg" alt="iframe support in selector tool - axiom.ai">

You can now more clearly see whether an element you want to select is inside an iframe or not, and you can enable iframe support from right within the selector tool.

## Control scraper scroll distance
***

<img src="/releases/scroll-height-scraper.jpg" alt="set scroll distance scraper tool - axiom.ai">

In very rare cases, the smart scrolling in axiom is not able to find the next item you want. In these cases we now provide the option to manually set the scroll distance that the scraper should use, bypassing the automated system and allowing those cases to work properly.

## Minor fixes
***

- Remote and local runs are now more clearly differentiated in run reports
- Minor improvements to error messages for Google Sheet steps
- Step names automatically assigned for more step types
- You can now update your own email address from within the extension
- Fixed an issue where some downloads did not overwrite existing files correctly
