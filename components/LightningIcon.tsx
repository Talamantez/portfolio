// LightningIcon.tsx

const LightningIcon = ({ width = 30, height = 30, fill = "#FFD700", stroke = "#FFA500" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width={width} height={height}>
      <path 
        d="M65 5 L35 40 L50 40 L30 95 L75 50 L55 50 L75 5 Z" 
        fill={fill}
        stroke={stroke}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default LightningIcon;

// Usage example:
// import LightningIcon from './LightningIcon';
// 
// function App() {
//   return (
//     <div>
//       <LightningIcon width={50} height={50} fill="#FF0000" stroke="#000000" />
//     </div>
//   );
// }