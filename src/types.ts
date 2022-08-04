export type SmartContractStatus = "white" | "yellow" | "red" | "black";
export type FIOHandle = `${SmartContractStatus}list@aurox`;

type CommonRequestPayloadOptions = {
  /**
   * `>=0`
   *
   * Number of NFTs to return. If omitted, all matching NFTs will be returned.
   */
  limit?: number;
  /**
   * `>=0`
   *
   * First NFT from list to return. If omitted, 0 is assumed.
   */
  offset?: number;
};

type NFTSignature = {
  /** Chain code. */
  chain_code: string;
  /** Contract address. */
  contract_address: string;
  /** Token ID of NFT. */
  token_id: string;
  /** URL of NFT asset. */
  url: string;
  /** SHA-256 hash of NFT asset. */
  hash: string;
  /** JSON formatted metadata, including creator URL. */
  metadata: string;
};

/**
 * Get Signed NFTs for FIO Crypto Handle
 *
 * POST /get_nfts_fio_address
 *
 * Returns all NFTs for specified FIO Crypto Handle (aka FIO Address).
 * See FIP-27 (https://github.com/fioprotocol/fips/blob/master/fip-0027.md) for comprehensive description of this functionality.
 */
export type GetNFTsFIOAddressRequestPayload = {
  /**
   * (3 to 64 chars)
   * Pattern: ^(?:(?=.{3,64}$)[a-zA-Z0-9]{1}(?:(?!-{2,}))[a-zA-Z0-9-]*(?:(?<!-))@[a-zA-Z0-9]{1}(?:(?!-{2,}))[a-zA-Z0-9-]*(?:(?<!-))$)
   * FIO Crypto Handle (aka FIO Address) that signed the NFTs.
   */
  fio_address: string;
} & CommonRequestPayloadOptions;

export type GetNFTsFIOAddressResponseSuccess = {
  /** Multiple NFT Signatures may be returned. */
  nfts: NFTSignature[];
  /** 0 - no more results 1 - more results */
  more: number;
};

/**
 * HTTP code 400 is returned when request was malformed or contained improper values.
 * The response body will indicate the name of the incorrect field, its type, and the value the service received.
 *
 * Possible error messages:
 *
 * `"Invalid FIO Address"`
 * `"FIO Address does not exist"`
 * `"Invalid limit"`
 * `"Invalid offset"`
 */
export type GetNFTsFIOAddressResponseError = {
  type: string;
  message: string;
  fields: {
    name: string;
    value: string;
    error: string;
  }[];
};

/**
 * HTTP code 404 is returned when the requested information could not be found.
 *
 * Possible error messages:
 *
 * `"NFTs not found"`
 */
export type GetNFTsFIOAddressResponseNotFound = {
  message: string;
};

export type GetNFTsFIOAddressResponse =
  | GetNFTsFIOAddressResponseSuccess
  | GetNFTsFIOAddressResponseError
  | GetNFTsFIOAddressResponseNotFound;

/**
 * Get Signed NFTs for contract
 *
 * POST /get_nfts_contract
 *
 * Returns all mapped NFTs which have the specified contract address and (optional) token id.
 * See FIP-27 (https://github.com/fioprotocol/fips/blob/master/fip-0027.md) for comprehensive description of this functionality.
 */
export type GetNFTsContractRequestPayload = {
  /** Chain code where NFT contract resides */
  chain_code: string;
  /** NFT Contract Address */
  contract_address: string;
  /** NFT Token ID */
  token_id?: string;
} & CommonRequestPayloadOptions;

export type GetNFTsContractResponseSuccess = {
  /** Multiple NFT Signatures may be returned. */
  nfts: ({
    /** FIO address. */
    fio_address: string;
  } & NFTSignature)[];
  /** 0 - no more results 1 - more results */
  more: number;
};

/**
 * HTTP code 400 is returned when request was malformed or contained improper values.
 * The response body will indicate the name of the incorrect field, its type, and the value the service received.
 *
 * Possible error messages:
 *
 * `"Invalid Chain Code"`
 * `"Invalid Contract Address"`
 * `"Invalid Token ID"`
 * `"Invalid limit"`
 * `"Invalid offset"`
 */
export type GetNFTsContractResponseError = GetNFTsFIOAddressResponseError;

/**
 * HTTP code 404 is returned when the requested information could not be found.
 *
 * Possible error messages:
 *
 * `"NFTs not found"`
 */
export type GetNFTsContractResponseNotFound = GetNFTsFIOAddressResponseNotFound;

export type GetNFTsContractResponse = GetNFTsContractResponseSuccess | GetNFTsContractResponseError | GetNFTsContractResponseNotFound;

export type SafelistResponse = {
  status: SmartContractStatus;
};
