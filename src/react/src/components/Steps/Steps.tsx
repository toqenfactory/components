import { ISteps } from '../types';

import IconArrows from '../Icons/IconArrows';
import IconCheckCircle from '../Icons/IconCheckCircle';

const Steps = ({ status }: ISteps) => {
  const step1 =
    status === 'wallet' || status === 'pending' || status === 'success';
  const step2 = status === 'pending' || status === 'success';
  const step3 = status === 'success';

  return (
    <ol className="flex w-full items-center justify-center space-x-2 rounded-lg border border-slate-200 p-3 text-center text-sm font-medium text-slate-400 shadow-sm sm:space-x-4 sm:p-4 sm:text-base dark:border-slate-700 dark:text-slate-700">
      <li className={`flex items-center text-sky-400`}>
        <span
          className={`me-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-sky-400 bg-sky-400 text-xs text-slate-50 dark:border-sky-700 dark:bg-sky-700 dark:text-slate-50`}
        >
          {step1 ? (
            <IconCheckCircle className="text-sky-200 dark:text-sky-400" />
          ) : (
            `1`
          )}
        </span>
        Init
        <IconArrows className="ms-2 h-3 w-3 sm:ms-4" />
      </li>
      <li className={`flex items-center ${step1 && `text-sky-400`}`}>
        <span
          className={`me-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
            step1
              ? `border-sky-400 bg-sky-400 text-white dark:border-sky-700 dark:bg-sky-700 ${
                  status === 'wallet' && `animate-ping`
                }`
              : `dark:border-slate-700`
          }`}
        >
          {step2 ? (
            <IconCheckCircle className="text-sky-200 dark:text-sky-400" />
          ) : status !== 'wallet' ? (
            `2`
          ) : (
            ``
          )}
        </span>
        Confirmation
        <IconArrows className="ms-2 h-3 w-3 sm:ms-4" />
      </li>
      <li className={`flex items-center ${step2 && `text-sky-400`}`}>
        <span
          className={`me-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
            step2
              ? `border-sky-400 bg-sky-400 text-white dark:border-sky-700 dark:bg-sky-700 ${
                  status === 'pending' && `animate-ping`
                }`
              : `dark:border-slate-700`
          }`}
        >
          {step3 ? (
            <IconCheckCircle className="text-sky-200 dark:text-sky-400" />
          ) : status !== 'pending' ? (
            `3`
          ) : (
            ``
          )}
        </span>
        Success
      </li>
    </ol>
  );
};

export default Steps;
