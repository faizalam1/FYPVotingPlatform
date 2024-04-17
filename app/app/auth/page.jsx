import Signin from "@/components/Signin";
import Signup from "@/components/Signup";

const Auth = () => {
  return (
<<<<<<< Updated upstream
    <div className="flex flex-row justify-center w-full min-h-[82vh] space-x-16 bg-[#f3f4f6] text-black p-8">
        <section className="bg-white p-4 rounded-2xl flex-grow">
            <Signin />
        </section>
        <section className="bg-white p-4 rounded-2xl flex-grow">
=======
    <main className="flex flex-row justify-center w-full h-fit space-x-16 bg-[#f3f4f6] text-black p-5 font-sans">
        <section className="bg-white p-4 rounded-2xl space-y-7 w-96">
            <Signin />
        </section>
        <section className="bg-white p-4 rounded-2xl space-y-4 w-96">
>>>>>>> Stashed changes
            <Signup />
        </section>
    </div>
  )
}

export default Auth