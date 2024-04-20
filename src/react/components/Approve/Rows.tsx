import { useEnsName } from "wagmi";

import { IInfo, INft, ISpender, IToken } from "./IApprove";

import IconDollarSign from "./icons/IconDollarSign";
import IconImage from "./icons/IconImage";
import IconShield from "./icons/IconShield";
import IconShieldOff from "./icons/IconShieldOff";
import IconLayers from "./icons/IconLayers";
import IconUser from "./icons/IconUser";

export const Nft = ({ metadata }: INft) => {
  return (
    metadata?.image && (
      <div className="flex justify-center items-center rounded-xl overflow-hidden w-full h-full">
        <img
          src={metadata.image}
          className="w-24 h-24 object-cover rounded-xl"
          alt={metadata.name}
        ></img>
      </div>
    )
  );
};

export const Info = ({ isApproved, tokenId, value, symbol }: IInfo) => {
  return (
    <div className="flex justify-between items-center">
      {!tokenId && !value && !symbol && (
        <div className="flex">
          <span className="w-6 h-6 mx-1">
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
          <span className="w-6 h-6 mx-1">
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
          <span className="w-6 h-6 mx-1">
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
      {isApproved && (
        <div className="flex justify-center items-center bg-slate-50 text-slate-800 dark:bg-slate-800 dark:text-slate-50 rounded-md px-2 py-1 mx-1">
          <IconShieldOff className="w-4 mr-2" /> Approved
        </div>
      )}
      {!isApproved && (
        <div className="flex justify-center items-center bg-slate-50 text-slate-800 dark:bg-slate-800 dark:text-slate-50 rounded-md px-2 py-1 mx-1">
          <IconShield className="w-4 mr-2" /> Not Approved
        </div>
      )}
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
        <span className="w-6 h-6 mx-1">
          <IconLayers />
        </span>
        <span className="text-xs">{title}</span>
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

export const Spender = ({ addr }: ISpender) => {
  const { data: ens } = useEnsName({
    address: addr,
    query: { enabled: !!addr },
  });

  return (
    <div className="flex justify-between items-center">
      <div className="flex justify-between items-center">
        <span className="w-6 h-6 mx-1">
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
