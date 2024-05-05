import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import EditCampaign from '@/components/Portal/Campaigns/EditCampaign';

const page = async ({ params }) => {
    return (
        <div className='flex-grow flex flex-col justify-center items-center w-full'>
            <EditCampaign campaignID={params.campaignID} />
        </div>
    )
}

export default page