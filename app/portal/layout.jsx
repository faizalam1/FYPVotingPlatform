import Provider from "@/components/Portal/Provider";
import PortalNavbar from "@/components/Portal/PortalNavbar";
import PortalFooter from "@/components/Portal/PortalFooter";
import "@/styles/globals.css";

export const metadata = {
  title: "FYP Voting Platform Portal",
  description: "Portal for Voting Campaigns",
};

export default function PortalLayout({ children }) {
  return (
    <html lang="en" className="min-w-screen">
      <body className="font-mono flex flex-col min-w-screen min-h-screen bg-white text-black">
        <Provider>
          <header>
            <PortalNavbar />
          </header>
          <main className="flex-grow flex items-stretch justify-stretch">{children}</main>
          <PortalFooter />
        </Provider>
      </body>
    </html>
  );
}
