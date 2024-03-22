import Provider from "@/components/Portal/Provider";
import Navbar from "@/components/Portal/Navbar";
import Footer from "@/components/Portal/Footer";

export const metadata = {
  title: "FYP Voting Platform Portal",
  description: "Portal for Voting Campaigns",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="w-screen">
      <body className="font-mono w-screen">
        <Provider>
          <header>
            <Navbar />
          </header>
          {children}
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
