# few-word-do-trick

Client: NextJS
Server: NestJS

## Development: 
Client code lives under `workspaces/client/`. To run it locally, run `yarn dev:client` on root directory, or `yarn dev` within the client directory and head to http://localhost:3000. 

Server code lives under `workspaces/server/`. To run it locally, run `yarn dev:server` on root directory, or `yarn dev` within the server directory and make your request to http://localhost:8080. 

As they are running on different ports, you can run both at the same time by running `yarn dev` on the root directory as a shortcut. 


## Deployment
This is hooked up to AWS CodePipeline and automatically deployed to Elastic Beanstalk. 
