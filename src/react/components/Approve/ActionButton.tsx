export const ActionButton = ({
  defaultText,
  successText,
  defaultIcon,
  successIcon,
  status,
  handle,
}: {
  defaultText: string;
  successText: string;
  defaultIcon: JSX.Element;
  successIcon: JSX.Element;
  status: "idle" | "wallet" | "pending" | "success" | "error" | undefined;
  handle: () => void;
}) => {
  return (
    <>
      <button
        onClick={handle}
        type="button"
        disabled={
          status === "wallet" || status === "pending" || status === "success"
        }
        className={`group shadow-md relative overflow-hidden w-full bg-gradient-to-r focus:ring-0 focus:outline-none rounded-lg px-5 py-2.5 text-center ${
          status === "success"
            ? `pointer-events-none text-white from-teal-300 to-teal-400 dark:text-white dark:from-teal-600 dark:to-teal-700`
            : `${
                (status === "wallet" || status === "pending") &&
                `pointer-events-none`
              } text-white/90 hover:text-white/100 from-sky-300 to-sky-400 hover:from-sky-400 hover:to-sky-400 dark:text-white/60 dark:hover:text-white/80 dark:from-sky-600 dark:to-sky-700 dark:hover:from-sky-700 dark:hover:to-sky-700`
        }`}
      >
        <span
          className={`block text-xl font-medium lowercase ${
            status !== "wallet" &&
            status !== "pending" &&
            status !== "success" &&
            `group-hover:scale-105`
          }`}
        >
          {status === "wallet"
            ? `open wallet ...`
            : status === "pending"
            ? `please wait ...`
            : status === "success"
            ? successText
            : defaultText}
        </span>
        <span
          className={`absolute w-12 h-12 inset-y-0 -top-0 right-1 ${
            status === "wallet" || status === "pending"
              ? ` animate-pulse`
              : status === "success"
              ? `text-white opacity-50`
              : `opacity-30 group-hover:transition-all group-hover:opacity-50`
          }`}
        >
          {status === "success" ? successIcon : defaultIcon}
        </span>
      </button>
    </>
  );
};
