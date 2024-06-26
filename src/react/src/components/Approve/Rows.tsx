import { useEnsName } from "wagmi";

import { IInfo, ISpender, IToken } from "../types";

import IconDollarSign from "../Icons/IconDollarSign";
import IconImage from "../Icons/IconImage";
import IconShield from "../Icons/IconShield";
import IconShieldOff from "../Icons/IconShieldOff";
import IconLayers from "../Icons/IconLayers";
import IconUser from "../Icons/IconUser";

export const Info = ({ isApprove, tokenId, value, symbol }: IInfo) => {
  return (
    <div className="flex justify-between items-center">
      {!tokenId && !value && (
        <div className="flex">
          <span className="w-6 h-6 mr-1 text-slate-400 dark:text-slate-500">
            <IconImage />
          </span>
          <span className="text-slate-950 dark:text-slate-50 font-extrabold mx-1">
            ALL
          </span>
          NFTs
        </div>
      )}
      {tokenId && !value && (
        <div className="flex">
          <span className="w-6 h-6 mr-1 text-slate-400 dark:text-slate-500">
            <IconImage />
          </span>
          <span className="text-slate-950 dark:text-slate-50 font-extrabold mx-1">
            ID#{tokenId}
          </span>
          NFT
        </div>
      )}
      {!tokenId && value && symbol && (
        <div className="flex">
          <span className="w-6 h-6 mr-1 text-slate-400 dark:text-slate-500">
            <IconDollarSign />
          </span>
          <span className="text-slate-950 dark:text-slate-50 font-extrabold mx-1">
            {value}
          </span>
          <span className="bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-slate-50 rounded-md px-2 mx-1">
            {symbol}
          </span>
        </div>
      )}
      <div className="flex justify-center items-center bg-slate-50 text-slate-800 dark:bg-slate-800 dark:text-slate-50 rounded-md px-2 ml-1">
        {isApprove !== undefined && isApprove && (
          <>
            <IconShieldOff className="w-4 mr-2" /> Approved
          </>
        )}
        {isApprove !== undefined && !isApprove && (
          <>
            <IconShield className="w-4 mr-2" /> Not Approved
          </>
        )}
      </div>
    </div>
  );
};

export const Token = ({ addr, title }: IToken) => {
  const { data: ens } = useEnsName({
    address: addr,
    query: { enabled: !!addr },
  });

  return (
    <div className="flex justify-between items-center">
      <div className="flex justify-between items-center">
        <span className="w-6 h-6 mr-1 text-slate-400 dark:text-slate-500">
          <IconLayers />
        </span>
        <span className="text-xs">{title}</span>
      </div>
      <div className="flex justify-between items-center">
        {addr && (
          <span className="text-xs underline underline-offset-4 decoration-dotted font-mono font-extrabold text-slate-400 mx-1">
            <a href={`https://etherscan.io/address/${addr}`} target="_blank">
              {ens
                ? ens
                : addr && addr.length > 10
                ? `${addr.substring(0, 5)}..${addr.substring(addr.length - 5)}`
                : addr}
            </a>
          </span>
        )}
      </div>
    </div>
  );
};

export const Spender = ({ addr }: ISpender) => {
  const { data: ens } = useEnsName({
    address: addr,
    query: { enabled: !!addr },
  });

  return (
    <div className="flex justify-between items-center">
      <div className="flex justify-between items-center">
        <span className="w-6 h-6 mr-1 text-slate-400 dark:text-slate-500">
          <IconUser />
        </span>
        <span className="text-xs">Spender</span>
      </div>
      <div className="flex justify-between items-center">
        {addr && (
          <span className="text-xs font-extrabold text-slate-400 mx-1">
            <a
              href={`https://etherscan.io/address/${addr}`}
              target="_blank"
              className="underline underline-offset-4 decoration-dotted font-mono"
            >
              {ens
                ? ens
                : addr && addr.length > 10
                ? `${addr.substring(0, 5)}..${addr.substring(addr.length - 5)}`
                : addr}
            </a>
          </span>
        )}
      </div>
    </div>
  );
};
