import Signin from "@/components/Signin";
import Signup from "@/components/Signup";

const Auth = () => {
  return (
    <main className="flex flex-row justify-center w-full space-x-0 bg-[#f3f4f6] text-black p-4">
        <section className="bg-white p-4 rounded-2xl">
            <Signin />
        </section>
        <section className="bg-gray-50 p-4 rounded-2xl">
            <Signup />
        </section>
    </main>
  )
}

export default Auth