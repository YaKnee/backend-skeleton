# Skeleton Backend

This is a skeleton backend API for whatever you need. The API is built with Express and MongoDB. The application supports CRUD operations and includes validation and authentication features to ensure data integrity and security.

# Installation / Setup
_Requires Node.js and your own MongoDB server and credentials. Instructions can be found here on how to setup your own: [Getting Started with MongoDB Atlas](https://www.youtube.com/watch?v=bBA9rUdqmgY)._

Go to the directory where you want to store this repository, then:
1. Define schema for items in [itemModel.js](models/itemModel.js).
2. Set validation criteria for items in [validateItem.js](middlewares/validateItem.js)
3. Change [getAllItems](https://github.com/YaKnee/backend-skeleton/blob/main/controllers/itemController.js#L6) function in [itemController.js](controllers/itemController.js) to match item scehma _or simply delete querying logic._
4. Open the project with your favourite IDE and install dependencies: `npm install`
5. Create a __.env__ file in the project folder with the following:
    - MongoDB server credentials: `MONGODB_URI = mongodb+srv://<username>:<password>@<cluster_name>.mongodb.net/<database_name>`
    - JSON Web Token secret (should be a strong, randomly generated key): `JWT_SECRET=<secret_key>`
    - Port number (optional): `PORT = 3000`

    _Replace values between __<>__ with your actual values._

6. Reset/Populate the database with default items: `node scripts/resetDB.js`
7. Start the project: `npm start`. This will use _nodemon_ for automatic updates and _morgan_ for logging during development.

# Docs

Only __admin__ users can `POST`, `PUT`, and `DELETE`, while all authenticated users (__regular__ and __admin__) can do `GET` requests.

## Structure
Each item must be structured as a JSON object in the following format:
```
{
    "name": "some name",
    // other self defined key-value pairs
}
```
An "__id__" property will be automatically generated and appended to the object.

## Rules for Item Properties
1. __Required Property__:
    - The only required property in `POST`/`PUT` requests is the "__name__" property.

## Authentication

Before making any item-related requests, ensure you have a valid token. Use the `/auth/login` endpoint with valid credentials to get a token.

__Register a User__:
```
POST http://localhost:3000/auth/register
Content-Type: application/json

{
    "username": "some_name",
    "password": "some_password",
    "role": "admin"
}
```
_**password** must be atleast 8 characters in length. Will be hashed with **bcrypt** before sending to database._

__Login as Admin__:
```
POST http://localhost:3000/auth/login
Content-Type: application/json

{
    "username": "some_name",
    "password": "some_password"
}
```

__Login Response Example__:
```
{
    "token": "<adminToken>"
}
```
_See [JWT Introduction](https://jwt.io/introduction) for how the token is generated._


## Example Requests

Example requests for `/items` endpoints.

### POST a New Item
To create a item, use a valid admin token in the `Authorization` header.

__Request__:
```
POST http://localhost:3000/items
Content-Type: application/json
Authorization: Bearer <adminToken>

{
    "name": "update schema",
    // other key-pairs
}
```

__Response__:
```
HTTP/1.1 201

message: "Item Added Successfully.",
newItem: {
    "id": [total items + 1],
    "name": "update schema",
    // other key-pairs
}
```

### GET Items
__Get All Items__:
```
GET http://localhost:3000/items
Authorization: Bearer <token>
```

__Get Items by ID__:
```
GET http://localhost:3000/items/1
Authorization: Bearer <token>
```

__Response__:
```
{
    "id": 1,
    "name": "update schema",
    // other key-pairs
}
```

### PUT (update) an Item

_Dependent on how you change item schema_.

### DELETE Item
__Delete by ID__:
```
DELETE http://localhost:3000/items/1
Authorization: Bearer <adminToken>
```

__Response__:
```
HTTP/1.1 204 No Content
```


# Libraries

Full list of libaries used for this project are:
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [dotenv](https://www.dotenv.org/docs/)
- [express](https://expressjs.com/en/4x/api.html)
- [joi](https://joi.dev/api/?v=17.13.3)
- [jsonwebtoken](https://jwt.io/introduction)
- [mongoose](https://mongoosejs.com/docs/index.html)
- [morgan](https://github.com/expressjs/morgan#readme)
- [nodemon](https://github.com/remy/nodemon)