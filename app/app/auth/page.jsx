import Signin from "@/components/Signin";
import Signup from "@/components/Signup";

const Auth = () => {
  return (
    <div className="flex flex-row justify-center w-full min-h-[82vh] space-x-16 bg-[#f3f4f6] text-black p-8">
        <section className="bg-white p-4 rounded-2xl flex-grow">
            <Signin />
        </section>
        <section className="bg-white p-4 rounded-2xl flex-grow">
            <Signup />
        </section>
    </div>
  )
}

export default Auth