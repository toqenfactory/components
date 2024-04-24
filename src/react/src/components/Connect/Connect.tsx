import { useAccount, useConnect, useDisconnect } from 'wagmi';
import BaseComponent from '../BaseComponent';

const Connect = ({ dark }: { dark?: boolean | undefined }) => {
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { address } = useAccount();

  return (
    <BaseComponent dark={dark}>
      {address ? (
        <div className="flex flex-col items-center justify-center">
          <div>{address}</div>
          <div>
            <button
              className="mt-2 rounded-xl bg-neutral-500 px-5 py-2 font-semibold text-white shadow-md hover:bg-neutral-700 focus:outline-none focus:ring focus:ring-neutral-400 focus:ring-opacity-75"
              onClick={() => disconnect()}
            >
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center gap-2">
          {connectors?.length ? (
            connectors.map((connector, i) => (
              <div
                key={i}
                className="w-1/2 hover:scale-105 hover:cursor-pointer"
                onClick={() => connect({ connector })}
              >
                <img
                  src={connector.icon}
                  className="h-full w-full rounded-xl"
                ></img>
              </div>
            ))
          ) : (
            <div className="h-full w-full">
              <a
                href="http://metamask.io"
                target="_blank"
                className="underline decoration-dotted underline-offset-4"
              >
                Install Metamask
              </a>{' '}
              Or{' '}
              <a
                href="https://brave.com"
                target="_blank"
                className="underline decoration-dotted underline-offset-4"
              >
                Use Brave Browser
              </a>
            </div>
          )}
        </div>
      )}
    </BaseComponent>
  );
};

export default Connect;
