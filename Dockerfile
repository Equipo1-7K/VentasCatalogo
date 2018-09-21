FROM ubuntu:18.04
COPY ./ /usr/src/app
CMD sh /usr/src/app/Docker/deploy.sh