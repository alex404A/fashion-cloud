# Fashion Cloud Tech Challenge

## Introduction

Your task is to build a REST API that exposes methods to interact with a cache that you will
build. You will have to use Node.js and Express.js to build the API and MongoDB to store the
cache data in. The cache does not have another data source in the background that is cached.
All data returned by the cache is random dummy data. You do not need to build a frontend.
The API shall be used with tools like curl or Postman.
Following features have to be implemented for the cache:

### Api

#### Add an endpoint that returns the cached data for a given key

If the key is not found in the cache:
- Log an output “Cache miss”
- Create a random string
- Update the cache with this random string
- Return the random string

If the key is found in the cache:
- Log an output “Cache hit”
- Get the data for this key
- Return the data

#### Add an endpoint that returns all stored keys in the cache
#### Add an endpoint that updates the data for a given key
#### Add an endpoint that removes a given key from the cache
#### Add an endpoint that removes all keys from the cache

### Requirement

Following additional features have to be also included:
- The number of entries allowed in the cache is limited. If the maximum amount of
cached items is reached, some old entry needs to be overwritten (Please explain the
approach of what is overwritten in the comments of the source code)
- Every cached item has a Time To Live (TTL). If the TTL is exceeded, the cached data will
not be used as it has expired. If you should request expired keys again, a new random
value will then be generated (just like cache miss). The TTL will be reset on every
read/cache hit

## Implementation

- **src/index.js** is the entry of the application
- **src/dao** is dao layer, in which all interaction with mongodb is implemented
- **src/route** is service layer, in which all business logic is implemented
- **src/exception** contains customized exception
- **src/model** contains data model
- **src/utils** contains all utils
- **test** contains test code
- **.development.env.sh** all configuration for development env
- **.test.env.sh** all configuration for test env
- **.init.sh** all configuration for test env

TTL is implemented by mongodb built-in ttl function, make sure initialize mongodb properly before exploring

In fact, unit test should be implemented on service handler, if two conditions below can be statisfied...

- enough time
- mock db interface

## Installation

```bash
npm install
```

## Before Start

Make sure mongodb shell is installed properly before you move forward, you can refer [official guide](https://docs.mongodb.com/manual/mongo/) to install

```bash
mongo --host ${MONGODB_HOST} --port ${MONGODB_PORT} -u ${MONGODB_USERNAME} -p${MONGODB_PASSWORD} --authenticationDatabase ${MONGODB_AUTHDB}
use ${MONGODB_DB};
db.createCollection('cache');
db.cache.createIndex( { "updateTime": 1 }, { expireAfterSeconds: 10000 } );
db.cache.createIndex( { "key": 1 }, { unique: true } );
```

## Quick Start

start express server(development is default env)
```bash
npm run start
```

start integration test(test is default env)
```bash
npm run test
```