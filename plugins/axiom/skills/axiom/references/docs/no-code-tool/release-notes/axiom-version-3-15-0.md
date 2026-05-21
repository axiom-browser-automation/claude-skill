---
title: Custom scraper settings, new templates, and payment upgrade
version: 3.15
date: 2023-01-09
video: https://www.youtube.com/embed/JFMFNBbJvhg?rel=0&amp
---

::HeroMedia
::

## Expanded parameters for the scraper
***

We have exposed several new parameters in the scraper which were previously being automagically managed.

<img src="/releases/scraper-params.jpg" alt="change scraper setting in Axiom for better performance">

This was a nice idea in theory, but the reality is that the world of websites is too varied and contradictory for a single solution to ever be optimal. This resulted in Axiom often running slower than it needed to in order to accomodate relatively rare website features, or in order to maximise its reliability in all cases.

The new scraper parameters, in addition to the existing options, allow you to control the scroll speed and behaviour, and gives you more control over axiom's way of checking for new results. Playing with these new options will allow you to get much better performance for your specific use case.

Existing scrapers should not be affected.

## Revamped payment system
***

We have migrated to a fully Stripe-hosted payment system, which should be much more reliable. It also gives us the option to support a broader range of payment systems, including alternate payment methods such as Apple pay, Google pay or Paypal.

<img src="/releases/payment.jpg" alt="new axiom stripe payment pages">

In addition, customers now have access to a customer portal, available from the "Account" page, which lets you view invoices and change your payment card details without having to contact support.

## New templates to teach common design patterns
***

As part of an ongoing effort to make learning axiom easier, and to make sure new users understand the best practices for building automations, we have released a number of new templates focused on teaching fundamental design patterns for building in axiom.

The new templates are general and can be used for a wide variety of automations.

Further work is being done to more intelligently suggest these design patterns when they are applicable. Stay tuned!

<img src="/releases/templates.jpg" alt="new axiom templates in extension and on website">

See the templates on our website [here](/guides).

## New documentation on javascript snippets
***

We have added a number of new javascript snippets to the documentation. These are frequently useful in building automations; hopefully you find them so!

The new page can be found [here](/docs/developer-hub/snippets/javascript).

## Zapier integration within axiom.ai
***

We have implemented Zapier's new embed feature to allow you to access your axiom.ai zaps from within the axiom.ai application.

## Minor fixes
***

- Validation messages no longer thrown when steps have been disabled.
- Users now cannot get stuck if their session is expired immediately after registration.
- Improvements to download error handling.
- Implemented Net Promoter Score survey to take user feedback in-app.
- Improved error message when a bot hits its single run limit.
- Significantly improved speed when an axiom.ai is initially saved.
- Added more information about steps that require data to be generated in order to work.
