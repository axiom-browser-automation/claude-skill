---
title: VPS Guide
description: Learn how to use your own VPS server to schedule and run bots remotely.
---

Your VPS is accessible through a web browser via a dedicated URL.

The link to access your VPS is accessible via "My VPS" in the axiom.ai extension.

**Please logout and login again to see this link after we setup your VPS for the first time, or you will not see the link.**

<img src="/img/my-vps-extension.png"/>

## Your VPS is like running axiom.ai Desktop on a dedicated machine
***

Your VPS is a private browser that can store sessions and run bots on a schedule (see
below).

From this link you have keyboard and mouse control over your VPS, unlike in regular axiom.ai
cloud.

When doing this axiom.ai on the VPS will behave just like a desktop application with the bot
running locally on the VPS.

The VPS contains its own version of axio.aim that opens on every page. This is necessary for
Chrome to keep axiom.ai active and to run schedules.

## VPS reboots
***

Your VPS will reboot once daily (by default this is at 3 am UTC).

This occurs to prevent problems with Chrome after it is left running for too long.

## VPS connection issues
***

If your VPS link fails to connect this (usually) means another user is logged in, or you’ve left a
tab open with the VPS connection active.

This can happen when a company has multiple people using the same axiom.ai account. Multiple people cannot use the VPS simultaneously.

To logout of a VPS session simply close the browser tab in which the VPS is open.

For users with many tabs open finding out where the VPS is being used can be a problem. Please email support if you are unable to connect to your VPS and we can close any active sessions for you to restore access.

## File downloads
***

The VPS is not subject to same file download restrictions as running on the cloud. Files can be saved to and uploaded from the VPS file system during bot runs. 

If you'd like to access files on the VPS outside of bot runs, they are located in `/home/seluser/Downloads`. You'll need to use a service with a web interface, like Google Drive, Dropbox or similar, to transfer files into and out of the VPS. 

## Scheduling on the VPS
***

Please ensure that:

1. Your schedule is set to ‘Run on this computer (this labelling is currently confusing - it arises
because the run will be ‘local’ to the VPS).

2. You are logged into any websites on the VPS that require session access. If you have added login steps to your bot already these can be removed.

If you have any issues, please contact [support](/customer-support).