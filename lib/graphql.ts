import request, { gql } from "graphql-request";

import { getErrorMessage } from "./utils";

interface IChainInput {
  owner: string;
  ids?: string[];
  fields?: string[];
}

export interface CustomResponse<DataType> {
  data: DataType[];
  totalCount?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface gqlResponse<DataType> {
  totalCount: number;
  pageInfo?: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  nodes: DataType[];
}

export interface INft {
  nftId: string;
  owner: string;
  offchainData: string;
  isDelegated: boolean;
}

export const getNftsQuery = (input: IChainInput) => {
  return gql`
    {
      nftEntities(
        filter: {
          and: [
            {
              owner: { equalTo: "${input.owner}" }
            }
            { collectionId: { equalTo: "${process.env.NEXT_PUBLIC_COLLECTION_ID}" } }
            {
              and: [
                ${
                  input.ids
                    ? `{id: { in: [${input.ids
                        .map((x) => `"${x}"`)
                        .join(",")}] }}`
                    : ""
                }
              ]
            }
          ]
        }
        ) {
            totalCount
            pageInfo {
              hasNextPage
              hasPreviousPage
            }
            nodes {
              ${
                !input.fields
                  ? `
                  nftId
                  owner
                  offchainData
                  isDelegated
                `
                  : `${input.fields.join(" ")}`
              }
            }
          }
      }
    `;
};

export const getNfts = async (
  input: IChainInput,
): Promise<CustomResponse<INft>> => {
  try {
    const gqlQuery = getNftsQuery(input);
    const res = (
      await request<{ nftEntities: gqlResponse<INft> }>(
        process.env.NEXT_PUBLIC_INDEXER_URL!,
        gqlQuery,
      )
    ).nftEntities;
    const result: CustomResponse<INft> = {
      totalCount: res.totalCount,
      data: res.nodes,
      hasNextPage: res.pageInfo?.hasNextPage ?? false,
      hasPreviousPage: res.pageInfo?.hasPreviousPage ?? false,
    };
    return result;
  } catch (err) {
    const message = getErrorMessage(err);
    throw new Error(`NFTs could not have been fetched - Detail: ${message}`);
  }
};
