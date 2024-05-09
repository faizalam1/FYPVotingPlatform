import EditCampaign from '@/components/Portal/Campaigns/EditCampaign';

const EditCampaignpage = async ({ params }) => {
    return (
        <div className='flex-grow flex flex-col justify-center items-center w-full'>
            <EditCampaign campaignID={params.campaignID} />
        </div>
    )
}

export default EditCampaignpage