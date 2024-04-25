import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function AppLayout({ children }) {
    return (
        <>
            <header>
                <Navbar />
            </header>
            <main className="flex-grow flex flex-col">
                {children}
            </main>
            <Footer />
        </>
    )
}