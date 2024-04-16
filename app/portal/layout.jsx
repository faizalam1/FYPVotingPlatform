import Provider from "@/components/Portal/Provider";
import PortalNavbar from "@/components/Portal/PortalNavbar";
import PortalFooter from "@/components/Portal/PortalFooter";

export const metadata = {
  title: "FYP Voting Platform Portal",
  description: "Portal for Voting Campaigns",
};

export default function PortalLayout({ children }) {
  return (
    <html lang="en" className="w-screen">
      <body className="font-mono w-screen bg-white text-black">
        <Provider>
          <header>
            <PortalNavbar />
          </header>
          {children}
          <PortalFooter />
        </Provider>
      </body>
    </html>
  );
}
