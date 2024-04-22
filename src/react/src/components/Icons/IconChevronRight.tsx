// icon:chevron-right | Feathericons https://feathericons.com/ | Cole Bemis
import * as React from "react";

function IconChevronRight(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export default IconChevronRight;
