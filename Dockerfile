FROM node
COPY ./ /usr/src/app
RUN cd /usr/src/app && npm install
CMD node ./