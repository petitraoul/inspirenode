FROM node

WORKDIR /home
RUN git clone https://github.com/petitraoul/inspirenode.git inspirenode
WORKDIR /home/inspirenode

RUN npm install
RUN npm install sqlite3

WORKDIR /home
RUN wget http://www.sqlite.org/sqlite-autoconf-3070603.tar.gz
RUN tar xvfz sqlite-autoconf-3070603.tar.gz
WORKDIR /home/sqlite-autoconf-3070603
RUN ./configure
RUN make
RUN make install

WORKDIR /home/inspirenode
RUN cp install/mydb_install.db serveur_api/mydb.db

EXPOSE 1339 1338

ENTRYPOINT ["node","app.js"]