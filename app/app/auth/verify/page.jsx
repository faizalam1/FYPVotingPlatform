import Verify from "@/components/Verify"

const VerifyPage = () => {
  return (
    <main className="flex flex-row justify-center w-full h-screen space-x-16 bg-[#f3f4f6] text-black p-8 font-sans">    
    <section className="bg-white p-4 rounded-2xl space-y-7 w-96">
        <Verify />
      </section>
    </main>
  )
}

export default VerifyPage;