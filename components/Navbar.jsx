import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex flex-row justify-between py-2 px-4 w-full bg-[#e8e8e8] text-left text-base text-gray-700">
      <Link href="/" className="leading-7 font-semibold;">
        <div className="bg-white flex flex-col items-center justify-center cursor-pointer text-xl p-3 rounded-[5px] border-[0.5px] border-solid border-[#222]">
          SV
        </div>
      </Link>
      <div className="flex flex-row space-x-6 text-gray-600">
        <Link href="/" className="leading-6">
          <div className="hover:underline bg-white flex flex-row items-center justify-center cursor-pointer p-3 rounded-xl border-[0.5px] border-solid border-[#222]">
            Home
          </div>
        </Link>
        <Link href="/about" className="leading-6">
          <div className="hover:underline bg-white flex flex-row items-center justify-center cursor-pointer p-3 rounded-xl border-[0.5px] border-solid border-[#222]">
            About
          </div>
        </Link>
        <Link href="/contact" className="leading-6">
          <div className="hover:underline bg-white flex flex-row items-center justify-center cursor-pointer p-3 rounded-xl border-[0.5px] border-solid border-[#222]">
            Contact Us
          </div>
        </Link>
      </div>
      <ul className="flex flex-row space-x-6">
        <Link
          href="/auth"
          className="tracking-[0.8px] leading-6 uppercase inline-block"
        >
          <li className="hover:underline bg-white flex flex-row items-center justify-center cursor-pointer p-3 rounded-xl shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_0px_0px_#000,0px_0px_0px_#000] box-border border-[0.5px] border-solid border-[#222]">
            Registration / Login
          </li>
        </Link>
        <Link
          href="/access-campaign"
          className="tracking-[0.8px] leading-6 uppercase inline-block"
        >
          <li className="hover:underline bg-indigo-600 flex flex-row items-center justify-center cursor-pointer p-3 rounded-xl shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_0px_0px_#000,0px_0px_0px_#000] box-border text-white border-[0.5px] border-solid border-[#222]">
            Access Campaign
          </li>
        </Link>
      </ul>
    </nav>
  );
};

export default Navbar;
