import Image from "next/image";

const Card = ({ imageSrc, imageSize=24, heading, content, width=0 }) => {
  let widthCss = "";
  if (width > 0) {
    widthCss = `w-${width}`;
  }
  else{
    widthCss = ``;
  }
  return (
    <article className={`${widthCss} py-12 px-6 flex flex-col items-center text-justify justify-center rounded-[5px] bg-white shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1),0_0_0#000,0_0_0#000]`}>
      <Image src={imageSrc} alt={imageSrc} width={imageSize} height={imageSize} />
      <header className="text-black">
        <h2 className="font-semibold text-lg">{heading}</h2>
      </header>
        <p className="inline-block text-base">{content}</p>
    </article>
  );
};

export default Card;
