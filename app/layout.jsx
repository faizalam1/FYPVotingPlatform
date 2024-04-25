import "@/styles/globals.css";

export const metadata = {
   title: "FYP Voting Platform App",
   description: "A voting platform app for general use",
};

export default function RootLayout({ children }) {
   return (
      <html lang="en">
         <body className="font-mono flex flex-col min-w-screen min-h-screen bg-white text-black">
            {children}
         </body>
      </html>
   );
}

