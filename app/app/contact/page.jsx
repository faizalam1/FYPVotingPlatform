"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const Contact = () => {
  const [href, setHref] = useState("/");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (name.length > 0 && subject.length > 0 && message.length > 0) {
      setHref(
        `mailto:info@example.com?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(message + "\n\nFrom\n" + name)}`
      );
    }
  }, [name, subject, message]);
  return (
    <main className="p-4 flex flex-col justify-center items-center bg-[#f3f4f6] text-black">
      <h1 className="text-3xl font-semibold m-8">Contact Us</h1>
      <section className="flex flex-row justify-between space-x-8">
        <article className="bg-white p-8 rounded-lg">
          <h3 className="text-xl font-semibold">Send us a message</h3>
          <form className="flex flex-col space-y-4">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 border rounded-lg border-gray-300"
              required
            />
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="p-2 border rounded-lg border-gray-300"
              required
            />
            <label htmlFor="message">Message</label>
            <textarea
              name="message"
              placeholder="Message"
              className="p-2 rounded-xl border border-gray-300"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
            <button
              type="button"
              className="p-2 bg-black rounded-xl text-white"
            >
              <Link href={href}>Send</Link>
            </button>
          </form>
        </article>
        <article className="bg-white p-8 rounded-lg h-fit">
          <h3 className="text-xl font-semibold p-2">Contact Information</h3>
          <p className="p-2 text-sm">
            Feel free to get in touch with us via the following methods:
          </p>
          <div className="flex flex-col items-start px-3">
          <div className="flex items-center">
            <Image
              src="/assets/icons/email.png"
              width={24}
              height={24}
              alt="Email"
            />
            <a href="mailto:info@example.com" className="text-[#4f46e5]">
              info@example.com
            </a>
          </div>
          <div className="flex items-center">
            <Image
              src={"/assets/icons/phone.png"}
              alt="Phone"
              width={24}
              height={24}
            />
            <a href="tel:+92123456789" className="text-[#4f46e5]">
              +92 123 456 789
            </a>
          </div>
          <div className="flex items-center">
            <Image
              src={"/assets/icons/location.png"}
              alt="Location"
              width={24}
              height={24}
            />
            <p className="">123 Business Ave, City, Country</p>
          </div>
        </div>
        </article>
      </section>
    </main>
  );
};

export default Contact;
