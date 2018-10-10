# microservices-concept
Microservices proof of concept


## Instructions
1. git clone https://github.com/SkylightDev/microservices-concept.git
2. intall NodeJS and NPM
Version used for these microservices:
NodeJS v7.5.0
NPM v4.1.2

3. install PM2 (Advanced, production process manager for Node.js)
Advanced production process manager for Node.js
- used for managing and monitor the node processes. Useful when scaling applications using the cluster module

This proof of concept will make use of the node clustering module to take advantage of multi-core systems as nodejs is a single-thread instance by default.

```
npm install pm2 -g
```
4.

## Scalability
All microservices are scaled accross all CPUs available, without any code modifications using the node.js cluster module.
Processes can be managed and monitored using PM2 (http://pm2.keymetrics.io)

## Technologies used
- Node.js
- Express - Minimal and flexible Node.js web application framework (https://expressjs.com)
- PM2 - Advanced, production process manager for Node.js (http://pm2.keymetrics.io)

- Morgan - HTTP request logging middlewear
- Winston - Logging library for Node.js.

- Jade - View engine
