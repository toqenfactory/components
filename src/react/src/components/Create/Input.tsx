import { useMemo } from 'react';

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
    <div className="flex w-full items-center justify-center gap-2">
      <div className="flex-1 text-right">
        <label htmlFor={`id-${id}`}>{label}</label>
      </div>
      <div className="flex-none">
        <input
          type="text"
          spellCheck={false}
          id={`id-${id}`}
          placeholder={placeholder}
          value={value}
          onChange={event => setValue(event.currentTarget.value)}
          className="rounded-xl p-2"
        ></input>
      </div>
    </div>
  );
};
