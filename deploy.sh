#!/bin/bash
server='inmagik@office.inmagik.com'

rsync -avz ./docker-compose.yml $server:/srv/campscapes/docker-compose.yml

ssh $server 'bash -s' <<'ENDSSH'

cd /srv/campscapes
docker-compose down
docker-compose pull
docker-compose up -d

ENDSSH

echo 'https://campscapes.inmagik.com'
