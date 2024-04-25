import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route";

const RedirectPage = async () => {
  const session = await getServerSession(authOptions);
  if (session)
    redirect("/portal");
  else
    redirect("/app");  
  return (
    <>
    </>
  )
}

export default RedirectPage