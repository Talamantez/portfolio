// ItalicLightningIcon.tsx

const ItalicLightningIcon = (
    {
        width = 30,
        height = 30,
        fill = "#FFD700",
        stroke = "#FFA500",
    },
) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            width={width}
            height={height}
        >
            <g transform="skewX(-10)">
                <path
                    d="M65 5 L35 40 L50 40 L30 95 L75 50 L55 50 L75 5 Z"
                    fill={fill}
                    stroke={stroke}
                    stroke-width="2"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                />
            </g>
        </svg>
    );
};

export default ItalicLightningIcon;
