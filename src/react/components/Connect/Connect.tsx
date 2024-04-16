import { useAccount, useConnect, useDisconnect } from "wagmi";

const Connect = () => {
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();

  return address ? (
    <div className="flex flex-col">
      <div>{address}</div>
      <div>
        <button
          className="mt-2 py-2 px-5 bg-neutral-500 text-white font-semibold rounded-xl shadow-md hover:bg-neutral-700 focus:outline-none focus:ring focus:ring-neutral-400 focus:ring-opacity-75"
          onClick={() => disconnect()}
        >
          Disconnect
        </button>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center gap-2 w-full h-full">
      {connectors?.length ? (
        connectors.map((connector, i) => (
          <div
            key={i}
            className="w-1/2 hover:cursor-pointer hover:scale-105"
            onClick={() => connect({ connector })}
          >
            <img
              src={connector.icon}
              className="w-full h-full rounded-xl"
            ></img>
          </div>
        ))
      ) : (
        <div className="w-full h-full">
          <a
            href="http://metamask.io"
            target="_blank"
            className="underline underline-offset-4 decoration-dotted"
          >
            Install Metamask
          </a>{" "}
          Or{" "}
          <a
            href="https://brave.com"
            target="_blank"
            className="underline underline-offset-4 decoration-dotted"
          >
            Use Brave Browser
          </a>
        </div>
      )}
    </div>
  );
};

export default Connect;
