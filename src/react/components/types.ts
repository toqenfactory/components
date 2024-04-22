export type IAddress = `0x${string}` | undefined;

export type IStatus =
  | "idle"
  | "wallet"
  | "pending"
  | "success"
  | "error"
  | undefined;

export type IFunctionName = "approve" | "setApprovalForAll" | undefined;

export type IArgs = [`0x${string}`, bigint | boolean] | undefined;

export type IMetadata =
  | {
      name: string;
      description: string;
      image: string;
      external_url: string;
    }
  | undefined;

export interface IApprove {
  address: `0x${string}` | undefined;
  to?: `0x${string}` | undefined;
  tokenId?: string | undefined;
  operator?: `0x${string}` | undefined;
  approved?: boolean | undefined;
  spender?: `0x${string}` | undefined;
  value?: string | undefined;
  steps?: boolean;
  handle: ({
    data,
    status,
  }: {
    data: string | undefined;
    status: IStatus;
  }) => void;
}

export interface IActionButton {
  defaultText: string | JSX.Element;
  successText?: string | JSX.Element;
  defaultIcon: JSX.Element;
  successIcon?: JSX.Element;
  status?: IStatus;
  onClick: () => void;
}

export interface ISteps {
  status: IStatus;
}

export interface INft {
  metadata: IMetadata;
}

export interface IInfo {
  isApprove: boolean | undefined;
  tokenId?: string | undefined;
  value?: string | undefined;
  symbol?: string | undefined;
}

export interface IToken {
  addr: `0x${string}` | undefined;
  title: string;
}

export interface ISpender {
  addr: `0x${string}` | undefined;
}

export interface IMint {
  address: IAddress;
  steps?: boolean;
  handle: ({
    data,
    hash,
    status,
  }: {
    data: string[] | undefined;
    hash: `0x${string}` | undefined;
    status: IStatus;
  }) => void;
}

export interface EthAddressInputProps {
  initialAddress: `0x${string}` | undefined;
  defaultText?: string | undefined;
  handler: (newAddress: `0x${string}` | undefined) => void;
}
