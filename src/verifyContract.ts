import axios from "axios";

import { GET_NFTS_FIO_ADDRESS_URL, GET_NFTS_CONTRACT_URL, SAFELIST_API_URL } from "./config";
import {
  SmartContractStatus,
  GetNFTsFIOAddressRequestPayload,
  GetNFTsFIOAddressResponse,
  GetNFTsFIOAddressResponseSuccess,
  GetNFTsContractRequestPayload,
  GetNFTsContractResponse,
  GetNFTsContractResponseSuccess,
  SafelistResponse,
} from "./types";
import { FIOHandles } from "./data";

function getNFTsFIOAddressRequest(FIOAddress: string) {
  return axios.request<GetNFTsFIOAddressRequestPayload, { data: GetNFTsFIOAddressResponse }>({
    method: "POST",
    url: GET_NFTS_FIO_ADDRESS_URL,
    data: {
      fio_address: FIOAddress,
    },
    timeout: 5e3,
  });
}

function getNFTsContractRequest(contractAddress: string, chainCode: string) {
  return axios.request<GetNFTsContractRequestPayload, { data: GetNFTsContractResponse }>({
    method: "POST",
    url: GET_NFTS_CONTRACT_URL,
    data: {
      chain_code: chainCode,
      contract_address: contractAddress,
    },
    timeout: 5e3,
  });
}

function getSafelistRequest(contractAddress: string) {
  return axios.request<unknown, { data: SafelistResponse }>({
    method: "GET",
    baseURL: SAFELIST_API_URL,
    url: contractAddress,
    timeout: 5e3,
  });
}
/**
 * Verify contract address whether it is `"white"`, `"yellow"`, `"red"`, `"black"` or `null`
 *
 * @async
 * @function verifyContract
 * @param {string} contractAddress - contract address to check
 * @param {string} [chainCode="ETH"] - contract chain code
 * @returns {Promise<SmartContractStatus>} resulting contract status
 */
export async function verifyContract(contractAddress: string, chainCode = "ETH"): Promise<SmartContractStatus | null> {
  try {
    const responses = await Promise.allSettled([
      ...FIOHandles.map(getNFTsFIOAddressRequest),
      getNFTsContractRequest(contractAddress, chainCode),
    ]);

    let fioAddress: string | null = null;
    let contractStatus: string | null = null;

    // Loop through first 4 handles results and check whether contract exist in any of the `nfts[]`
    for (let index = 0; index < FIOHandles.length - 1; index += 1) {
      const handle = FIOHandles[index];
      const result = responses[index];

      if (result.status === "fulfilled" && "nfts" in result.value.data) {
        const lookupIndex = (result.value.data as GetNFTsFIOAddressResponseSuccess).nfts.findIndex(
          NFTSignature => NFTSignature.contract_address.toLowerCase() === contractAddress.toLowerCase(),
        );

        if (lookupIndex !== -1) {
          fioAddress = handle;

          break;
        }
      }
    }

    // If contract doesn't exist in any of the handles, try to check whether it is still in some list
    if (!fioAddress) {
      const mapped = responses[responses.length - 1];

      if (mapped.status === "fulfilled" && "nfts" in mapped.value.data) {
        const lookupValue = (mapped.value.data as GetNFTsContractResponseSuccess).nfts.find(
          NFTSignature => NFTSignature.contract_address.toLowerCase() === contractAddress.toLowerCase(),
        );

        if (lookupValue) {
          fioAddress = lookupValue.fio_address;
        }
      }
    }

    if (fioAddress && fioAddress.indexOf("list@aurox") !== -1) {
      return fioAddress.replace(new RegExp("list@aurox", "gmi"), "").toLowerCase() as SmartContractStatus;
    }

    // Request safelist if contract is not found using all FIO handles
    if (!fioAddress) {
      const safeListResponse = await getSafelistRequest(contractAddress);

      if (safeListResponse.data.status) {
        contractStatus = safeListResponse.data.status;
      }
    }

    if (contractStatus) {
      return contractStatus.toLowerCase() as SmartContractStatus;
    }

    return null;
  } catch (error) {
    return null;
  }
}
