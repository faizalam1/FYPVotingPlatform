import React from "react";

const Footer = () => {
  return (
    <footer className="relative bg-white w-full h-[65px] text-[length:var(--font-size-sm)] text-[#4b5563] shadow-[5px_5px_5px_5px_rgb(203,208,209)]">
      <div className="absolute w-[18.19%] top-[calc(50%_-_9.5px)] h-5 left-[2.65%] right-[79.16%]">
        <p className="absolute w-[100.45%] top-[calc(50%_-_10px)] leading-5 inline-block left-0 ">
          © 2024 SV. All Rights Reserved.
        </p>
      </div>
      <div className="absolute w-[14.9%] top-[calc(50%_-_9.5px)] h-5 left-[84%] right-[1.11%]">
        <p className="absolute w-[40.33%] top-[calc(50%_-_10px)] leading-5 inline-block left-0">
          Made With
        </p>
        <svg
          className="absolute left-[calc(50%_-_24px)] w-4 h-4 overflow-hidden top-[3px]"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_3_10)">
            <path
              d="M14.4473 1.95625C12.7348 0.496875 10.1879 0.759375 8.61601 2.38125L8.00038 3.01562L7.38476 2.38125C5.81601 0.759375 3.26601 0.496875 1.55351 1.95625C-0.408992 3.63125 -0.512117 6.6375 1.24413 8.45312L7.29101 14.6969C7.68163 15.1 8.31601 15.1 8.70663 14.6969L14.7535 8.45312C16.5129 6.6375 16.4098 3.63125 14.4473 1.95625Z"
              fill="#DC2626"
            />
          </g>
          <defs>
            <clipPath id="clip0_3_10">
              <rect width="16" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <p className="absolute w-[50.83%] top-[calc(50%_-_10px)] leading-5 inline-block left-[49.72%]">
          by SV Team
        </p>
      </div>
    </footer>
  );
};

export default Footer;
