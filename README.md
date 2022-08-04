# Aurox smart contract monitoring library

## Summary

This library queries the FIO blockchain to return all addresses belonging to major decentralized protocols. Aurox leverages [FIO's NFT signatures](https://fioprotocol.io/nft-signatures/) functionality to keep track of trustworthy contracts in a decentralized manner. 

The purpose of this library is to create a central, yet decentralized, point of contact to validate whether certain contracts are trustworthy or not. This same library is being utilized by the Aurox Wallet to warn and protect users when they are interacting with scam contracts. 

## Usage

```
import { verifyContract } from "@aurox/smart-contract-monitoring";

...

const contractAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const result = await verifyContract(contractAddress);

// result will be one of these: "white" | "yellow" | "red" | "black" | null

```
