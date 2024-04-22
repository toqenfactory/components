import * as React from "react";

function IconArrows(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 12 10"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m7 9 4-4-4-4M1 9l4-4-4-4"
      />
    </svg>
  );
}

export default IconArrows;
