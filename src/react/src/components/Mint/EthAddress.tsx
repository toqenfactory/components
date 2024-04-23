import React, { FC, useEffect, useRef, useState } from 'react';

import { EthAddressInputProps } from '../types';

import IconIconEdit from '../Icons/IconIconEdit';

const EthAddressInput: FC<EthAddressInputProps> = ({
  initialAddress,
  defaultText,
  handler,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState(initialAddress);
  const inputRef = useRef<HTMLInputElement>(null);

  const shortenAddress = (addr: `0x${string}` | undefined) =>
    addr
      ? `${addr.substring(0, 5)}..${addr.substring(addr.length - 4)}`
      : `edit`;

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value as `0x${string}`);
  };

  const finalizeEditing = () => {
    setIsEditing(false);
    handler(address);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        finalizeEditing();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [address]);

  return (
    <div
      className="flex w-full items-center justify-end"
      onClick={() => !isEditing && setIsEditing(true)}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          value={address}
          onChange={handleAddressChange}
          onBlur={finalizeEditing}
          autoFocus
          className="w-full rounded-sm bg-transparent px-1 font-mono text-xs focus:outline focus:outline-slate-300 dark:focus:outline-slate-700"
          spellCheck={false}
        />
      ) : (
        <div className="flex items-center justify-end">
          <span className="text-xs text-slate-500">
            {defaultText ?? (
              <span className="block translate-y-[1px] font-mono">
                {shortenAddress(address)}
              </span>
            )}
          </span>
          <IconIconEdit className="ml-2 w-4 text-slate-500 hover:scale-110 hover:cursor-pointer hover:text-slate-300" />
        </div>
      )}
    </div>
  );
};

export default EthAddressInput;
