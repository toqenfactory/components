// icon:info | Feathericons https://feathericons.com/ | Cole Bemis
import * as React from "react";

function IconInfo(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M22 12 A10 10 0 0 1 12 22 A10 10 0 0 1 2 12 A10 10 0 0 1 22 12 z" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

export default IconInfo;
