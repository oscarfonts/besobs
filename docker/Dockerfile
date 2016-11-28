FROM node:4.6

MAINTAINER Oscar Fonts <oscar.fonts@geomati.co>

RUN apt-get update \
 && apt-get install -y --no-install-recommends unzip \
 && rm -rf /var/lib/apt/lists/*

RUN wget https://github.com/oscarfonts/besobs/archive/master.zip \
 && unzip master.zip \
 && mv besobs-master/src besobs \
 && rm -rf master.zip besobs-master

WORKDIR /besobs
RUN npm install \
 && npm install -g bower \
 && bower --allow-root install

EXPOSE 2015

CMD ["node", "server.js"]
