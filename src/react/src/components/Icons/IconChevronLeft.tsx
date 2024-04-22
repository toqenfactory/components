// icon:chevron-left | Feathericons https://feathericons.com/ | Cole Bemis
import * as React from "react";

function IconChevronLeft(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export default IconChevronLeft;
