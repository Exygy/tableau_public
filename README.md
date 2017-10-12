# Tableau Public

This is a simple module that pulls in Tableau visualizations that are hosted on [Tableau Public](https://public.tableau.com/en-us/s/).

This module lives in two places:

- Drupal.org: https://www.drupal.org/project/tableau_public
- Github: https://github.com/Exygy/tableau_public

We will respond to issues reported in both locations.

## Related modules:

- [Tableau module](https://www.drupal.org/project/tableau): Pull in visualizations & other objects from a stand-alone Tableau server
  - *How this module is different:* Tableau Public only pulls visualizations from the Tableau Public cloud server.  The Tableau module only pulls from stand-alone Tableau servers, *not* Tableau Public.
- [Tableau dashboard module](https://www.drupal.org/project/tableau_dashboard): Pulls in Tableau dashboards only.
  - *How this module is different:* Tableau Public pulls in sheets, not dashboards, and presents custom buttons to switch between sheets.  The dashboard module simply presents dashboards as-is. 
  
# Installation

## 1. Install module

You can install this as a normal Drupal module from Drupal.org, using Drush, or Composer.  You can also pull directly from the public Github repository.  The project will be maintained in both places with the latest version.

## 2. Install enquire.js

Download the latest production version from http://wicky.nillia.ms/enquire.js/.  ([Direct link](https://github.com/WickyNilliams/enquire.js/raw/master/dist/enquire.min.js))  Load in your libraries directory, so it looks like this: `sites/all/libraries/enquire.min.js`

*Note: This step is optional, but without it, your Tableau viz won't automatically resize at mobile breakpoints.*

# Usage

Follow these steps to get up & running with your own Tableau vizualizations!  Prerequisites:
- Tableau Public account with a publicly displayed visualization
- Some sort of entity where you'll display your viz.  This can be a node, field collection, taxonomy term, or even a user!

## 1. Create Fields

Edit your entity (eg. content type) and add the two Tableau Public fields:
1. Tableau Visualization
2. Tableau Sheets

You can name them anything you want.  **Tableau Visualization** should be limited to one item per entity.  For **Tableau Sheets**, you can have as many as you want.

## 2. Manage Display

Click on the "manage display" tab for your entity.  **Tableau Visualization** should be visible, but no label.  The module will override the display in order to show the Tableau viz.  **Tableau Sheets** should be hidden entirely.

## 3. Enter content

Create a new entity or edit an existing one and add the information for your Tableau viz:
- **Viz title:** This is the human readable title and will be displayed above your viz.
- **Dynamic title:** Check this box if you want the title to change, depending on which sheet is selected.  If you don't want the title to change, or if you only have one sheet, you can leave this unchecked.
- **Short code:** This is an internal short code that the module will use to embed the right viz in the right place.  You need to do enter something here if you want to display more than viz on the same page.  *Note: try to keep this short, 4-6 characters, with no spaces or punctuation.*
- **Viz url:** This is the URL for the Tableau viz.  Just the regular web address as if you were visiting the Tableau Public page in your web browser.  *Don't* use the embed code from Tableau Public!
- **Sheets:** Enter as many of these as you wish.  Each sheet requires two pieces of information:
  - **Sheet name:** Use the human readable name for each sheet in your viz.
  - **Mobile layout:** If your sheet contains one or more mobile layouts (eg. for tablets or smartphones), check this box.  The module will reload the viz when it hits certain breakpoints.  *Requires the enquire.js library*  
  
Save your content and the Tableau viz should automagically appear.

# Advanced Usage

The functions to actually display a Tableau viz have been abstracted, so you can use them in your own custom themes or modules.  There are two functions you can use:
- `tableau_public_check($vars)`: This is a simple function to check whether a Tableau viz is present in an entity.  Currently runs on `hook_preprocess_node()` and `hook_preprocess_entity()`.  But you can run it yourself on any function you want.  Just pass the `$vars` array from your preprocess function.
- `tableau_public_add_viz($viz, $sheets)`: This is where the magic happens.  It requires two arguments:
  - `$viz`: This is an array that contains the basic info for the viz you want to render:
    - `title`: the human readable title for this viz
    - `short`: the short code.  This tells the javascript where to insert the viz
    - `dynamic`: indicate whether the title should change based on the sheet
    - `viz`: the url to Tableau Public
  - `$sheets`: This is a second array that contains the sheets you want to render.  It is optional, but follows this format:
    - `sheet`: human readable name of the sheet
    - `mobile`: whether this sheet contains mobile layouts (*Requires the enquire.js library*)

  
# Roadmap

Future features:
- Drush command to load enquire.js
- Embed field help text in module

# Credits

This module was created by [Exygy](exygy.com).  The work was sponsored by the [Vital Signs project](http://www.vitalsigns.mtc.ca.gov/), part of [Bay Area Metro](https://mtc.ca.gov/) (formerly known as MTC).

## Contributors:

- [Catherine Callaghan](https://github.com/callaghanc)
- [Jordan Koplowicz](https://github.com/koppieesq)