FROM registry.inmagik.com/websocketscreen/websocketscreen-node

RUN apt-get update && apt-get install ftp nano -y

RUN mkdir /scraper
RUN mkdir /data
ADD ./package.json /scraper
WORKDIR /scraper
RUN npm i

ADD ./scraper/api.js /scraper
ADD ./scraper/update.js /scraper
ADD ./scraper/commands.yml /scraper
ADD ./scraper/do_scrape.sh /scraper
RUN chmod +x /scraper/do_scrape.sh

WORKDIR /websocketscreen

