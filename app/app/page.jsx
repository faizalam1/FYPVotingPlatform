import Link from "next/link";
import Card from "@/components/Card";

export default function Home() {
  return (
    <>
      <section className="py-4 flex flex-col justify-center space-y-8 bg-[#4f46e5] w-full text-[length:var(--font-size-base)] text-white">
        <div className="flex justify-center w-full text-5xl">
          <h2 className="leading-[48px]">Your Voice, Your Power</h2>
        </div>
        <div className="flex justify-center w-full text-2xl">
          <p className="leading-8">
            Make informed decisions and vote with confidence
          </p>
        </div>
        <div className="flex justify-center w-full">
          <p className="leading-6">
            Join the community of empowered voters using SV to make a
            difference.
          </p>
        </div>
        <button className="m-auto bg-white hover:underline shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1),0_0_0#000,0_0_0#000] cursor-pointer text-[#4f46e5] rounded-full p-3 tracking-[0.5px] leading-5 uppercase">
          <Link href="/app/auth">Get Started</Link>
        </button>
      </section>

      <section className="flex flex-col p-4 bg-[#e0e0e0] w-full text-left text-[length:var(--font-size-base)] text-[#4b5563]">
        <div className="text-center">
          <header className="m-4 w-full text-4xl text-black">
            <h3 className="leading-10 font-semibold inline-block">
              Why Choose SV?
            </h3>
          </header>
          <div className="m-4 w-full">
            <p className="leading-6 inline-block">
              SV provides a secure, and transparent platform for all your voting
              needs.
            </p>
          </div>
        </div>
        <div className="flex flex-row space-x-12 p-8">
          <Card
            imageSrc="/assets/icons/lock.svg"
            heading="Secure Voting"
            content="Your votes are encrypted and anonymous, ensuring your privacy and security."
          />

          <Card
            imageSrc="/assets/icons/people.svg"
            heading="Community Driven"
            content="A platform built for the people, by the people, empowering every voice."
          />

          <Card
            imageSrc="/assets/icons/analysis.svg"
            heading="Real-time Results"
            content="View voting outcomes as they happen with live updates and analytics."
          />
        </div>
      </section>
    </>
  );
}
