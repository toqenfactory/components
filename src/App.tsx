import { useEffect, useState } from "react";
import { useAccount, useChains, useSwitchChain } from "wagmi";

import logo from "./logo.svg";

import { Approve, Connect, Create, Mint } from "./react/src/components";
import TokenAlert from "./TokenAlert";

const tokenAddr = {
  199: "0xA03A3528aD6A799C5ACf61C95435A7270D8b036e",
  1029: "0x3AE2475877243dD4331c51BABa39832450526597",
} as any;

function App() {
  const { address, chainId } = useAccount();
  const chains = useChains();
  const { switchChain } = useSwitchChain();
  const [chain, setChain] = useState(chainId);

  const [dark, setDark] = useState(false);

  const [component, setComponent] = useState(<></>);
  const [title, setTitle] = useState("");

  const [toqen, setToqen] = useState<`0x${string}`>();

  const handleChainChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setChain(Number(event.target.value));
  };

  useEffect(() => {
    if (!chainId) return;
    setChain(chainId);
    setToqen(tokenAddr[chainId]);
  }, [chainId]);

  useEffect(() => {
    switchChain({ chainId: chain ?? 0 });
  }, [chain, switchChain]);

  const [erc20, setErc20] = useState<`0x${string}` | undefined>();
  const [erc721, setErc721] = useState<`0x${string}` | undefined>();

  const spender = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

  return (
    <div>
      <TokenAlert />
      <div className="flex flex-col justify-center items-center h-full w-full m-0 p-0 text-white dark:text-white">
        <img src={logo} className="w-60 h-60 animate-pulse"></img>
        <h1 className="text-4xl m-6 font-extrabold animate-bounce">
          Toqen Components
        </h1>
        <div className="flex gap-4 justify-center items-center my-2">
          <a href="https://github.com/toqenfactory" target="_blank">
            <svg
              viewBox="0 0 448 512"
              fill="currentColor"
              height="2em"
              width="2em"
            >
              <path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM277.3 415.7c-8.4 1.5-11.5-3.7-11.5-8 0-5.4.2-33 .2-55.3 0-15.6-5.2-25.5-11.3-30.7 37-4.1 76-9.2 76-73.1 0-18.2-6.5-27.3-17.1-39 1.7-4.3 7.4-22-1.7-45-13.9-4.3-45.7 17.9-45.7 17.9-13.2-3.7-27.5-5.6-41.6-5.6-14.1 0-28.4 1.9-41.6 5.6 0 0-31.8-22.2-45.7-17.9-9.1 22.9-3.5 40.6-1.7 45-10.6 11.7-15.6 20.8-15.6 39 0 63.6 37.3 69 74.3 73.1-4.8 4.3-9.1 11.7-10.6 22.3-9.5 4.3-33.8 11.7-48.3-13.9-9.1-15.8-25.5-17.1-25.5-17.1-16.2-.2-1.1 10.2-1.1 10.2 10.8 5 18.4 24.2 18.4 24.2 9.7 29.7 56.1 19.7 56.1 19.7 0 13.9.2 36.5.2 40.6 0 4.3-3 9.5-11.5 8-66-22.1-112.2-84.9-112.2-158.3 0-91.8 70.2-161.5 162-161.5S388 165.6 388 257.4c.1 73.4-44.7 136.3-110.7 158.3zm-98.1-61.1c-1.9.4-3.7-.4-3.9-1.7-.2-1.5 1.1-2.8 3-3.2 1.9-.2 3.7.6 3.9 1.9.3 1.3-1 2.6-3 3zm-9.5-.9c0 1.3-1.5 2.4-3.5 2.4-2.2.2-3.7-.9-3.7-2.4 0-1.3 1.5-2.4 3.5-2.4 1.9-.2 3.7.9 3.7 2.4zm-13.7-1.1c-.4 1.3-2.4 1.9-4.1 1.3-1.9-.4-3.2-1.9-2.8-3.2.4-1.3 2.4-1.9 4.1-1.5 2 .6 3.3 2.1 2.8 3.4zm-12.3-5.4c-.9 1.1-2.8.9-4.3-.6-1.5-1.3-1.9-3.2-.9-4.1.9-1.1 2.8-.9 4.3.6 1.3 1.3 1.8 3.3.9 4.1zm-9.1-9.1c-.9.6-2.6 0-3.7-1.5s-1.1-3.2 0-3.9c1.1-.9 2.8-.2 3.7 1.3 1.1 1.5 1.1 3.3 0 4.1zm-6.5-9.7c-.9.9-2.4.4-3.5-.6-1.1-1.3-1.3-2.8-.4-3.5.9-.9 2.4-.4 3.5.6 1.1 1.3 1.3 2.8.4 3.5zm-6.7-7.4c-.4.9-1.7 1.1-2.8.4-1.3-.6-1.9-1.7-1.5-2.6.4-.6 1.5-.9 2.8-.4 1.3.7 1.9 1.8 1.5 2.6z" />
            </svg>
          </a>
          <a href="https://www.npmjs.com/package/@toqen/react" target="_blank">
            <svg fill="none" viewBox="0 0 24 24" height="2.4em" width="2.4em">
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M5 21a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5zm1-3V6h12v12h-3V9h-3v9H6z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          <a
            href="https://bttcscan.com/address/0xa03a3528ad6a799c5acf61c95435a7270d8b036e#code"
            target="_blank"
          >
            <svg
              height="2.2em"
              width="2;2em"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="none">
                <circle cx="16" cy="16" r="16"></circle>
                <g fill="#FFF">
                  <path d="M27.743 13.539a11.886 11.886 0 0 0-.698-2.241 12.102 12.102 0 0 0-1.102-2.033 11.864 11.864 0 0 0-1.457-1.763 11.864 11.864 0 0 0-1.764-1.457 12.518 12.518 0 0 0-2.032-1.102 11.886 11.886 0 0 0-9.282 0 11.864 11.864 0 0 0-3.796 2.56 11.864 11.864 0 0 0-1.457 1.762 12.518 12.518 0 0 0-1.102 2.033 11.886 11.886 0 0 0 0 9.282c.294.71.674 1.383 1.102 2.032a11.88 11.88 0 0 0 1.457 1.764 11.864 11.864 0 0 0 1.764 1.457c.636.428 1.322.796 2.032 1.102a11.886 11.886 0 0 0 9.282 0c.71-.294 1.383-.674 2.032-1.102a11.864 11.864 0 0 0 1.764-1.457 11.864 11.864 0 0 0 1.457-1.764c.428-.636.796-1.322 1.102-2.032a11.886 11.886 0 0 0 .698-7.041zM16.06 26.384c-5.767 0-10.432-4.678-10.432-10.433S10.306 5.518 16.06 5.518c5.755 0 10.433 4.678 10.433 10.433S21.816 26.384 16.06 26.384z"></path>
                  <path d="M16.245 25.478h.282c.049 0 .097 0 .146-.013h.013c.049 0 .085 0 .134-.012h.037c.037 0 .074 0 .11-.012h.037c.037 0 .074-.012.123-.012h.024c.049 0 .098-.013.147-.013.049 0 .086-.012.135-.024h.024c.037 0 .074-.012.11-.012h.025c.049-.013.086-.013.135-.025.097-.012.195-.037.281-.061h.025c.036-.012.085-.012.122-.025h.012c.098-.024.184-.049.282-.073a10.948 10.948 0 0 1-2.73-.257c-1.348-.294-2.633-.82-3.723-1.727a7.544 7.544 0 0 1-2.718-5.865 7.127 7.127 0 0 1 1.677-4.555c1.396-1.653 3.38-2.523 5.412-2.572h.282V8.592h-.318a9.186 9.186 0 0 0-1.837.22 8.83 8.83 0 0 0-1.763.6c-.576.27-1.115.6-1.617.98a8.618 8.618 0 0 0-1.408 1.347 8.333 8.333 0 0 0-1.016 1.506 8.61 8.61 0 0 0-.674 1.628 8.9 8.9 0 0 0-.33 1.703l-.037.538v.318c.012.625.086 1.237.22 1.837.135.613.343 1.2.6 1.764.307.673.858 1.665 1.678 2.412a9.47 9.47 0 0 0 5.877 2.033h.221z"></path>
                  <path d="M18.914 23.91a12.454 12.454 0 0 1-1.8-.196c-2.522-.453-4.69-1.996-5.485-4.322-.968-2.829.514-5.89 3.33-6.82a5.21 5.21 0 0 1 1.665-.27c.723 0 1.445.147 2.107.416l.685-1.457a13.136 13.136 0 0 0-.624-.232 7.213 7.213 0 0 0-2.168-.331 6.87 6.87 0 0 0-2.167.355 6.81 6.81 0 0 0-2.412 1.396 7.02 7.02 0 0 0-.918.992 6.66 6.66 0 0 0-.698 1.139 6.904 6.904 0 0 0-.686 2.584c-.061.93.061 1.86.367 2.742a6.77 6.77 0 0 0 1.47 2.437c.6.649 1.298 1.139 2.142 1.592.882.465 1.972.71 3.11.87.735.097 1.715.122 2.29.122.502-.184.71-.27.98-.38.233-.11.465-.22.698-.355.233-.135.27-.16.661-.416a.68.68 0 0 0 .098-.074c-1.347.233-1.69.22-2.645.208z"></path>
                  <path d="M21.927 22.086c-.38.024-.919.06-1.531.06-1.09 0-2.425-.097-3.563-.477-1.764-.587-3.429-2.093-3.429-3.955a3.352 3.352 0 0 1 3.355-3.355c1.261 0 2.351.698 2.927 1.714l1.457-.722a4.734 4.734 0 0 0-.87-1.163 4.966 4.966 0 0 0-7.029 0 4.966 4.966 0 0 0-1.457 3.514 4.9 4.9 0 0 0 .43 1.984c.256.563.612 1.09 1.065 1.58.796.856 1.885 1.542 3.049 1.934 1.114.367 2.755.502 4.347.392.44-.037.771-.074 1.334-.196a9.188 9.188 0 0 0 1.47-1.457c-.38.037-1.078.11-1.555.147z"></path>
                </g>
              </g>
            </svg>
          </a>
        </div>
        <div className="m-0 p-8 text-white dark:text-white">
          <div className="bg-gradient-to-r from-blue-900 to-sky-900 rounded-3xl text-white p-4">
            npm i @toqen/react
          </div>
        </div>
        <div className="flex gap-2 justify-center items-center">
          {"Chain ID: "}
          <select
            id="chain-select"
            value={chain}
            onChange={handleChainChange}
            className="rounded-xl border-0 bg-transparent px-2 text-center"
          >
            {chains.map((chain: any) => (
              <option key={chain.id} value={chain.id}>
                {chain.name}
              </option>
            ))}
          </select>
          {"Toqen: "}
          <input
            type="text"
            placeholder="The address of Toqen on network"
            className="rounded-xl border-0 bg-transparent w-96 p-4"
            value={toqen}
            onChange={(e) => setToqen(e.currentTarget.value as `0x${string}`)}
          />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center h-full w-full m-0 p-8 text-white dark:text-white pl-20">
        <div className="bg-slate-600/35 rounded-3xl text-white p-4">
          {`import {Connect, Create, Mint, Approve} from "@toqen/react"`}
        </div>
        <small className=" opacity-15">
          The component retrieves all chain settings from the parent wagmi
          configuration.
        </small>
      </div>
      <div className="flex flex-col justify-start items-start h-full w-full m-0 p-8 text-white dark:text-white pl-20">
        <ul className="my-4 list-decimal space-y-3 flex flex-col justify-start">
          <li>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl">
                Connect{" "}
                <small className="text-xs">
                  (example, main connect in parent app)
                </small>
              </h2>
              <div>
                <code className="text-xs bg-slate-600/35 rounded-xl px-4 py-2">
                  {address ? `You: ${address}` : `<Connect />`}
                </code>
              </div>
              <div>
                <button
                  className="btn btn-ghost border-b-cyan-600"
                  onClick={() => {
                    setDark(false);
                    setComponent(<Connect />);
                    setTitle("Connect");
                    const modal: any = document.getElementById("modal");
                    modal?.showModal();
                  }}
                >
                  Connect
                </button>
              </div>
            </div>
          </li>
          <li>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl">Create ERC20 Token</h2>
              <div>
                <code className="text-xs bg-slate-600/35 rounded-xl px-4 py-2">
                  {`<Create standart="ERC20" toqen="${toqen}" />`}
                </code>
              </div>
              <div className="flex gap-4">
                <button
                  className="btn btn-ghost border-b-cyan-600"
                  onClick={() => {
                    setDark(true);
                    setComponent(
                      <Create
                        standart="ERC20"
                        toqen={toqen}
                        dark
                        handle={({ data, status }) => {
                          console.log("data", data);
                          console.log("status", status);
                          if (data && status === "success") setErc20(data);
                        }}
                      />
                    );
                    setTitle("Create ERC20");
                    const modal: any = document.getElementById("modal");
                    modal?.showModal();
                  }}
                >
                  Create ERC20
                </button>
              </div>
            </div>
          </li>
          <li>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl">Create ERC721 Token</h2>
              <div>
                <code className="text-xs bg-slate-600/35 rounded-xl px-4 py-2">
                  {`<Create standart="ERC721" toqen="${toqen}" />`}
                </code>
              </div>
              <div className="flex gap-4">
                <button
                  className="btn btn-ghost border-b-cyan-600"
                  onClick={() => {
                    setDark(true);
                    setComponent(
                      <Create
                        standart="ERC721"
                        toqen={toqen}
                        dark
                        handle={({ data, status }) => {
                          console.log("data", data);
                          console.log("status", status);
                          if (data && status === "success") setErc721(data);
                        }}
                      />
                    );
                    setTitle("Create ERC721");
                    const modal: any = document.getElementById("modal");
                    modal?.showModal();
                  }}
                >
                  Create ERC721
                </button>
              </div>
            </div>
          </li>
          <li>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl">Mint ERC20 Token</h2>
              <div>
                <code className="text-xs bg-slate-600/35 rounded-xl px-4 py-2">
                  {`<Mint standart="ERC20" address="${erc20 ?? `ERC20 Address`}" />`}
                </code>
              </div>
              <div className="flex gap-4">
                <button
                  className="btn btn-ghost border-b-cyan-600"
                  onClick={() => {
                    setDark(true);
                    setComponent(
                      <Mint
                        address={erc20}
                        dark
                        handle={({ data, status }) => {
                          console.log("data", data);
                          console.log("status", status);
                        }}
                      />
                    );
                    setTitle("Mint ERC20");
                    const modal: any = document.getElementById("modal");
                    modal?.showModal();
                  }}
                >
                  Mint ERC20
                </button>
              </div>
            </div>
          </li>
          <li>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl">Mint ERC721 Token</h2>
              <div>
                <code className="text-xs bg-slate-600/35 rounded-xl px-4 py-2">
                  {`<Mint standart="ERC721" address="${erc721 ?? `ERC721 Address`}" steps dark />`}
                </code>
              </div>
              <div className="flex gap-4">
                <button
                  className="btn btn-ghost border-b-cyan-600"
                  onClick={() => {
                    setDark(true);
                    setComponent(
                      <Mint
                        address={erc721}
                        steps
                        dark
                        handle={({ data, status }) => {
                          console.log("data", data);
                          console.log("status", status);
                        }}
                      />
                    );
                    setTitle("Mint ERC721");
                    const modal: any = document.getElementById("modal");
                    modal?.showModal();
                  }}
                >
                  Mint ERC721
                </button>
                <button
                  className="btn btn-ghost border-b-cyan-600"
                  onClick={() => {
                    setDark(true);
                    setComponent(
                      <Mint
                        address={erc721}
                        steps={false}
                        dark
                        handle={({ data, status }) => {
                          console.log("data", data);
                          console.log("status", status);
                        }}
                      />
                    );
                    setTitle("Mint ERC721");
                    const modal: any = document.getElementById("modal");
                    modal?.showModal();
                  }}
                >
                  Mint ERC721 Without Steps
                </button>
              </div>
            </div>
          </li>
          <li>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl">Approve ERC20 Token</h2>
              <div>
                <code className="text-xs bg-slate-600/35 rounded-xl px-4 py-2">
                  {`<Approve address="${erc20 ?? `ERC20 Address`}" spender="Address" value="10" steps />`}
                </code>
              </div>
              <div className="flex gap-4">
                <button
                  className="btn btn-ghost border-b-cyan-600"
                  onClick={() => {
                    setDark(false);
                    setComponent(
                      <Approve
                        address={erc20}
                        spender={spender}
                        value={"10"}
                        steps
                        handle={({ data, status }) => {
                          console.log("data", data);
                          console.log("status", status);
                        }}
                      />
                    );
                    setTitle("Approve ERC20");
                    const modal: any = document.getElementById("modal");
                    modal?.showModal();
                  }}
                >
                  Approve ERC20
                </button>
              </div>
            </div>
          </li>
          <li>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl">Approve ERC721 Token</h2>
              <div>
                <code className="text-xs bg-slate-600/35 rounded-xl px-4 py-2">
                  {`<Approve address="${erc721 ?? `ERC721 Address`}" to="Address" tokenId="3" steps dark />`}
                </code>
              </div>
              <div className="flex gap-4">
                <button
                  className="btn btn-ghost border-b-cyan-600"
                  onClick={() => {
                    setDark(true);
                    setComponent(
                      <Approve
                        address={erc721}
                        to={spender}
                        tokenId={"3"}
                        steps
                        dark
                        handle={({ data, status }) => {
                          console.log("data", data);
                          console.log("status", status);
                        }}
                      />
                    );
                    setTitle("Approve ERC721");
                    const modal: any = document.getElementById("modal");
                    modal?.showModal();
                  }}
                >
                  Approve ERC721
                </button>
                <button
                  className="btn btn-ghost border-b-cyan-600"
                  onClick={() => {
                    setDark(true);
                    setComponent(
                      <Approve
                        address={erc721}
                        steps={false}
                        to={spender}
                        tokenId={"3"}
                        dark
                        handle={({ data, status }) => {
                          console.log("data", data);
                          console.log("status", status);
                        }}
                      />
                    );
                    setTitle("Approve ERC721");
                    const modal: any = document.getElementById("modal");
                    modal?.showModal();
                  }}
                >
                  Approve ERC721 Without Steps
                </button>
              </div>
            </div>
          </li>
          <li>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl">Approve ALL ERC721 Token</h2>
              <div>
                <code className="text-xs bg-slate-600/35 rounded-xl px-4 py-2">
                  {`<Approve address="${erc721 ?? `ERC721 Address`}" operator="Address" approved={true} steps dark />`}
                </code>
              </div>
              <div className="flex gap-4">
                <button
                  className="btn btn-ghost border-b-cyan-600"
                  onClick={() => {
                    setDark(true);
                    setComponent(
                      <Approve
                        address={erc721}
                        operator={spender}
                        approved={true}
                        steps
                        dark
                        handle={({ data, status }) => {
                          console.log("data", data);
                          console.log("status", status);
                        }}
                      />
                    );
                    setTitle("Approve ALL ERC721");
                    const modal: any = document.getElementById("modal");
                    modal?.showModal();
                  }}
                >
                  Approve ALL ERC721
                </button>
              </div>
            </div>
          </li>
          <li>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl">Disapprove ALL ERC721 Token</h2>
              <div>
                <code className="text-xs bg-slate-600/35 rounded-xl px-4 py-2">
                  {`<Approve address="${erc721 ?? `ERC721 Address`}" operator="Address" approved={false} steps dark />`}
                </code>
              </div>
              <div className="flex gap-4">
                <button
                  className="btn btn-ghost border-b-cyan-600"
                  onClick={() => {
                    setDark(true);
                    setComponent(
                      <Approve
                        address={erc721}
                        operator={spender}
                        approved={false}
                        steps
                        dark
                        handle={({ data, status }) => {
                          console.log("data", data);
                          console.log("status", status);
                        }}
                      />
                    );
                    setTitle("Approve ALL ERC721");
                    const modal: any = document.getElementById("modal");
                    modal?.showModal();
                  }}
                >
                  Disapprove ALL ERC721
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <dialog id="modal" className="modal w-full">
        <div
          className={`${dark ? `bg-slate-800 text-slate-50` : `bg-slate-50 text-slate-800`} modal-box m-0 p-0`}
        >
          <div className="relative">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-0">
                ✕
              </button>
            </form>
            <h3 className="text-lg font-extrabold ml-4 my-4">{title}</h3>
            <hr className="border-0 border-slate-200 dark:border-slate-700" />
          </div>
          <div className="flex justify-center items-center m-4 p-4 mt-1 pt-1">
            {component}
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default App;
