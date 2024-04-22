import { IActionButton } from "../types";

const ActionButton = ({
  defaultText,
  successText,
  defaultIcon,
  successIcon,
  status,
  onClick,
}: IActionButton) => {
  return (
    <>
      <button
        onClick={onClick}
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
              } text-white/90 hover:text-white/100 from-sky-300 to-sky-400 hover:from-sky-400 hover:to-sky-400 dark:from-sky-600 dark:to-sky-700 dark:hover:from-sky-700 dark:hover:to-sky-700`
        }`}
      >
        <span
          className={`block text-xl font-medium ${
            status !== "wallet" &&
            status !== "pending" &&
            status !== "success" &&
            `group-hover:scale-105`
          }`}
        >
          {status === "wallet"
            ? `Open Wallet ...`
            : status === "pending"
            ? `Please Wait ...`
            : status === "success"
            ? successText ?? defaultText
            : defaultText}
        </span>
        <span
          className={`absolute w-12 h-12 inset-y-0 -top-0 right-1 ${
            status === "wallet" || status === "pending"
              ? `animate-pulse`
              : status === "success"
              ? `text-white opacity-50`
              : `opacity-30 group-hover:transition-all group-hover:opacity-50`
          }`}
        >
          {status === "success" ? successIcon ?? defaultIcon : defaultIcon}
        </span>
      </button>
    </>
  );
};

export default ActionButton;
