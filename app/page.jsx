import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="relative bg-[#4f46e5] w-full h-[348px] text-center text-[length:var(--font-size-base)] text-white">
        <div className="absolute w-[96.2%] h-12 text-5xl top-20 inset-x-[1.9%]">
          <h2 className="absolute top-[-5px] left-[calc(50%_-_271.97px)] leading-[48px] inline-block w-[543px]">
            Your Voice, Your Power
          </h2>
        </div>
        <div className="absolute w-[96.2%] h-8 text-2xl top-36 inset-x-[1.9%]">
          <p className="absolute left-[calc(50%_-_288.97px)] leading-8 inline-block w-[577px] top-0">
            Make informed decisions and vote with confidence
          </p>
        </div>
        <div className="absolute w-[96.2%] h-6 top-[200px] inset-x-[1.9%]">
          <p className="absolute left-[calc(50%_-_279.97px)] leading-6 inline-block w-[560px] top-0">
            Join the community of empowered voters using SV to make a
            difference.
          </p>
        </div>
        <div className="absolute left-[calc(50%_-_91.5px)] bg-white shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1),0_0_0#000,0_0_0#000] w-[180px] h-[43px] overflow-hidden cursor-pointer text-[#4f46e5] rounded-full top-[246px]">
          <button className="absolute left-[calc(50%_-_60px)] tracking-[0.5px] leading-5 uppercase inline-block w-[120px] top-2.5">
            <Link href="/auth">Get Started</Link>
          </button>
        </div>
      </section>

      <section className="relative bg-[#e0e0e0] w-full h-[391px] text-left text-[length:var(--font-size-base)] text-[#4b5563]">
        <div className="absolute w-[96.2%] h-20 text-center top-12 inset-x-[1.9%]">
          <header className="absolute w-full h-10 text-4xl text-black top-0 inset-x-0">
            <h3 className="absolute left-[calc(50%_-_161.97px)] leading-10 font-semibold inline-block w-[323px] -top-0.5">
              Why Choose SV?
            </h3>
          </header>
          <div className="absolute w-full h-6 top-14 inset-x-0">
            <p className="absolute left-[calc(50%_-_323.97px)] leading-6 inline-block w-[647px] top-0">
              SV provides a secure, and transparent platform for all your voting
              needs.
            </p>
          </div>
        </div>
        <div className="absolute h-[180px] w-[96.2%] top-44 inset-x-[1.9%]">
          <article className="absolute h-[180px] w-[31.6%] rounded-[5px] bg-white shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1),0_0_0#000,0_0_0#000] overflow-hidden left-0 right-[68.4%] top-0">
            <svg
              className="absolute overflow-hidden w-[87.5%] max-w-full h-9 top-6 inset-x-[6.25%]"
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.5641 7H12.8141V4.75C12.8141 2.13125 10.6828 0 8.06409 0C5.44534 0 3.31409 2.13125 3.31409 4.75V7H2.56409C1.73596 7 1.06409 7.67188 1.06409 8.5V14.5C1.06409 15.3281 1.73596 16 2.56409 16H13.5641C14.3922 16 15.0641 15.3281 15.0641 14.5V8.5C15.0641 7.67188 14.3922 7 13.5641 7ZM10.3141 7H5.81409V4.75C5.81409 3.50937 6.82346 2.5 8.06409 2.5C9.30471 2.5 10.3141 3.50937 10.3141 4.75V7Z"
                fill="#4F46E5"
              />
            </svg>
            <header className="absolute w-[87.5%] h-7 text-[length:var(--font-size-xl)] text-black top-[72px] inset-x-[6.25%]">
              <h2 className="absolute w-[40.48%] leading-7 font-semibold inline-block left-0 top-0">
                Secure Voting
              </h2>
            </header>
            <div className="absolute w-[87.5%] h-12 top-[108px] inset-x-[6.25%]">
              <p className="absolute w-[98.51%] leading-6 inline-block left-0 top-0.5">
                Your votes are encrypted and anonymous, ensuring your privacy
                and security.
              </p>
            </div>
          </article>
          <article className="absolute w-[31.6%] rounded-[5px] bg-white shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1),0_0_0#000,0_0_0#000] h-[180px] overflow-hidden left-[34.24%] right-[34.16%] top-0">
            <svg
              className="absolute overflow-hidden w-[87.5%] max-w-full h-9 top-6 inset-x-[6.25%]"
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_331_47337)">
                <path
                  d="M2.68662 7.1999C3.56912 7.1999 4.28662 6.4824 4.28662 5.5999C4.28662 4.7174 3.56912 3.9999 2.68662 3.9999C1.80412 3.9999 1.08662 4.7174 1.08662 5.5999C1.08662 6.4824 1.80412 7.1999 2.68662 7.1999ZM13.8866 7.1999C14.7691 7.1999 15.4866 6.4824 15.4866 5.5999C15.4866 4.7174 14.7691 3.9999 13.8866 3.9999C13.0041 3.9999 12.2866 4.7174 12.2866 5.5999C12.2866 6.4824 13.0041 7.1999 13.8866 7.1999ZM14.6866 7.9999H13.0866C12.6466 7.9999 12.2491 8.1774 11.9591 8.4649C12.9666 9.0174 13.6816 10.0149 13.8366 11.1999H15.4866C15.9291 11.1999 16.2866 10.8424 16.2866 10.3999V9.5999C16.2866 8.7174 15.5691 7.9999 14.6866 7.9999ZM8.28662 7.9999C9.83412 7.9999 11.0866 6.7474 11.0866 5.1999C11.0866 3.6524 9.83412 2.3999 8.28662 2.3999C6.73912 2.3999 5.48662 3.6524 5.48662 5.1999C5.48662 6.7474 6.73912 7.9999 8.28662 7.9999ZM10.2066 8.7999H9.99912C9.47912 9.0499 8.90162 9.1999 8.28662 9.1999C7.67162 9.1999 7.09662 9.0499 6.57412 8.7999H6.36662C4.77662 8.7999 3.48662 10.0899 3.48662 11.6799V12.3999C3.48662 13.0624 4.02412 13.5999 4.68662 13.5999H11.8866C12.5491 13.5999 13.0866 13.0624 13.0866 12.3999V11.6799C13.0866 10.0899 11.7966 8.7999 10.2066 8.7999ZM4.61412 8.4649C4.32412 8.1774 3.92662 7.9999 3.48662 7.9999H1.88662C1.00412 7.9999 0.286621 8.7174 0.286621 9.5999V10.3999C0.286621 10.8424 0.644121 11.1999 1.08662 11.1999H2.73412C2.89162 10.0149 3.60662 9.0174 4.61412 8.4649Z"
                  fill="#4F46E5"
                />
              </g>
              <defs>
                <clipPath id="clip0_331_47337">
                  <rect
                    width="16"
                    height="16"
                    fill="white"
                    transform="translate(0.286621)"
                  />
                </clipPath>
              </defs>
            </svg>
            <header className="absolute w-[87.5%] h-7 text-[length:var(--font-size-xl)] text-black top-[72px] inset-x-[6.25%]">
              <h2 className="absolute inline-block left-0 w-[53.27%] leading-7 font-semibold top-0">
                Community Driven
              </h2>
            </header>
            <div className="absolute w-[87.5%] h-12 top-[108px] inset-x-[6.25%]">
              <p class="absolute w-[87.5%] leading-6 inline-block left-0 top-0.5">
                A platform built for the people, by the people, empowering every
                voice.
              </p>
            </div>
          </article>
          <article className="absolute overflow-hidden w-[31.6%] rounded-[5px] bg-white shadow-[0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1),0_0_0#000,0_0_0#000] h-[180px] left-[68.4%] right-0 top-0">
            <svg
              className="absolute overflow-hidden w-[87.5%] max-w-full h-9 top-6 inset-x-[6.25%]"
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.8869 10H12.0869C12.2869 10 12.4869 9.8 12.4869 9.6V5.4C12.4869 5.2 12.2869 5 12.0869 5H10.8869C10.6869 5 10.4869 5.2 10.4869 5.4V9.6C10.4869 9.8 10.6869 10 10.8869 10ZM13.8869 10H15.0869C15.2869 10 15.4869 9.8 15.4869 9.6V2.4C15.4869 2.2 15.2869 2 15.0869 2H13.8869C13.6869 2 13.4869 2.2 13.4869 2.4V9.6C13.4869 9.8 13.6869 10 13.8869 10ZM4.88694 10H6.08694C6.28694 10 6.48694 9.8 6.48694 9.6V7.4C6.48694 7.2 6.28694 7 6.08694 7H4.88694C4.68694 7 4.48694 7.2 4.48694 7.4V9.6C4.48694 9.8 4.68694 10 4.88694 10ZM7.88694 10H9.08694C9.28694 10 9.48694 9.8 9.48694 9.6V3.4C9.48694 3.2 9.28694 3 9.08694 3H7.88694C7.68694 3 7.48694 3.2 7.48694 3.4V9.6C7.48694 9.8 7.68694 10 7.88694 10ZM15.9869 12H2.48694V2.5C2.48694 2.22375 2.26319 2 1.98694 2H0.986938C0.710688 2 0.486938 2.22375 0.486938 2.5V13C0.486938 13.5522 0.934751 14 1.48694 14H15.9869C16.2632 14 16.4869 13.7763 16.4869 13.5V12.5C16.4869 12.2237 16.2632 12 15.9869 12Z"
                fill="#4F46E5"
              />
            </svg>
            <header className="absolute w-[87.5%] h-7 text-[length:var(--font-size-xl)] text-black top-[72px] inset-x-[6.25%]">
              <h2 class="absolute w-[50.6%] leading-7 font-semibold inline-block left-0 top-0">
                Real-time Results
              </h2>
            </header>
            <div className="absolute w-[87.5%] h-12 top-[108px] inset-x-[6.25%]">
              <p className="absolute w-full leading-6 inline-block left-0 top-0.5">
                View voting outcomes as they happen with live updates and
                analytics.
              </p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
