// HoverLightningIcon.tsx

interface IconProps {
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
  isHovered: boolean;
}

const HoverLightningIcon = ({ width = 40, height = 40, fill = "#FFD700", stroke = "#FFA500", isHovered }: IconProps) => {
  return (
    <div 
      className="relative"
      style={{ width, height }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        width={width}
        height={height}
        style={{
          transition: 'transform .01s',
          transform: isHovered ? 'skew(-9deg)' : '',
          transformOrigin:'bottom left',
        }}
      >
        <path
          d="M65 5 L35 40 L50 40 L30 95 L75 50 L55 50 L75 5 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default HoverLightningIcon;