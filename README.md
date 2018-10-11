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
4. Run `npm install` on each service
- node-users
- node-search
- node-competition

5. run each service with pm2
- `pm2 start node-users/bin/www --name node-users`
- `pm2 start node-search/bin/www --name node-search`
- `pm2 start node-competition/bin/www --name node-competition`

6.
- Service node-users should be accessible on
`http://localhost:3000`
- Service node-search should be accessible on
`http://localhost:3001`
- Service node-competition should be accessible on
`http://localhost:3002`

7. self-documented endpoints are accessible on:

8. To stop the services run
- `pm2 stop node-users`
- `pm2 stop node-search`
- `pm2 stop node-competition`

- `pm2 delete node-users`
- `pm2 delete node-search`
- `pm2 delete node-competition`



## Development decisions
- The application is using winston module to log all the debug/info/error messages in logs/app.log folder as well as printing them in the console.
- Using body-parser and express-validator to filter malicious input.
- Using Request module to be able to notify the other microservices when a user has been added or modified.
- These microservices do not implement any authentication. Ideally, any Rest Service microservice should also implement authentication, e.g. token based authentication (OAuth)
- password field is excluded from all the listing endpoints

## Scalability
All microservices are scaled accross all CPUs available, without any code modifications using the node.js cluster module.
Processes can be managed and monitored using PM2 (http://pm2.keymetrics.io)

## Technologies used
- Node.js
- Express - Minimal and flexible Node.js web application framework (https://expressjs.com)
- PM2 - Advanced, production process manager for Node.js (http://pm2.keymetrics.io)

- Mongomock - mongoDb-native mocking library (https://www.npmjs.com/package/mongomock)

- Morgan - HTTP request logging middlewear
- Winston - Logging library for Node.js.

- Jade - View engine

- body-parser - Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
- express-validator - set of express.js middlewares that wraps validator.js validator and sanitizer functions.

- request - Request is designed to be the simplest way possible to make http calls. It supports HTTPS and follows redirects by default.
