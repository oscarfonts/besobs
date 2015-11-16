=========================
Observacions Faunístiques
=========================


Running Server
==============

Create the secret.js file and fill in your CartoDB credentials (username and api key); use the example file as model.

Run using node:

> npm install
> node server.js

Then access through your browser:

   http://localhost:2015/api/



Using Bower
===========

To install the development version of the app, you need to have bower installed (first, you should install node, npm and git)
http://bower.io/#install-bower

Then get the dependencies via bower
>bower install

A good way to run the app: install and run http-server
>npm install -g http-server
>http-server -p 6969

To add external components, do it also via bower
>bower install --save bootstrap-datepicker