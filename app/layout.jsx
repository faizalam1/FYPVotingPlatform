import Navbar from "@/components/Navbar";
import "./globals.css";
import Footer from "@/components/Footer";

export const metadata = {
  title: "FYP Voting Platform App",
  description: "A voting platform app for general use",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="w-screen">
      <body className="font-mono w-screen">
        <header>
          <Navbar />
        </header>
        {children}
        <Footer />
      </body>
    </html>
  );
}