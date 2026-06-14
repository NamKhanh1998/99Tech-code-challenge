import { FC } from "react";
import { theme } from "@/config";

export const SearchFatIcon: FC<React.SVGAttributes<HTMLOrSVGElement>> = (props) => {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g>
        <g id="Vector">
          <path d="M12.25 12.25L16 16L12.25 12.25Z" />
          <path
            d="M12.25 12.25L16 16"
            stroke={props.stroke ?? theme.colors.iconLight}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <path
          id="Vector_2"
          d="M1 7.42857C1 10.979 3.87817 13.8571 7.42857 13.8571C9.20682 13.8571 10.8165 13.1351 11.9803 11.9682C13.1401 10.8054 13.8571 9.20071 13.8571 7.42857C13.8571 3.87817 10.979 1 7.42857 1C3.87817 1 1 3.87817 1 7.42857Z"
          {...props}
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke={props.stroke ?? theme.colors.iconLight}
        />
      </g>
    </svg>
  );
};
