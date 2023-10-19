#!/bin/bash

source .env

forge script script/PaymentScript.s.sol --broadcast --rpc-url ${GOERLI_RPC_URL} -vvv --verify

