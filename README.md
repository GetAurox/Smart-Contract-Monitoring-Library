# Aurox smart contract monitoring library

## Usage

```
import { verifyContract } from "@aurox/smart-contract-monitoring";

...

const contractAddress = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const result = await verifyContract(contractAddress);

// result will be one of these: "white" | "yellow" | "red" | "black" | null

```
