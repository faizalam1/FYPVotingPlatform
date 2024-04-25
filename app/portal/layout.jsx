import Provider from "@/components/Portal/Provider";
import PortalNavbar from "@/components/Portal/PortalNavbar";
import PortalFooter from "@/components/Portal/PortalFooter";


export const metadata = {
  title: "FYP Voting Platform Portal",
  description: "Portal for Voting Campaigns",
};

export default function PortalLayout({ children }) {
  return (
    <Provider>
      <header>
        <PortalNavbar />
      </header>
      <main className="flex-grow flex items-stretch justify-stretch">{children}</main>
      <PortalFooter />
    </Provider>

  );
}
