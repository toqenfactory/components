// icon:unlock | Feathericons https://feathericons.com/ | Cole Bemis
import * as React from "react";

function IconUnlock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M5 11 H19 A2 2 0 0 1 21 13 V20 A2 2 0 0 1 19 22 H5 A2 2 0 0 1 3 20 V13 A2 2 0 0 1 5 11 z" />
      <path d="M7 11V7a5 5 0 019.9-1" />
    </svg>
  );
}

export default IconUnlock;
