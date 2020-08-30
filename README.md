# Segment Rivals
Web extension to load and show in the segment tables who is the followed user with the best time in each segment.

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

## Usage
Once on the Starred Segments page or an Activity page, click the extension icon to load the followed user who is the leader of each segment.

Move the mouse over the segment leader to see the ranking of followed users.