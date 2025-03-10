import { SVGProps } from "react";

export default function PlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 384 512"
      className="size-6 md:size-7"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color: "rgb(255, 255, 255)" }}
      {...props}
    >
      <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"></path>
    </svg>
  );
}
