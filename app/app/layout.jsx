import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "@/styles/globals.css";

export const metadata = {
  title: "FYP Voting Platform App",
  description: "A voting platform app for general use",
};

export default function AppLayout({ children }) {
  return (
    <html lang="en" className="min-w-screen bg-white text-black">
      <body className="font-mono flex flex-col min-w-screen min-h-screen bg-white text-black">
        <header>
          <Navbar />
        </header>
        <main className="flex-grow">
        {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
