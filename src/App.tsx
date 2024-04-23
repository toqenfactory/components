import { useState } from "react";
import { useAccount } from "wagmi";
import { Approve, Connect, Create, Mint } from "./react/src/components"; // ./react/src/components

function App() {
  const { address } = useAccount();

  const [component, setComponent] = useState(<></>);
  const [title, setTitle] = useState("");

  const [erc20, setErc20] = useState<`0x${string}` | undefined>();
  const [erc721, setErc721] = useState<`0x${string}` | undefined>();

  const spender = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

  return (
    <>
      <div className="flex flex-col justify-center items-center h-full w-full m-0 p-0 text-white dark:text-white">
        <h1 className="text-6xl m-6">Create - Mint - Approve</h1>
        <div className="text-xl">Components:</div>
      </div>
      <div className="flex flex-col justify-start items-start h-full w-full m-0 p-8 text-white dark:text-white">
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
                  {`<Create standart="ERC20" toqen="TOQEN Contract Address" />`}
                </code>
              </div>
              <div className="flex gap-4">
                <button
                  className="btn btn-ghost border-b-cyan-600"
                  onClick={() => {
                    setComponent(
                      <Create
                        standart="ERC20"
                        toqen="0x5FbDB2315678afecb367f032d93F642f64180aa3"
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
                  {`<Create standart="ERC721" toqen="TOQEN Contract Address" />`}
                </code>
              </div>
              <div className="flex gap-4">
                <button
                  className="btn btn-ghost border-b-cyan-600"
                  onClick={() => {
                    setComponent(
                      <Create
                        standart="ERC721"
                        toqen="0x5FbDB2315678afecb367f032d93F642f64180aa3"
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
                    setComponent(
                      <Mint
                        address={erc20}
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
                  {`<Mint standart="ERC721" address="${erc721 ?? `ERC721 Address`}" steps={true} />`}
                </code>
              </div>
              <div className="flex gap-4">
                <button
                  className="btn btn-ghost border-b-cyan-600"
                  onClick={() => {
                    setComponent(
                      <Mint
                        address={erc721}
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
                    setComponent(
                      <Mint
                        address={erc721}
                        steps={false}
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
                  {`<Approve address="${erc20 ?? `ERC20 Address`}" spender="Address" value="10" steps={true} />`}
                </code>
              </div>
              <div className="flex gap-4">
                <button
                  className="btn btn-ghost border-b-cyan-600"
                  onClick={() => {
                    setComponent(
                      <Approve
                        address={erc20}
                        spender={spender}
                        value={"10"}
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
                  {`<Approve address="${erc721 ?? `ERC721 Address`}" to="Address" tokenId="3" steps={true} />`}
                </code>
              </div>
              <div className="flex gap-4">
                <button
                  className="btn btn-ghost border-b-cyan-600"
                  onClick={() => {
                    setComponent(
                      <Approve
                        address={erc721}
                        to={spender}
                        tokenId={"3"}
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
                    setComponent(
                      <Approve
                        address={erc721}
                        steps={false}
                        to={spender}
                        tokenId={"3"}
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
                  {`<Approve address="${erc721 ?? `ERC721 Address`}" operator="Address" approved={true} steps={true} />`}
                </code>
              </div>
              <div className="flex gap-4">
                <button
                  className="btn btn-ghost border-b-cyan-600"
                  onClick={() => {
                    setComponent(
                      <Approve
                        address={erc721}
                        operator={spender}
                        approved={true}
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
                  {`<Approve address="${erc721 ?? `ERC721 Address`}" operator="Address" approved={false} steps={true} />`}
                </code>
              </div>
              <div className="flex gap-4">
                <button
                  className="btn btn-ghost border-b-cyan-600"
                  onClick={() => {
                    setComponent(
                      <Approve
                        address={erc721}
                        operator={spender}
                        approved={false}
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
        <div className="modal-box m-0 p-0">
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
    </>
  );
}

export default App;
