FROM ubuntu AS ubuntu-npm-base

RUN apt-get update
RUN apt-get install -y nodejs && apt-get install -y npm

####################################################################################################
FROM ubuntu-npm-base

RUN mkdir /yelpcamp
COPY . /yelpcamp
WORKDIR /yelpcamp

RUN npm config set strict-ssl false
RUN npm install

USER nobody

ENTRYPOINT [ "npm" ]
CMD [ "start" ]