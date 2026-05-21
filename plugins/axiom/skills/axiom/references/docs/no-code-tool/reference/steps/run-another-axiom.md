---
title: Run another Axiom step
description: Run other Axioms from inside a single Axiom with this step. Use to chain automations or reuse existing bots.
category: Control flow
icon: WidgetRunAxiom.svg
---

::HeroMedia{video="https://www.youtube.com/embed/PCYHijmR0jY?rel=0&amp;start=504&end=524?rel=0"}
::

## What to use the Run another Axiom step for
***

This step loads one Axiom into another. You can use this step to create a 'Controller' Axiom that can run multiple sub Axioms. This is a great design pattern if you find yourself creating Axioms with more than 20 steps. However, it's important to note that embedded Axioms cannot share data directly only indirectly through a step like a [Read data from a Google Sheet.](/docs/no-code-tool/reference/steps/read-data-from-a-google-sheet-step)
You can use this step to:

- Combine Axioms inside a 'Controller' Axiom
- Breakdown long Axioms into smaller Axioms 

## Configuration
***

### Selected Axiom

Select the Axiom to run from the drop-down list.
