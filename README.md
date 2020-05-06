# Fashion Cloud Tech Challenge

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
