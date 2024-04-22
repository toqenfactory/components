const Skeleton = ({ isOneNft }: { isOneNft: boolean }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="animate-pulse flex flex-col justify-center gap-2">
        <div className="">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl col-span-1"></div>
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl col-span-1"></div>
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl col-span-1"></div>
          </div>
        </div>
        <div className="flex gap-2">
          {isOneNft && (
            <div className="rounded-xl bg-slate-200 dark:bg-slate-700 h-20 w-20"></div>
          )}
          <div className="flex-1 space-y-6 py-1">
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded col-span-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded col-span-1"></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded col-span-1"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded col-span-2"></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded col-span-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded col-span-1"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
