import IconCloudSnow from "./icons/IconCloudShow";
import IconInfoOutline from "./icons/IconInfoOutline";
import IconLayers from "./icons/IconLayers";

const Steps = ({ step }: { step: number }) => {
  return (
    <div>
      <h2 className="sr-only">Steps</h2>

      <div className="mb-4">
        <ol
          className={`grid grid-cols-1 divide-x divide-slate-400 dark:divide-slate-700 overflow-hidden rounded-lg border-0 text-sm text-slate-500 sm:grid-cols-3`}
        >
          <li
            className={`flex items-center justify-center gap-2 p-4 ${
              step === 1
                ? `bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-50`
                : `bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-400`
            }`}
          >
            <span
              className={`w-10 h-10 ${
                step === 1
                  ? `text-slate-950 dark:text-slate-50`
                  : `text-slate-600 dark:text-slate-400`
              }`}
            >
              <IconInfoOutline />
            </span>

            <p className="leading-none">
              <strong className="block font-medium"> Details </strong>
              <small className="mt-1"> Some info about token </small>
            </p>
          </li>

          <li
            className={`relative flex items-center justify-center gap-2 p-4 ${
              step === 2
                ? `bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-50`
                : `bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-400`
            }`}
          >
            <span
              className={`absolute -left-2 top-1/2 hidden size-4 -translate-y-1/2 rotate-45 sm:block border-b-0 border-s-0 ${
                step === 1 &&
                `border border-slate-400 dark:border-slate-700 bg-slate-100 dark:bg-slate-950`
              } ${
                step === 2 &&
                `border border-slate-400 dark:border-slate-700 bg-slate-50 dark:bg-slate-900`
              } ${
                step === 3 &&
                `border border-slate-400 dark:border-slate-700 bg-slate-50 dark:bg-slate-900`
              }`}
            ></span>

            <span
              className={`absolute -right-2 top-1/2 hidden size-4 -translate-y-1/2 rotate-45 sm:block border-b-0 border-s-0 ${
                step === 1 &&
                `border border-slate-400 dark:border-slate-700 bg-slate-50 dark:bg-slate-900`
              } ${
                step === 2 &&
                `border border-slate-400 dark:border-slate-700 bg-slate-100 dark:bg-slate-950`
              } ${
                step === 3 &&
                `border border-slate-400 dark:border-slate-700 bg-slate-50 dark:bg-slate-900`
              }`}
            ></span>

            <span
              className={`w-10 h-10 ${
                step === 2
                  ? `text-slate-950 dark:text-slate-50`
                  : `text-slate-600 dark:text-slate-400`
              }`}
            >
              <IconCloudSnow />
            </span>

            <p className="leading-none">
              <strong className="block font-medium"> Allocation </strong>
              <small className="mt-1"> Settings for token mining </small>
            </p>
          </li>

          <li
            className={`flex items-center justify-center gap-2 p-4 ${
              step === 3
                ? `bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-50`
                : `bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-400`
            }`}
          >
            <span
              className={`w-10 h-10 ${
                step === 3
                  ? `text-slate-950 dark:text-slate-50`
                  : `text-slate-600 dark:text-slate-400`
              }`}
            >
              <IconLayers />
            </span>

            <p className="leading-none">
              <strong className="block font-medium"> Success </strong>
              <small className="mt-1"> Sending a smart contract </small>
            </p>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default Steps;
