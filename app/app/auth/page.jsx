import Signin from "@/components/Signin";
import Signup from "@/components/Signup";

const Auth = () => {
  return (
    <main className="flex flex-row justify-center w-full h-fit space-x-16 bg-[#f3f4f6] text-black p-5 font-sans">
        <section className="bg-white p-4 rounded-2xl space-y-7 w-96">
            <Signin />
        </section>
        <section className="bg-white p-4 rounded-2xl space-y-4 w-96">
            <Signup />
        </section>
    </main>
  
  )
}

export default Auth