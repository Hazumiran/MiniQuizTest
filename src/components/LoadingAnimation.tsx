import React from "react";

interface LoadingAnimationProps {
  size?: number;
  color?: string;
  className?: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  size = 120,
  color = "#0F00FF",
  className = "",
}) => {
  return (
    <div
      className={`flex justify-center items-center ${className} absolute top-0 left-0 right-0 bottom-0 flex-1 pl-0 md:pl-64`}
      style={{ width: "100%", height: "100%" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        width={size}
        height={size}
      >
        <circle fill={color} stroke={color} strokeWidth="15" r="15" cx="40" cy="100">
          <animate
            attributeName="opacity"
            calcMode="spline"
            dur="2s"
            values="1;0;1;"
            keySplines=".5 0 .5 1;.5 0 .5 1"
            repeatCount="indefinite"
            begin="-.4s"
          />
        </circle>
        <circle fill={color} stroke={color} strokeWidth="15" r="15" cx="100" cy="100">
          <animate
            attributeName="opacity"
            calcMode="spline"
            dur="2s"
            values="1;0;1;"
            keySplines=".5 0 .5 1;.5 0 .5 1"
            repeatCount="indefinite"
            begin="-.2s"
          />
        </circle>
        <circle fill={color} stroke={color} strokeWidth="15" r="15" cx="160" cy="100">
          <animate
            attributeName="opacity"
            calcMode="spline"
            dur="2s"
            values="1;0;1;"
            keySplines=".5 0 .5 1;.5 0 .5 1"
            repeatCount="indefinite"
            begin="0s"
          />
        </circle>
      </svg>
    </div>
  );
};

export default LoadingAnimation;
