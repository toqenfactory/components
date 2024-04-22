// icon:picture | System UIcons https://systemuicons.com/ | Corey Ginnivan
import * as React from "react";

function IconPicture(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 21 21" fill="currentColor" {...props}>
      <g fill="none" fillRule="evenodd" transform="translate(3 3)">
        <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5.5h10a2 2 0 012 2v10a2 2 0 01-2 2h-10a2 2 0 01-2-2v-10a2 2 0 012-2z" />
          <path d="M14.5 10.5l-3-3-3 2.985M12.5 14.5l-9-9-3 3" />
        </g>
        <path
          fill="currentColor"
          d="M12 4 A1 1 0 0 1 11 5 A1 1 0 0 1 10 4 A1 1 0 0 1 12 4 z"
        />
      </g>
    </svg>
  );
}

export default IconPicture;
