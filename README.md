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


## Deploying on a server

Get the code:

    cd /srv
    wget https://github.com/oscarfonts/besobs/archive/master.zip
    unzip master.zip
    rm master.zip
    mv besobs-master besobs

Get the dependencies:

    cd besobs
    npm install
    bower install

Create the `cartodb/secret.js` file.

Add some users:

    node auth/create_user.js <username> <password>

Create the photo upload dir:

    mkdir -p file_upload/uploads

Change permissions over files:

    chown -R www-data .

Copy & run the upstart script:

    mv besobs/deploy/besobs.conf /etc/init/
    chown root /etc/init/besobs.conf
    service besobs start

Expose port 2015 through Apache, editing `/etc/apache2/sites-available/<whatever>.conf`:

    ProxyPass /besobs http://localhost:2015
    ProxyPassReverse /besobs http://localhost:2015

Then restart apache:

    service apache2 reload

And access:

    http://demo.geomati.co/besobs/

### Server update script

```
wget https://github.com/oscarfonts/besobs/archive/master.zip
unzip master.zip
rm master.zip
cp besobs/cartodb/secret.js besobs-master/cartodb/
cp besobs/auth/users.db besobs-master/auth/
cp -r besobs/file_upload/uploads besobs-master/file_upload/
mv besobs besobs-old
mv besobs-master besobs
cd besobs
npm install
bower --allow-root install
chown -R www-data .
service besobs stop
service besobs start
service apache2 reload
```
