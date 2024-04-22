// icon:image | Feathericons https://feathericons.com/ | Cole Bemis
import * as React from "react";

function IconImage(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M5 3 H19 A2 2 0 0 1 21 5 V19 A2 2 0 0 1 19 21 H5 A2 2 0 0 1 3 19 V5 A2 2 0 0 1 5 3 z" />
      <path d="M10 8.5 A1.5 1.5 0 0 1 8.5 10 A1.5 1.5 0 0 1 7 8.5 A1.5 1.5 0 0 1 10 8.5 z" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  );
}

export default IconImage;
