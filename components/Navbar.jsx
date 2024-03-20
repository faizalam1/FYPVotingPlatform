import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="w-full relative bg-[#e8e8e8] h-[72px] text-left text-base text-gray-700 font-mono">
      <div className="absolute top-[calc(50%_-_19px)] left-[calc(50%_-_620.5px)] bg-white flex flex-col items-center justify-center cursor-pointer text-xl p-[5px] rounded-[5px] border-[0.5px] border-solid border-[#222]">
        <Link href="/" className="relative leading-7 font-semibold;">
          SV
        </Link>
      </div>
      <div className="absolute top-[calc(50%_-_20px)] left-[calc(50%_-_345.5px)] flex flex-row items-start justify-start gap-[0px_25px] text-gray-600">
        <div className="bg-white flex flex-row items-center justify-center cursor-pointer p-2 rounded-[10px] border-[0.5px] border-solid border-[#222]">
          <Link href="/" className="relative leading-6">
            Home
          </Link>
        </div>
        <div className="bg-white flex flex-row items-center justify-center cursor-pointer p-2 rounded-[10px] border-[0.5px] border-solid border-[#222]">
          <Link href="/about-us" className="relative leading-6">
            About
          </Link>
        </div>
        <div className="bg-white flex flex-row items-center justify-center cursor-pointer p-2 rounded-[10px] border-[0.5px] border-solid border-[#222]">
          <Link href="/contact-us" className="relative leading-6">
            Contact Us
          </Link>
        </div>
      </div>
      <ul className="absolute w-2/5 top-[calc(50%_-_20px)] h-10 left-[58.13%] right-[1.88%]">
        <li className="absolute w-[51.34%] bg-white shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_0px_0px_#000,0px_0px_0px_#000] box-border h-10 overflow-hidden cursor-pointer rounded-md border-[0.5px] border-solid border-[#222] left-[48.66%] right-[0%] top-0">
          <Link
            href="/auth"
            className="absolute w-[86.09%] tracking-[0.8px] leading-6 uppercase inline-block left-[6.96%] top-2"
          >
            Registration / Login
          </Link>
        </li>
        <li className="absolute w-[45.09%] bg-indigo-600 shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_0px_0px_#000,0px_0px_0px_#000] box-border h-10 overflow-hidden cursor-pointer text-white rounded-md border-[0.5px] border-solid border-[#222] left-[0%] right-[54.91%] top-0">
          <Link
            href="/access-campaign"
            className="absolute w-[84.16%] tracking-[0.8px] leading-6 uppercase inline-block left-[7.92%] top-2"
          >
            Access Campaign
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
