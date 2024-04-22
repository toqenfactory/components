import React, { useState, useRef, useEffect, FC } from "react";

import { EthAddressInputProps } from "../types";

import IconIconEdit from "../Icons/IconIconEdit";

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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [address]);

  return (
    <div
      className="w-full flex justify-end items-center"
      onClick={() => !isEditing && setIsEditing(true)}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          value={address}
          onChange={handleAddressChange}
          onBlur={finalizeEditing}
          autoFocus
          className="w-full text-xs rounded-sm px-1 font-mono bg-transparent focus:outline focus:outline-slate-300 dark:focus:outline-slate-700"
          spellCheck={false}
        />
      ) : (
        <div className="flex justify-end items-center">
          <span className="text-slate-400 text-xs">
            {defaultText ?? (
              <span className="block font-mono translate-y-[1px]">
                {shortenAddress(address)}
              </span>
            )}
          </span>
          <IconIconEdit className="w-4 ml-2 hover:cursor-pointer hover:text-slate-500 text-slate-400" />
        </div>
      )}
    </div>
  );
};

export default EthAddressInput;
