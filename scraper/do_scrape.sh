cd /scraper
node update.js /data --pagesize=20

cd /data/campscapes-data

ftp -n -p $HOST <<END_SCRIPT
quote USER $USER
quote PASS $PASSWD
cd ./httpdocs
rename campscapes-data campscapes-data-$(date -Iseconds)
mkdir campscapes-data
cd campscapes-data
binary
prompt
mput *.json
quit
END_SCRIPT
exit 0