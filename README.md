[![Build Status](https://travis-ci.org/jsirgo/segment-rivals-web-ext.svg?branch=master)](https://travis-ci.org/jsirgo/segment-rivals-web-ext)
# Segment Rivals
Web extension to load and show in Strava segment tables who is the followed user with the best time in each segment.

**This extension doesn't work on users who aren't Strava Summit members**

## Build steps
Prerequisites: Node.js

Install dependencies
```
npm install
```
Build code
```
npm run build
```
Package extension
```
npm run package
```

## Add extension to Firefox
Firefox don't allow to install an extension if it is not signed, but the extension can be added temporary through extensions debugging page: `about:debugging#/runtime/this-firefox`

Click on 'Load Temporary Add-on' and select packaged zip or manifest.json file on dist folder.

## Add extension to Chrome
Once on `chrome://extensions/` enable developer mode, reload the page and then drag and drop packaged zip to the page or click on 'Load unpacked' and select extension dist folder.

## Usage
Once on the Starred Segments page or an Activity page, click the extension icon to load the followed user who is the leader of each segment.

![extension icon](https://github.com/jsirgo/segment-rivals-web-ext/raw/master/screenshots/screenshot3.png)

![extension column](https://github.com/jsirgo/segment-rivals-web-ext/raw/master/screenshots/screenshot1.png)

Move the mouse over the segment leader to see the ranking of followed users.

![extension ranking](https://github.com/jsirgo/segment-rivals-web-ext/raw/master/screenshots/screenshot2.png)

## Disclaimer
This application is released "as-is", without any warrant, responsibility, liability or support.
All the information used in this extension is readily available in Strava website.

This application is not endorsed by Strava and the development hasn´t any relation with Strava Inc.
The term Strava is an exclusive trademark of, and owned by, Strava Inc.
