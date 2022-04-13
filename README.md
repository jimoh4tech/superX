# super-exchange
An easy, reliable, and secure currency exchange REST API that makes currency exchange flexible, stressless and autonomous.

**API** built with Node + Express + TypeScript + MongoDB + Jest

## You can find the complete API documentation on [Postman](https://documenter.getpostman.com/view/15084009/UVyyrsGW)
## You can check out the deployed application on [heroku](https://super-exchange-backend.herokuapp.com/)

## Overview
Over decades, they have been some level of rigidness in currency exchange channel available to individuals. Most people make use of the financial institutions to establish this exchange. Can there be a more flexible exchange channel? What would one do when countries like Nigeria bans the financial institutions from currency exchange? Do I have to risk myself to meet people I don't trust for the exchange?

All these problems were observed and necessitates for the development of a more secure and functional platform that makes the currency exchange process seamless experience.

The application allows two types of users to register, regular users and merchant. A merchant can only own a store and stuck it with many items - currencies with different exchange rates. Regular users can order for an item (the order fails with the user didn't have enough in the wallet, then advised to fund wallet and retry the order). 

After orders are placed, the store owner can get all orders and decide on accepting the orders. Upon accepting the order, both wallets are debited and credited accordingly.

## HTTP Status Codes
HTTP status codes was used to indicate success or failure of a request

### Success codes
- 200 OK - Request succeeded. Response included in JSON 
- 201 Created - Resource created. Response included in JSON 
- 204 No Content - Request succeeded, but no response body

### Error codes
- 400 Bad Request - Could not parse request. Response with appropriate error message
- 401 Unauthorized - No authentication credentials provided or authentication failed
- 403 Forbidden - Authenticated user does not have access
- 404 Not Found - Resource not found. If you hit an endpoint that is not available
- 500, 501, 502, 503, etc - An internal server error occured


## Philosophy Implored

#### Friendly and informative error message
When users send a request that is not well formatted, missing or invalid, an appropriate status code with error message is thrown to enable the user to easily navigate to the source of problem. 

#### Separation of concerns
This style as been gaining fame in the backend development world. It allows other programmers to easily interact with the code with little amount of time and effort, making them free of the fear  of breaking the application.


#### TypeScript
A very interesting question type might be asked is why typescript could be a philosophy. JavaScript is a very popular programming language characterized with easy to learn and use. Thus, there’s always a price to pay for that – runtime error and complexity in making changes.

#### Versioning
Versioning API is among the best practices that a backend engineer should pick up during development 

#### Linting
A careful coding style with appropriate linting is very import for good software


## Architecture
During the development of the application, the modular architectural pattern was used to structure the code.


## How to use project
- Clone repo `git@github.com:Abu-Abdillah1/super-exchange.git`
- Install NPM modules `npm install`
- Build project `npm run build`
 


## Core Structure
    super-exchange
      ├── .github
      ├── @types
      ├── src 
      │   ├── auth
      │   │   ├── auth.controller.ts
      │   │   ├── auth.middleware.ts
      │   │   ├── auth.router.ts
      │   │   └── auth.util.ts
      │   │ 
      │   ├── error
      │   │   ├── error.middleware.ts
      │   │   ├── http-exception.ts
      │   │   └── not-found.middleware.ts
      │   │
      │   ├── items
      │   │   ├── items.controller.ts
      │   │   ├── items.interface.ts
      │   │   ├── items.model.ts
      │   │   ├── items.router.ts
      │   │   ├── items.test.ts
      │   │   └── items.util.ts
      │   │
      │   ├── orders
      │   │   ├── orders.controller.ts
      │   │   ├── orders.interface.ts
      │   │   ├── orders.model.ts
      │   │   ├── orders.router.ts
      │   │   ├── orders.test.ts
      │   │   └── orders.util.ts
      │   │
      │   ├── reviews
      │   │   ├── reviews.controller.ts
      │   │   ├── reviews.interface.ts
      │   │   ├── reviews.model.ts
      │   │   ├── reviews.router.ts
      │   │   ├── reviews.test.ts
      │   │   └── reviews.util.ts
      │   │
      │   ├── stores
      │   │   ├── stores.controller.ts
      │   │   ├── stores.interface.ts
      │   │   ├── stores.model.ts
      │   │   ├── stores.router.ts
      │   │   ├── stores.test.ts
      │   │   └── stores.util.ts
      │   │
      │   ├── users
      │   │   ├── users.controller.ts
      │   │   ├── users.interface.ts
      │   │   ├── users.model.ts
      │   │   ├── users.router.ts
      │   │   ├── users.test.ts
      │   │   └── users.util.ts
      │   │
      │   ├── wallets
      │   │   ├── wallets.controller.ts
      │   │   ├── wallets.interface.ts
      │   │   ├── wallets.model.ts
      │   │   ├── wallets.router.ts
      │   │   ├── wallets.test.ts
      │   │   └── wallets.util.ts
      │   │
      │   ├── app.ts
      │   ├── dbConnections.ts
      │   └── index.ts
      │
      ├── .env
      ├── .eslintignore
      ├── .eslintrc
      ├── .gitignore
      ├── jest.config.js
      ├── package-lock.json
      ├── package.json
      ├── README.md
      └── tsconfig.json

## Author
Abu Abdillah olamide14044@gmail.com

Copyright (c) 2022 Abu Abdillah https://github.com/Abu-Abdillah1/

