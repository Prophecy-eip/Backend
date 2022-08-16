#!/bin/bash

CONTAINER_ID=$(docker ps | grep backend_db | cut -f1 -d' ')

docker exec -it $CONTAINER_ID hostname -i