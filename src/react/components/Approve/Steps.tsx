import { ISteps } from "./IApprove";

import IconArrows from "./icons/IconArrows";
import IconCheckCircle from "./icons/IconCheckCircle";

export const Steps = ({ status }: ISteps) => {
  const step1 =
    status === "wallet" || status === "pending" || status === "success";
  const step2 = status === "pending" || status === "success";
  const step3 = status === "success";

  return (
    <ol className="flex justify-center items-center w-full p-3 space-x-2 text-sm font-medium text-center text-slate-400 dark:text-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm sm:text-base sm:p-4 sm:space-x-4">
      <li className={`flex items-center text-sky-400`}>
        <span
          className={`flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full shrink-0 text-slate-50 border-sky-400 dark:text-slate-50 bg-sky-400 dark:border-sky-700 dark:bg-sky-700`}
        >
          {step1 ? (
            <IconCheckCircle className="text-sky-200 dark:text-sky-400" />
          ) : (
            `1`
          )}
        </span>
        Init
        <IconArrows className="w-3 h-3 ms-2 sm:ms-4" />
      </li>
      <li className={`flex items-center ${step1 && `text-sky-400`}`}>
        <span
          className={`flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full shrink-0 ${
            step1
              ? `text-white border-sky-400 bg-sky-400 dark:bg-sky-700 dark:border-sky-700 ${
                  status === "wallet" && `animate-ping`
                }`
              : `dark:border-slate-700`
          }`}
        >
          {step2 ? (
            <IconCheckCircle className="text-sky-200 dark:text-sky-400" />
          ) : (
            `2`
          )}
        </span>
        Confirmation
        <IconArrows className="w-3 h-3 ms-2 sm:ms-4" />
      </li>
      <li className={`flex items-center ${step2 && `text-sky-400`}`}>
        <span
          className={`flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full shrink-0 ${
            step2
              ? `text-white border-sky-400 bg-sky-400 dark:bg-sky-700 dark:border-sky-700 ${
                  status === "pending" && `animate-ping`
                }`
              : `dark:border-slate-700`
          }`}
        >
          {step3 ? (
            <IconCheckCircle className="text-sky-200 dark:text-sky-400" />
          ) : (
            `3`
          )}
        </span>
        Success
      </li>
    </ol>
  );
};
