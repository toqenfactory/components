import React, { useState, useRef, useEffect, FC } from "react";
import IconBxEditAlt from "./icons/IconBxEditAlt";

interface EthAddressInputProps {
  initialAddress: `0x${string}` | undefined;
  handler: (newAddress: `0x${string}` | undefined) => void;
}

const EthAddressInput: FC<EthAddressInputProps> = ({
  initialAddress,
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
    <div onClick={() => !isEditing && setIsEditing(true)}>
      {isEditing ? (
        <input
          ref={inputRef}
          value={address}
          onChange={handleAddressChange}
          onBlur={finalizeEditing}
          autoFocus
          className="w-full text-xs rounded-sm pl-1 bg-transparent focus:outline focus:outline-slate-300 dark:focus:outline-slate-700"
          spellCheck={false}
        />
      ) : (
        <div className="flex">
          <span className="underline font-extrabold underline-offset-4 decoration-dashed">
            {shortenAddress(address)}
          </span>
          <IconBxEditAlt className="w-5 ml-2 hover:cursor-pointer hover:text-slate-500 text-slate-300" />
        </div>
      )}
    </div>
  );
};

export default EthAddressInput;
