# super-exchange
An easy, reliable, and secure currency exchange REST API that makes currency exchange flexible, stressless and autonomous.


## Getting Started
This is a currency exchange e-commerce RESTful API written fully in typescript. You can view on Docs here.

## Overview
Over decades, they have been some level of rigidness in currency exchange channel available to individuals. Most people make use of the financial institutions to establish this exchange. Can there be a more flexible exchange channel? What would one do when countries like Nigeria bans the financial institutions from currency exchange? Do I have to risk myself to meet people I don't trust for the exchange?

All these problems were observed and necessitates for the development of a more secure and functional platform that makes the currency exchange process seamless experience.

The application allows two types of users to register, regular users and merchant. A merchant can only own a store and stuck it with many items - currencies with different exchange rates. Regular users can order for an item (the order fails with the user didn't have enough in the wallet, then advised to fund wallet and retry the order). 

After orders are placed, the store owner can get all orders and decide on accepting the orders. Upon accepting the order, both wallets are debited and credited accordingly. 


## Philosophy Implored
I believe philosophy (styles) are very essential during software development.

#### Friendly and informative error message:
When users send a request that is not well formatted, missing or invalid, an appropriate status code with error message is thrown to enable the user to easily navigate to the source of problem. 

#### Separation of concerns:
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

#### Clone the Repo
git clone git@github.com:Abu-Abdillah1/super-exchange.git

#### Install dependencies
npm install

#### Build project
npm run build


## Endpoints
Click here to view all available endpoints from the documentation.



