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
  handle: ({
    data,
    status,
  }: {
    data: string | undefined;
    status: IStatus;
  }) => void;
}

export interface IActionButton {
  defaultText: string;
  successText: string;
  defaultIcon: JSX.Element;
  successIcon: JSX.Element;
  status: IStatus;
  handle: () => void;
}

export interface ISteps {
  status: IStatus;
}

export interface INft {
  metadata: IMetadata;
}

export interface IInfo {
  isApproved: boolean;
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
