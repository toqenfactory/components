const Arrows = () => (
  <span className="text-slate-400 dark:text-slate-700">
    <svg
      className="w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 12 10"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m7 9 4-4-4-4M1 9l4-4-4-4"
      />
    </svg>
  </span>
);

export const Steps = ({
  status,
}: {
  status: "idle" | "wallet" | "pending" | "success" | "error" | undefined;
}) => {
  return (
    <ol className="flex justify-center items-center w-full p-3 space-x-2 text-sm font-medium text-center text-slate-400 border border-slate-200 rounded-lg shadow-sm sm:text-base dark:text-slate-600 dark:border-slate-700 sm:p-4 sm:space-x-4 rtl:space-x-reverse">
      <li className={`flex items-center text-sky-400 dark:text-sky-700`}>
        <span
          className={`flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full shrink-0 text-slate-50 border-sky-400 dark:text-slate-50 bg-sky-400 dark:border-sky-700 dark:bg-sky-700`}
        >
          1
        </span>
        Init
        <Arrows />
      </li>
      <li
        className={`flex items-center ${
          status === "wallet" || status === "pending" || status === "success"
            ? `text-sky-400 dark:text-sky-700`
            : ``
        }`}
      >
        <span
          className={`flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full shrink-0 ${
            status === "wallet" || status === "pending" || status === "success"
              ? `text-white border-sky-400 bg-sky-400 dark:bg-sky-700 dark:border-sky-700 ${
                  status !== "success" ? `animate-ping` : ``
                }`
              : `dark:border-slate-700`
          }`}
        >
          2
        </span>
        Confirmation
        <Arrows />
      </li>
      <li
        className={`flex items-center ${
          status === "success" ? `text-sky-400 dark:text-sky-700` : ``
        }`}
      >
        <span
          className={`flex items-center justify-center w-5 h-5 me-2 text-xs border rounded-full shrink-0 ${
            status === "success"
              ? `text-white border-sky-400 bg-sky-400 dark:bg-sky-700 dark:border-sky-700`
              : `dark:border-slate-700`
          }`}
        >
          3
        </span>
        Success
      </li>
    </ol>
  );
};
