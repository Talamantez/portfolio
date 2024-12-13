import { useEffect } from "preact/hooks";
import { AlertCircle, CheckCircle, X, XCircle } from "npm:lucide-react";

const Toast = () => {
// const Toast = ({ message = "heya!", type = "success", duration = 3000 }) => {
//   console.log("in Toast");
  // useEffect(() => {
  //   if (duration) {
  //     const timer = setTimeout(() => {
        
  //     }, duration);
  //     return () => clearTimeout(timer);
  //   }
  // }, [duration]);

  // const icons = {
  //   success: <CheckCircle className="w-5 h-5 text-green-500" />,
  //   error: <XCircle className="w-5 h-5 text-red-500" />,
  //   info: <AlertCircle className="w-5 h-5 text-blue-500" />,
  // };

  // const bgColors = {
  //   success: "bg-green-50 border-green-200",
  //   error: "bg-red-50 border-red-200",
  //   info: "bg-blue-50 border-blue-200",
  // };

  return (
    <>
    <div
      className={`fixed top-4 right-4 flex items-center p-4 space-x-3 border rounded-lg shadow-lg`}
    >
      <p className="text-gray-700">boo!</p>
      <button
        className="p-1 hover:bg-gray-100 rounded-full"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </div>
    </>
  );
};

export default Toast;
