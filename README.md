# nodejs-task
A specific route that will extract the address and title from the query string
For example
/I/want/title/?address=yahoo.com&address=www.dawn.com/events&address=meta.com
The above url will return the below out put
- yahoo.com - "Yahoo | Mail, Weather, Search, Politics, News, Finance, Sports & Videos"
- www.dawn.com/events - "Events - DAWN.COM - DAWN.COM"
- meta.com - "Meta - Shop VR Headsets & Smart Glasses"
---
## Requirements

For development, you will only need Node.js and a node global package npm installed on your system,

## Install

    $ git clone https://github.com/theabdul129/nodejs-task.git
    $ cd nodejs-task
    $ npm install

## Running the project with express

    $ node server.js
server will start running on port 3900,
    
## Running the project with streams

$ node streams.js

server will start running on port 3800,

## Running the project with Plain

$ node plain.js

server will start running on port 3300,
