import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";


const CampaignsPage = async () => {
    const session = await getServerSession(authOptions);
    if (!session)
        redirect("/app/auth");
    else{
        redirect(`/portal/campaigns/${session.user.username}`)
    }
    return (
        <>
        </>
    )
}

export default CampaignsPage