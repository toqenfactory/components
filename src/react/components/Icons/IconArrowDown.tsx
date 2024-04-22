// icon:arrow-down | Feathericons https://feathericons.com/ | Cole Bemis
import * as React from "react";

function IconArrowDown(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  );
}

export default IconArrowDown;
