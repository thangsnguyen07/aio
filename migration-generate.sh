#!/bin/bash

echo "Generate $1 service migration"

cd apps/api/$1

npx typeorm-ts-node-commonjs 
    / -d src/configs/typeorm.config.ts
    / migration:generate src/infrastructure/database/migrations/$2 
    /--pretty

npm run build


