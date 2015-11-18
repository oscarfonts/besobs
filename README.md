# Observacions Faunístiques


## Install and run

Requires git, node and npm.

Clone this project:

    git clone https://github.com/oscarfonts/besobs.git

Install node dependencies:

    npm install

Install bower dependencies:

    bower install

Create some users:

    node auth/create_user.js <username> <password>

Note an users database will be created on ```auth/users.db```.

Create the `cartodb/secret.js` file and put your CartoDB credentials (username and api key). Use `cartodb/secret.js.example` as model.

Run using node:

    node server.js

Then access through your browser:

   <http://localhost:2015/>

   <http://localhost:2015/api/>


## Adding dependencies

Server side:

    npm install --save <node_package>

Client side:

    bower install --save <bower_package>
