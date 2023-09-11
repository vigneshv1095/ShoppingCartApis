<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>

<p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://paypal.me/kamilmysliwiec"><img src="https://img.shields.io/badge/Donate-PayPal-dc3d53.svg"/></a>
<a href="https://twitter.com/nestframework"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>

### 📚 Description

The shopping cart API is built using nestjs framework. Will list down the steps to bring up the service.
Adding both docker and non-docker way of running the service.
---

### 🛠️ Prerequisites

#### Non-Docker
- Please make sure mariaDB is installed and running on port 3306. [MariaDB guid](https://mariadb.com/get-started-with-mariadb/)

#### Docker 🐳
- Please make sure to have docker desktop setup on any preferred operating system to quickly compose the required dependencies. Then follow the docker procedure outlined below.
    [Docker guide](https://docs.docker.com/engine/install/#desktop)

---

### 🚀 Deployment
#### Manual Deployment without using Docker
- Make sure the env file (`.env`) in the repo is present. You might want to change the database host to localhost. 
  Since the provided value in the repo corresponds to the docker container name. `DB_HOST = localhost`

#### Deploying with Docker 🐳 (Recommended)

- Execute the following command in-app directory:

```bash
# creates and loads the docker container with required configuration
$ docker-compose up -d 
```
- The following command will set up and run the docker project for quick use. Then the web application, and MariaDB will be exposed to http://localhost:9002 and http://localhost:3306 respectively.
- The current docker setup doesn't support hot reloads. So everytime when there's a change in the code. You should build the image again.
```bash
# Builds and pushes the image to the respective containers.
$ docker-compose build 
```

#### Deploying without Docker

- Make sure npm and node are installed in your system. Use the below commands to verify if they're installed. 

```bash
npm -v
node -v
``` 
- If node/npm is not present, Please use this guide to set it up. [Node guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

- Once node and npm are installed. Install the dependencies using the command: ```npm install```
- Bring up the service using the command: 
```bash
npm run start:dev
```
- Please note the ```start:dev``` will bring up the service using nodemon for hot reloads on any change in the code.  
- To build and bring up the service use the below commands.
```bash
npm run build           //This will build the whole project
npm run start:prod      //This will load the service from compiled js files
```
---
### Tests 🐞

- Unit tests are written covering almost all the modules including auth guards and role guards. 
To run the whole test suite of the project. Simply run the below command.
```bash
npm run test
```

- The coverage report is also included in the project. To generate the report execute the below command. 
```bash
npm run test:cov
```
---
### API Requests 

- Tried setting up the swagger portal for API playground. But couldn't completely do it because of some setup issue.
You can still have a look here [Swagger](http://localhost:9002/api/docs)

#### Create a user (SignUp)
```POST api/v1/auth/signup```

```bash
curl --location 'localhost:9002/api/v1/auth/signup' \
--header 'Authorization: thisisadmin' \
--header 'Content-Type: application/json' \
--data '{
    "username" : "example",
    "password" : "sample1234"
}'
```
######Response
```bash
{
    "success": true,
    "data": {
        "username": "exampleadmin",
        "password": "$2b$10$kFUamzUoorZiJe.oGucTNu8yi5oqfaokfw2LQL/5ZgqUKT2hURQz6",
        "role": "admin",
        "id": 10,
        "suspended": false,
        "createdAt": "2023-09-11T06:31:04.070Z",
        "updatedAt": "2023-09-11T06:31:04.070Z"
    }
}
```
- Remove the Authorization header to create a new user. The above example will create an `admin`.
---
#### Sign in
```POST api/v1/auth/signin```
```bash
curl --location 'localhost:9002/api/v1/auth/signin' \
--header 'Content-Type: application/json' \
--data '{
    "username" : "exampleadmin",
    "password" : "sample1234"
}'
```

######Response
```bash
{
    "success": true,
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsInVzZXJuYW1lIjoiZXhhbXBsZWFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjk0NDE0MjA1LCJleHAiOjE2OTQ0MTQ1MDV9.ImBhIFJPJR2LKSCEs1zApKxWDSOXxus5CLRXfIHf_wY"
    }
}
```
- Pass on this accessToken for all the other APIs coming below.
---

#### Suspend User (Accessible only for admin role)

```POST api/v1/user/suspend```
```bash
curl --location 'localhost:9002/api/v1/user/suspend' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <AccessToken copied from signin>' \
--data '{
    "username" : "test1",
    "suspend" : true
}'
```
###### Response
```bash
{
    "success": true,
    "data": {
        "id": 2,
        "username": "test1",
        "suspended": true,
        "role": "user",
        "createdAt": "2023-09-09T09:30:55.461Z",
        "updatedAt": "2023-09-11T06:45:29.000Z"
    }
}
```
---
####Create an item (Accessible only for admin)

```POST ```
```bash
curl --location 'localhost:9002/api/v1/items/create' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <AccessToken copied from signin>' \
--data '{
    "name" : "book",
    "price" : 1000
}'
```
###### Response
```bash
{
    "success": true,
    "data": {
        "name": "book",
        "price": 1000,
        "inStock": true,
        "id": "2642ff1d-8155-4171-96ee-cc30a950d420",
        "createdAt": "2023-09-11T06:49:44.368Z",
        "updatedAt": "2023-09-11T06:49:44.368Z"
    }
}
```
---
#### Update stock
```PATCH api/v1/items/update_stock```
```bash
curl --location --request PATCH 'localhost:9002/api/v1/items/update_stock' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <AccessToken copied from signin>' \
--data '{
    "id" : "2642ff1d-8155-4171-96ee-cc30a950d420",
    "stock" : false
}'
```
###### Response
```bash
{
    "success": true,
    "data": {
        "id": "2642ff1d-8155-4171-96ee-cc30a950d420",
        "name": "book",
        "price": 1000,
        "inStock": false,
        "createdAt": "2023-09-11T06:49:44.368Z",
        "updatedAt": "2023-09-11T06:49:44.368Z"
    }
}
```
---
#### List all items (Accessible only by user)
```GET api/v1/items```
```bash
curl --location 'localhost:9002/api/v1/items' \
--header 'Authorization: Bearer <AccessToken copied from signin>'
```
###### Response
```bash
{
    "success": true,
    "data": [
        {
            "id": "2642ff1d-8155-4171-96ee-cc30a950d420",
            "name": "book",
            "price": 1000,
            "inStock": false,
            "createdAt": "2023-09-11T06:49:44.368Z",
            "updatedAt": "2023-09-11T06:49:44.368Z"
        }
    ]
}
```
---
#### Add to cart (Accessible only by user)
```POST api/v1/cart/add```
```bash
curl --location 'localhost:9002/api/v1/cart/add' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <AccessToken copied from signin>' \
--data '{
    "productId" : "c5fe7b09-d84b-4bdb-9fc8-0a53a80d976c"
}'
```
- productId can be copied from `List all items` API.
###### Response
```bash
{
    "success": true,
    "data": {
        "total": 2000,
        "quantity": 1,
        "user": {
            "id": 2,
            "username": "test1",
            "role": "user",
            "iat": 1694415553,
            "exp": 1694415853
        },
        "item": {
            "id": "c5fe7b09-d84b-4bdb-9fc8-0a53a80d976c",
            "name": "laptop",
            "price": 2000,
            "inStock": true,
            "createdAt": "2023-09-09T14:54:32.046Z",
            "updatedAt": "2023-09-09T14:54:32.046Z"
        },
        "id": "c98c1d0d-ad30-437e-b38b-79aa9d48d452"
    }
}
```
---
#### View cart (Accessible only by user)
```GET api/v1/cart```
```bash
curl --location 'localhost:9002/api/v1/cart' \
--header 'Authorization: Bearer <AccessToken copied from signin>'
```

###### Response
```bash
{
    "success": true,
    "data": [
        {
            "id": "c98c1d0d-ad30-437e-b38b-79aa9d48d452",
            "total": 2000,
            "quantity": 1,
            "item": {
                "id": "c5fe7b09-d84b-4bdb-9fc8-0a53a80d976c",
                "name": "laptop",
                "price": 2000,
                "inStock": true,
                "createdAt": "2023-09-09T14:54:32.046Z",
                "updatedAt": "2023-09-09T14:54:32.046Z"
            },
            "user": {
                "id": 2,
                "username": "test1",
                "suspended": false,
                "role": "user",
                "createdAt": "2023-09-09T09:30:55.461Z",
                "updatedAt": "2023-09-11T06:47:53.000Z"
            }
        }
    ]
}
```
---
#### Remove from cart (Accessible only by user)
```DELETE ```
```bash
curl --location --request DELETE 'localhost:9002/api/v1/cart/remove' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <AccessToken copied from signin>' \
--data '{
    "productId" : "c5fe7b09-d84b-4bdb-9fc8-0a53a80d976c"
}'
```
###### Response
```bash
{
    "success": true,
    "data": []
}
```
- Note that the data is empty since the current cart of this user is empty
---