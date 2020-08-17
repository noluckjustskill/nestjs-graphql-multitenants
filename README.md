# Multi-tenants graphql project with authorization (JWT)
## Single database, several schemes

A connection is created (if it is not in the pool) for each new host. It was intended to use TypeORM, but to begin mocked pseudo connection is used.  
See the comments in the code for the TypeORM integration.  

Ask questions in telegram [@noluck_justskill](https://t.me/noluck_justskill)

Project based on https://github.com/marcoesposito/nestjs-typeorm-multi-tenant