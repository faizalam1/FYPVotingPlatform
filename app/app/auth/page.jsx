import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Signin from "@/components/Signin";
import Signup from "@/components/Signup";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const Auth = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/portal")
  }


  return (
    <main className="flex flex-row justify-center w-full h-fit space-x-16 bg-[#f3f4f6] text-black p-5 font-sans">
        <section className="bg-white p-4 rounded-2xl space-y-4 w-96">
            <Signin />
        </section>
        <section className="bg-white p-4 rounded-2xl space-y-4 w-96">
            <Signup />
        </section>
    </main>
  )
}

export default Auth