#!/bin/bash

protoc --plugin=node_modules/.bin/protoc-gen-ts_proto \
 --ts_proto_out=./proto-temp \
 --ts_proto_opt=nestJs=true \
 proto/*.proto