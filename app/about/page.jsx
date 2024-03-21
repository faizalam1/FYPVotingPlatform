import Image from "next/image";
import Card from "@/components/Card";

const About = () => {
  return (
    <main className="flex flex-col items-start relative bg-gray-100 w-full justify-start text-center text-[32px] text-gray-600">
      <section className="bg-white shadow-[0_1px_2px_-1px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.1),0_0_0#000,0_0_0#000] w-full text-gray-800">
        <div className="w-full">
          <header className="w-full">
            <h2 className="py-6 m-auto leading-7 font-bold inline-block">
              About Us
            </h2>
          </header>
        </div>
      </section>

      <section className="inline-block w-full">
        <article className="flex flex-col justify-center items-center py-4">
          <header className="text-gray-800 text-3xl font-semibold inline-block">
            <h2>Who We Are</h2>
          </header>
          <p className="w-full px-[30%] py-4 leading-4 text-black text-justify inline-block text-base ">
            Safe Vote is envisioned as a web-based, ranking-oriented voting
            system designed to cater to diverse voting requirements such as
            elections, evaluations, and decision-making processes. The voting
            scenarios that the system supports go beyond political elections and
            include voting in corporations, unions, and educational
            institutions. It ensures transparency, security, and accessibility
            in the electoral process by using blockchain as a database, offering
            a scalable and user-friendly platform. The software aims to
            transform decision-making by offering a flexible, adaptive, and
            intuitive framework.
          </p>
        </article>
      </section>

      <section className="flex flex-col items-center justify-center box-border bg-white w-full text-[length:var(--font-size-sm)] px-16 py-12">
        <header className="text-2xl font-bold text-gray-800 leading-8">
          <h2>Meet Our Team</h2>
        </header>
        <div className="flex flex-row items-center justify-center space-x-8 w-full">
          <Card
            imageSrc={"/assets/images/profilepic.svg"}
            imageSize={128}
            heading="Fauzan Azhar"
            content="Group Leader"
          />
          <Card
            imageSrc={"/assets/images/profilepic.svg"}
            imageSize={128}
            heading="Bilal Uddin"
            content="Group Member"
          />
          <Card
            imageSrc={"/assets/images/profilepic.svg"}
            imageSize={128}
            heading="Yasir Ali"
            content="Group Member"
          />
        </div>
      </section>
    </main>
  );
};

export default About;
