#!/bin/bash

service inspirenode stop
service inspirecamp stop
service inspireindus stop

git clone https://github.com/petitraoul/inspirenode_server.git downloadupdate

/bin/cp -rf /downloadupdate/* ../

../npm install

service inspirenode start
