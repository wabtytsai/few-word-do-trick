# few-word-do-trick

Client: NextJS
Server: NestJS

## Development: 
Client code lives under `workspaces/client/app`. To run it locally, run `yarn start:dev:client` on root directory, or `yarn dev` within the client directory and head to http://localhost:3000. 

Server code lives under `workspaces/server/src`. To run it locally, run `yarn start:dev:server` on root directory, or `yarn dev` within the server directory and make your request to http://localhost:4000. 

As they are running on different ports, you can run both at the same time by running `yarn dev` on the root directory as a shortcut. 


## Deployment
1. Build the client app: `yarn build:client`
2. Run the server to make sure the home page is serving the client app: `yarn start:dev:server` and go to localhost:4000
3. Deploy server
