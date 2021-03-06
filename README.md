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
4. Run `npm install` command on each node root folder
- node-user
- node-search
- node-competition

5a. run each service with pm2
- `pm2 start node-users/bin/www --name node-users -i max`
- `pm2 start node-search/bin/www --name node-search -i max`
- `pm2 start node-competition/bin/www --name node-competition -i max`

5b. Alternatively, you may run the services manually using `npm start` on the root of each service.
    In case of pm2 not being able to spawn the processes, use npm start to run the services one by one.

```
    NOTE: In case of node error:
    Block-scoped declarations not yet supported outside strict mode

    Please update nodejs to the version mentioned in this README file
```

6.
- Service node-users should be accessible on
`http://localhost:3000`
- Service node-search should be accessible on
`http://localhost:3001`
- Service node-competition should be accessible on
`http://localhost:3002`

7. self-documented endpoints are accessible on each microservice on endpoint /apidoc e.g.:
- Doc for node-users:
`http://localhost:3000/apidoc`
- Doc for node-search:
`http://localhost:3001/apidoc`
- Doc for node-competition:
`http://localhost:3002/apidoc`

8. To run unit tests, run the `npm test` command on the node-* root folder.

9. To stop the services run
- `pm2 stop node-users`
- `pm2 stop node-search`
- `pm2 stop node-competition`

- `pm2 delete node-users`
- `pm2 delete node-search`
- `pm2 delete node-competition`

## Unit Testing
Used chai and mocha library to write unit tests.
Running the `npm test` command will run some tests on the service

## Development decisions
- Will use PM2 to make use of node clustering scalability and also for the application high availability.
When deploying the application with PM2, we can take advantage of clustering without modifying the application code.
- The /health endpoint will act as healthcheck
- The application is using winston module to log all the debug/info/error messages in logs/app.log folder as well as printing them in the console.
- Documentation created with apiDoc module
- Using body-parser and express-validator to filter malicious input.
- Using Request module to be able to notify the other microservices when a user has been added or modified.
- These microservices do not implement any authentication. Ideally, any Rest Service microservice should also implement authentication, e.g. token based authentication (OAuth)
- Excluded Password field from all the listing endpoints for security purposes.
- The search with criteria endpoint currently works only with Match whole word, match case as the mock database module I used does not support regex.
  I tested a few approaches and it might be a bug in the mongomock implementation. Using a live db environment, this endpoint will use regex to search the criteria

## Scalability
All microservices are scaled accross all CPUs available, without any code modifications using the node.js cluster module.
Processes can be managed and monitored using PM2 (http://pm2.keymetrics.io)

To enable cluster mode, start your application like e.g.:
```
#Start 4 worker processes
pm2 start app.js -i 4
#Auto-detect number of available CPUs and start that many worker processes
pm2 start app.js -i max
```

Once running, a given application with the name app can be scaled like e.g.:
```
#Add 3 more workers
pm2 scale app +3
#Scale to a specific number of workers
pm2 scale app 2
```

## Technologies used
- Node.js
- Express - Minimal and flexible Node.js web application framework (https://expressjs.com)
- PM2 - Advanced, production process manager for Node.js (http://pm2.keymetrics.io)
- apiDoc - Self-documented Endpoints

- Mongomock - mongoDb-native mocking library (https://www.npmjs.com/package/mongomock)

- Morgan - HTTP request logging middlewear
- Winston - Logging library for Node.js.

- Jade - View engine

- body-parser - Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
- express-validator - set of express.js middlewares that wraps validator.js validator and sanitizer functions.

- request - Request is designed to be the simplest way possible to make http calls. It supports HTTPS and follows redirects by default.

- mocha & chai - write unit tests
