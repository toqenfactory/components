import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import {
  useAccount,
  useBalance,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';

import { IAddress, IMint, IStatus } from '../types';

import { abi } from './utils';

import ActionButton from '../ActionButton';
import IconArrowDown from '../Icons/IconArrowDown';
import IconInfo from '../Icons/IconInfoOutline';
import IconRepeat from '../Icons/IconRepeat';
import EthAddressInput from './EthAddress';

const truncateToDecimals = (num: bigint | undefined, dec = 3) => {
  const numParts = formatUnits(num ?? 0n, 18)
    .toString()
    .split('.');
  if (numParts.length < 2) {
    return formatUnits(num ?? 0n, 18).toString();
  }
  const decimalPart = numParts[1].substring(0, dec);
  return `${numParts[0]}.${decimalPart}`;
};

const calculateTokenAmountFromEth = (
  eth: string,
  tokenPrice: bigint
): string => {
  if (!eth || tokenPrice <= 0n) return '0';
  const ethAmountInWei = parseUnits(eth, 18);
  const tokenAmount = (ethAmountInWei * 10n ** 18n) / tokenPrice;
  return formatUnits(tokenAmount, 18);
};

const calculateEthAmountFromToken = (
  amount: string,
  tokenPrice: bigint
): string => {
  if (!amount || tokenPrice <= 0n) return '0';
  const tokenAmount = parseUnits(amount, 18);
  const ethAmountInWei = (tokenAmount * tokenPrice) / 10n ** 18n;
  return formatUnits(ethAmountInWei, 18);
};

const useContracts = (address: IAddress, receiver: IAddress) => {
  return useMemo(
    () => [
      { address, abi, functionName: 'maxSupply' },
      { address, abi, functionName: 'tokenPrice' },
      { address, abi, functionName: 'totalSupply' },
      { address, abi, functionName: 'symbol' },
      { address, abi, functionName: 'balanceOf', args: [receiver] },
    ],
    [address]
  ) as any;
};

const MintERC20 = ({ address, handle }: IMint) => {
  const { address: accountAddress } = useAccount();
  const { data: balance } = useBalance({ address: accountAddress });

  const functionName = 'mint';

  const [receiver, setReceiver] = useState(accountAddress);
  const [status, setStatus] = useState<IStatus>('idle');
  const [args, setArgs] = useState<[`0x${string}`, bigint]>();
  const [amount, setAmount] = useState<string | undefined>();
  const [ethAmount, setEthAmount] = useState<string | undefined>();

  const contracts = useContracts(address, receiver);
  const query = { enabled: !!address && !!receiver };

  const { writeContract, status: offChain, data: hash } = useWriteContract();
  const { status: onChain } = useWaitForTransactionReceipt({ hash });
  const { data, refetch } = useReadContracts({ contracts, query });

  const maxSupply = useMemo(() => {
    return data?.[0]?.result as bigint | undefined;
  }, [data]);
  const tokenPrice = useMemo(() => {
    return data?.[1]?.result as bigint | undefined;
  }, [data]);
  const totalSupply = useMemo(() => {
    return data?.[2]?.result as bigint | undefined;
  }, [data]);
  const symbol = useMemo(() => {
    return data?.[3]?.result as string | undefined;
  }, [data]);
  const balanceOf = useMemo(() => {
    return data?.[4]?.result as bigint | undefined;
  }, [data]);

  const soldOut = useMemo(
    () => (totalSupply ?? 0n) >= (maxSupply ?? 0n),
    [totalSupply, maxSupply]
  );

  useEffect(() => {
    const data = undefined;

    if (offChain === 'error' || onChain === 'error') {
      handle({ data, hash, status: 'error' });
      setStatus('error');
    }
    if (onChain === 'pending') {
      if (offChain === 'idle') {
        handle({ data, hash, status: 'idle' });
        setStatus('idle');
      } else if (offChain === 'pending') {
        handle({ data, hash, status: 'wallet' });
        setStatus('wallet');
      } else if (offChain === 'success') {
        handle({ data, hash, status: 'pending' });
        setStatus('pending');
      }
    }
    if (onChain === 'success') {
      handle({ data: amount ? [amount] : undefined, hash, status: 'success' });
      setStatus('success');
      setAmount(undefined);
      setEthAmount(undefined);
      refetch();
      setTimeout(() => {
        setStatus('idle');
      }, 10_000);
    }
  }, [hash, offChain, onChain]);

  useEffect(() => {
    if (receiver === undefined || amount === undefined) return;

    setArgs([receiver, parseUnits(amount, 18)]);
  }, [receiver, amount]);

  const handleMint = useCallback(() => {
    if (!address || !ethAmount) return;
    const value = parseUnits(ethAmount, 18);
    writeContract({ abi, address, functionName, args, value });

    console.log('args', args, value);
  }, [address, functionName, args, ethAmount]);

  const handleAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (
        tokenPrice === undefined ||
        totalSupply === undefined ||
        maxSupply === undefined ||
        totalSupply >= maxSupply
      )
        return;

      let input = e.currentTarget.value.replace(/[^0-9\.]/g, '');
      if (!input) {
        setAmount(undefined);
        setEthAmount(undefined);
      }

      const availableSupply = maxSupply - totalSupply;
      const [whole, fraction = ''] = input.split('.');
      let amount = whole + '.' + fraction.padEnd(18, '0').slice(0, 18);

      if (parseUnits(amount, 18) > availableSupply) {
        amount = formatUnits(availableSupply, 18);
        input = amount;
      }

      const eth = calculateEthAmountFromToken(amount, tokenPrice);

      setEthAmount(eth);
      setAmount(input);
    },
    [amount, tokenPrice, totalSupply, maxSupply]
  );

  const handleEth = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (
        tokenPrice === undefined ||
        totalSupply === undefined ||
        maxSupply === undefined ||
        totalSupply >= maxSupply ||
        tokenPrice <= 0n
      )
        return;

      let input = e.currentTarget.value.replace(/[^0-9\.]/g, '');
      if (!input) {
        setAmount(undefined);
        setEthAmount(undefined);
      }

      const availableSupply = maxSupply - totalSupply;
      const [whole, fraction = ''] = input.split('.');
      const eth = whole + '.' + fraction.padEnd(18, '0').slice(0, 18);
      let amount = calculateTokenAmountFromEth(eth, tokenPrice);

      if (parseUnits(amount, 18) > availableSupply) {
        amount = formatUnits(availableSupply, 18);
        input = formatUnits((availableSupply * tokenPrice) / 10n ** 18n, 18);
      }

      setAmount(amount);
      setEthAmount(input);
    },
    [ethAmount, tokenPrice, totalSupply, maxSupply]
  );

  return (
    <div className="w-full">
      <div className="relative flex flex-col items-center justify-between gap-2 rounded-xl p-1">
        <div className="h-32 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 hover:dark:border-slate-600">
          <label htmlFor="you-pay" className="text-xs text-slate-500">
            <div className="flex w-full items-center justify-between">
              <div>You Pay</div>
            </div>
          </label>
          <div className="relative">
            <input
              type="text"
              id="you-pay"
              value={ethAmount ?? ''}
              onChange={handleEth}
              className="block w-full rounded-lg border-0 bg-slate-50 p-4 pl-0 pr-20 text-3xl font-extrabold text-slate-600 placeholder:text-slate-300 focus:outline-0 focus:ring-0 dark:border-slate-100 dark:bg-slate-800 dark:text-slate-50 dark:placeholder-slate-400"
              placeholder="0"
              required
              spellCheck={false}
            />
            <div className="shadow-xs absolute inset-y-0 right-0 top-4 h-9 rounded-lg bg-slate-100 px-4 py-2 text-sm font-extrabold text-slate-600 dark:bg-slate-900 dark:text-slate-50">
              {balance?.symbol}
            </div>
            <div className="text-right text-xs text-slate-500">
              <span className="mr-2 text-slate-300 dark:text-slate-600">
                Balance:
              </span>
              <span>{truncateToDecimals(balance?.value)}</span>
            </div>
          </div>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          {soldOut ? (
            <span className="h-10 w-10 rounded-xl border-2 border-white bg-slate-100 px-2 py-1 font-extrabold text-slate-500 dark:border-slate-700 dark:bg-slate-800">
              Sold Out
            </span>
          ) : (
            <IconArrowDown
              className={`${
                (status === 'wallet' || status === 'pending') &&
                `animate-bounce`
              } h-10 w-10 rounded-xl border-2 border-white bg-slate-100 px-2 py-1 font-extrabold text-slate-500 dark:border-slate-700 dark:bg-slate-800`}
            />
          )}
        </div>

        <div className="h-32 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 hover:dark:border-slate-600">
          <label htmlFor="you-receive" className="text-xs text-slate-500">
            <div className="flex w-full items-center justify-between">
              <div>You Receive</div>
              <div className="h-4 w-4 text-right text-slate-300 hover:text-slate-400 dark:text-slate-600 hover:dark:text-slate-700">
                <a
                  href={`https://etherscan.io/address/${address}`}
                  target="_blank"
                  title={`Token ${symbol} Info [ ${address} ]`}
                >
                  <IconInfo />
                </a>
              </div>
            </div>
          </label>
          <div className="relative">
            <input
              type="text"
              id="you-receive"
              value={amount ?? ''}
              onChange={handleAmount}
              className="block w-full rounded-lg border-0 bg-slate-50 p-4 pl-0 pr-20 text-3xl font-extrabold text-slate-600 placeholder:text-slate-300 focus:outline-0 focus:ring-0 dark:border-slate-100 dark:bg-slate-800 dark:text-slate-50 dark:placeholder-slate-400"
              placeholder="0"
              required
              spellCheck={false}
            />
            <div className="shadow-xs absolute inset-y-0 right-0 top-4 h-9 rounded-lg bg-slate-100 px-4 py-2 text-sm font-extrabold text-slate-600 dark:bg-slate-900 dark:text-slate-50">
              {symbol}
            </div>
            <div className="flex w-full items-center justify-between">
              <div className="relative flex items-center text-xs text-slate-500">
                <span className="mr-2 text-slate-300 dark:text-slate-600">
                  Receiver:
                </span>
                <EthAddressInput
                  initialAddress={receiver}
                  defaultText={
                    accountAddress === receiver
                      ? `You will receive tokens`
                      : undefined
                  }
                  handler={addr => setReceiver(addr)}
                />
              </div>
              <div className="text-right text-xs text-slate-500">
                <span className="mr-2 text-slate-300 dark:text-slate-600">
                  Balance:
                </span>
                <span>{truncateToDecimals(balanceOf)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {!soldOut && (
        <div className="mt-2">
          <ActionButton
            defaultText={`Swap`}
            successText={`Done`}
            defaultIcon={<IconRepeat />}
            status={status}
            onClick={() => handleMint()}
          />
        </div>
      )}
    </div>
  );
};

export default MintERC20;
