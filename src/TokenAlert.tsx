// src/TokenAlert.tsx
import { gql, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FiCopy } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GET_NEW_TOKEN = gql`
  {
    tokenCreateds(first: 1, orderBy: blockNumber, orderDirection: desc) {
      id
      tokenAddress
      creator
      blockNumber
    }
  }
`;

interface Token {
  id: string;
  tokenAddress: string;
  creator: string;
  blockNumber: string;
}

interface TokenCreatedData {
  tokenCreateds: Token[];
}

const TokenAlert: React.FC = () => {
  const { data, loading, error } = useQuery<TokenCreatedData>(GET_NEW_TOKEN, {
    pollInterval: 60000,
  });

  useEffect(() => {
    if (data && data.tokenCreateds.length > 0) {
      const token = data.tokenCreateds[0];

      toast.info(
        <div className="my-4">
          <div className="flex gap-2 items-center justify-between">
            <strong>Token: </strong>
            <span className="text-xs text-gray-600 flex gap-2">
              {token.tokenAddress.slice(0, 20)}...{" "}
              <CopyToClipboard text={token.tokenAddress}>
                <FiCopy className="ml-2 cursor-pointer text-blue-500 hover:text-blue-700 active:text-blue-900" />
              </CopyToClipboard>
            </span>
          </div>
          <div className="flex gap-2 items-center justify-between">
            <strong>Creator: </strong>
            <span className="text-xs text-gray-600 flex gap-2">
              {token.creator.slice(0, 20)}...{" "}
              <CopyToClipboard text={token.creator}>
                <FiCopy className="ml-2 cursor-pointer text-blue-500 hover:text-blue-700 active:text-blue-900" />
              </CopyToClipboard>
            </span>
          </div>
          <div className="flex gap-2 items-center justify-between">
            <strong>Block:</strong>
            <span className="text-xs text-gray-600">{token.blockNumber}</span>
          </div>
        </div>,
        {
          autoClose: 10000,
        }
      );
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return <ToastContainer position="bottom-right" />;
};

export default TokenAlert;
