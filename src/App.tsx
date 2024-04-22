import { useState } from "react";
import { Connect, Create, Mint, Approve } from "./react/src/components";

function App() {
  const [component, setComponent] = useState(<></>);
  const [title, setTitle] = useState("");

  const [erc20, setErc20] = useState<`0x${string}` | undefined>();
  const [erc721, setErc721] = useState<`0x${string}` | undefined>();

  const spender = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

  return (
    <div className="flex flex-col justify-center items-center h-full w-full m-0 p-0">
      <h1 className="text-2xl">Create - Mint - Approve - Transfer</h1>
      <div className="text-xl">Components for:</div>
      <ul className="list-disc my-4">
        <li>
          Create ERC20/ERC721 Token{" "}
          <div>
            <code className="text-xs">{`<Create standart={\`ERC20|ERC721\`} toqen={\`Address\`} handle={({data,status})=>{}} />`}</code>
          </div>
        </li>
        <li>
          Mint ERC20|ERC721{" "}
          <div>
            <code className="text-xs">{`<Mint address={\`Address ERC20|ERC721\`} handle={({data,status})=>{}} />`}</code>
          </div>
        </li>
        <li>
          Approve Spend ERC20/ERC721{" "}
          <div>
            <code className="text-xs">{`<Approve address={\`Address ERC20|ERC721\`} to={\`Address\`} tokenId={\`ID ERC721\`} operator={\`Address\`} approved={\`true|false\`} spender={\`Address\`} value={\`Amount ERC20\`} handle={({data,status})=>{}} />`}</code>
          </div>
        </li>
      </ul>
      <button
        className="btn"
        onClick={() => {
          setComponent(<Connect />);
          setTitle("Connect");
          const modal: any = document.getElementById("modal");
          modal?.showModal();
        }}
      >
        Connect
      </button>
      <button
        className="btn"
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
      <button
        className="btn"
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
      <button
        className="btn"
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
      <button
        className="btn"
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
        className="btn"
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
        Mint ERC721 WITHOUT STEPS
      </button>
      <button
        className="btn"
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
      <button
        className="btn"
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
        className="btn"
        onClick={() => {
          setComponent(
            <Approve
              address={erc721}
              to={spender}
              tokenId={"3"}
              steps={false}
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
        Approve ERC721 WITHOUT STEPS
      </button>
      <button
        className="btn"
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
          setTitle("Approve All ERC721");
          const modal: any = document.getElementById("modal");
          modal?.showModal();
        }}
      >
        Approve All ERC721
      </button>
      <button
        className="btn"
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
          setTitle("Approve All ERC721");
          const modal: any = document.getElementById("modal");
          modal?.showModal();
        }}
      >
        Disapprove All ERC721
      </button>
      <dialog id="modal" className="modal w-full">
        <div className="modal-box w-11/12 max-w-5xl m-0 p-0">
          <div className="relative">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-0">
                ✕
              </button>
            </form>
            <h3 className="text-lg font-extrabold ml-4 my-4">{title}</h3>
            <hr className="border-1 border-slate-200 dark:border-slate-700" />
          </div>
          <div className="flex justify-center items-center m-4">
            {component}
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default App;
