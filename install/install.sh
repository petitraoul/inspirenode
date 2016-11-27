#!/bin/bash

if [! -f  ../serveur_api/mydb.db ]; then
   cp mydb_install.db ../serveur_api/mydb.db
fi
if [! -f  ../serveur_api/mydb_camping.db ]; then
   cp mydb_install.db ../serveur_api/mydb_camping.db
fi
if [! -f  ../serveur_api/mydb_indus.db ]; then
   cp mydb_install.db ../serveur_api/mydb_indus.db
fi

