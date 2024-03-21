import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="py-4 flex flex-row justify-between px-4 bg-white w-full text-[length:var(--font-size-sm)] text-[#4b5563] shadow-[5px_5px_5px_5px_rgb(203,208,209)]">
      <div className="">
        <p className="leading-5 inline-block">
          © 2024 SV. All Rights Reserved.
        </p>
      </div>
      <div className="flex flex-row space-x-2">
        <p className="leading-5 inline-block">
          Made With
        </p>
        <Image src="/assets/icons/heart.svg" alt="Heart" width={16} height={16} />
        <p className="leading-5 inline-block">
          by SV Team
        </p>
      </div>
    </footer>
  );
};

export default Footer;
