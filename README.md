# Observacions Faunístiques


## Install and run

Requires git, node 4.x and npm.

Clone this project:

    git clone https://github.com/oscarfonts/besobs.git

Install node dependencies:

    npm install

Install bower dependencies:

    bower install

Create some users:

    node auth/create_user.js <username> <password>

Note an users database will be created on ```DATA_DIR/users.db```.

Create the `DATA_DIR/cartodb.json` file and put your CartoDB credentials (username and api key). Use `DATA_DIR/cartodb.sample.json` as model.

Run using node (we can optionally specify a different location for DATA_DIR):

    node server.js [<data_dir_location>]

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

Create the `DATA_DIR/cartodb.json` file.

Add some users with the creat_user.js helper (see above).

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

    http://demo.fonts.cat/besobs/

### Server update script

```
wget https://github.com/oscarfonts/besobs/archive/master.zip
unzip master.zip
rm master.zip
cp -r besobs/DATA_DIR besobs-master/
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
    