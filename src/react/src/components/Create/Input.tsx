import { useMemo } from "react";

export const Input = ({
  label,
  placeholder,
  value,
  setValue,
}: {
  label: string;
  placeholder: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const id = useMemo(() => Math.random(), []);

  return (
    <div className="flex justify-center items-center gap-2 w-full">
      <div className="flex-1 text-right">
        <label htmlFor={`id-${id}`}>{label}</label>
      </div>
      <div className="flex-none">
        <input
          type="text"
          id={`id-${id}`}
          placeholder={placeholder}
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          className="p-2 rounded-xl"
        ></input>
      </div>
    </div>
  );
};
