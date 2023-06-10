import * as React from "react";
import { SVGProps } from "react";

export const QuassumIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 32 32"
    fill="none"
    {...props}
  >
    <g clipPath="url(#a)">
      <rect width={30} height={30} x={1} y={1} fill="#fff" rx={15} />
      <path
        fill="url(#b)"
        d="M17.91 15.97c.282-.465.347-1.353-.581-1.913a2.652 2.652 0 0 1 .008-4.598 2.987 2.987 0 0 1 1.42-.453c.847-.05 1.61.247 2.2.626 1.173.75 2.243 2.153 2.507 4.031.303 2.154-.523 3.99-1.57 5.165-1.046 1.176-3.639 3.228-8.997 2.681l2.072-3.74c2.013-.628 2.66-1.334 2.942-1.799Z"
      />
      <path
        fill="url(#c)"
        d="M14.662 22.542a2.65 2.65 0 0 0-.005-4.608c-.914-.56-.848-1.442-.568-1.904.281-.465.929-1.17 2.942-1.8l2.072-3.74c-5.358-.546-7.95 1.506-8.997 2.682-1.047 1.175-1.873 3.011-1.57 5.165.264 1.878 1.334 3.28 2.506 4.031.592.379 1.354.677 2.2.627.516-.031.997-.188 1.42-.453Z"
      />
      <path
        fill="#000"
        fillRule="evenodd"
        d="M32 16c0-8.837-7.163-16-16-16S0 7.163 0 16s7.163 16 16 16 16-7.163 16-16ZM16 29c7.18 0 13-5.82 13-13S23.18 3 16 3 3 8.82 3 16s5.82 13 13 13Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <linearGradient
        id="b"
        x1={18.943}
        x2={15.408}
        y1={15.792}
        y2={18.443}
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset={1} stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="c"
        x1={13.057}
        x2={16.592}
        y1={16.209}
        y2={13.557}
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset={1} stopOpacity={0} />
      </linearGradient>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h32v32H0z" />
      </clipPath>
    </defs>
  </svg>
);
