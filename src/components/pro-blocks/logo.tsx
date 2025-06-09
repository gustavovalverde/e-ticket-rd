interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  width = 32,
  height = 32,
  className = "",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_3014_8110)">
        <g clipPath="url(#clip1_3014_8110)">
          <rect
            x="4.5"
            y="4.5"
            width="27"
            height="27"
            fill="black"
            stroke="#4497F7"
            strokeWidth="2.25"
          />
          <rect
            x="1.125"
            y="1.125"
            width="6.75"
            height="6.75"
            fill="white"
            stroke="#4497F7"
            strokeWidth="2.25"
          />
          <rect
            x="28.125"
            y="1.125"
            width="6.75"
            height="6.75"
            fill="white"
            stroke="#4497F7"
            strokeWidth="2.25"
          />
          <rect
            x="1.125"
            y="28.125"
            width="6.75"
            height="6.75"
            fill="white"
            stroke="#4497F7"
            strokeWidth="2.25"
          />
          <rect
            x="28.125"
            y="28.125"
            width="6.75"
            height="6.75"
            fill="white"
            stroke="#4497F7"
            strokeWidth="2.25"
          />
          <path
            d="M10.6875 25.3125L25.3125 10.6875"
            stroke="white"
            strokeWidth="2.25"
          />
          <path
            d="M19.6875 25.3125L25.3125 19.6875"
            stroke="white"
            strokeWidth="2.25"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_3014_8110">
          <rect width="36" height="36" fill="white" />
        </clipPath>
        <clipPath id="clip1_3014_8110">
          <rect width="36" height="36" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
