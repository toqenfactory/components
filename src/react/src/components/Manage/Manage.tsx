import { useEffect, useMemo, useState } from 'react';
import { RiTokenSwapLine } from 'react-icons/ri';
import { Address, formatEther } from 'viem';
import { useBalance, useReadContracts, useWriteContract } from 'wagmi';
import BaseComponent from '../BaseComponent';
import { abi } from './utils';

const Manage = ({ address, dark }: { address?: Address; dark?: boolean }) => {
  const [token, setToken] = useState<Address>();
  const [show, setShow] = useState<boolean>();

  useEffect(() => {
    if (!address) return;
    setToken(address);
    setShow(!!address);
  }, []);

  const balance = useBalance({
    address: token,
  });

  const { writeContract } = useWriteContract();

  const { data } = useReadContracts({
    contracts: [
      { address: token, abi, functionName: 'owner' },
      { address: token, abi, functionName: 'maxSupply' },
      { address: token, abi, functionName: 'totalSupply' },
      { address: token, abi, functionName: 'tokenPrice' },
      { address: token, abi, functionName: 'symbol' },
      { address: token, abi, functionName: 'baseURI' },
    ],
  });

  const [owner, maxSupply, totalSupply, tokenPrice, symbol, baseURI]: any =
    useMemo(() => (data ? data : []), [data]);

  const handleWithdraw = () => {
    if (!token) return;

    writeContract({
      abi,
      address: token,
      functionName: 'withdraw',
    });
  };

  return (
    <BaseComponent dark={dark}>
      {show ? (
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-center justify-between justify-items-center gap-2 text-pretty text-sm font-extrabold text-slate-500 dark:text-slate-400">
            <div className="text-xs">Token:</div> <div>{token}</div>
          </div>
          <div className="flex items-center justify-between justify-items-center text-pretty text-sm font-extrabold text-slate-500 dark:text-slate-400">
            <div className="text-xs">Owner:</div>
            {owner && <div>{owner.result}</div>}
          </div>
          <div className="flex items-center justify-between justify-items-center text-pretty text-sm font-extrabold text-slate-500 dark:text-slate-400">
            <div className="text-xs">Supply:</div>
            {maxSupply && (
              <div>
                {baseURI && baseURI.result
                  ? totalSupply.result || 0n
                  : formatEther(totalSupply.result || 0n)}{' '}
                /{' '}
                {baseURI && baseURI.result
                  ? maxSupply.result || 0n
                  : formatEther(maxSupply.result || 0n)}{' '}
                {maxSupply && symbol.result}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between justify-items-center text-pretty text-sm font-extrabold text-slate-500 dark:text-slate-400">
            <div className="text-xs">Token Price:</div>
            {tokenPrice && (
              <div>
                {formatEther(tokenPrice.result || 0n)} {balance.data?.symbol}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between justify-items-center gap-2 rounded-lg border-2 border-cyan-400 p-4 dark:border-cyan-800">
            <span>Cap:</span>{' '}
            <span className="font-extrabold text-emerald-500 dark:text-emerald-700">
              {formatEther(balance.data?.value ?? 0n)} {balance.data?.symbol}
            </span>
            <button className="btn" onClick={() => handleWithdraw()}>
              Withdraw <RiTokenSwapLine className="text-2xl" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center gap-2">
          <span className="text-xs">Token Address:</span>{' '}
          <input
            type="text"
            className="input input-info text-slate-500"
            placeholder="0x0..."
            value={token || ''}
            onChange={e => setToken(e.currentTarget.value.trim() as Address)}
          />
          <button className="btn" onClick={() => setShow(true)}>
            Manage
          </button>
        </div>
      )}
    </BaseComponent>
  );
};

export default Manage;
