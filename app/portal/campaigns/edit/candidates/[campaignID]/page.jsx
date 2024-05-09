import EditCandidates from "@/components/Portal/Campaigns/EditCandidates";

const EditCandidatesPage = async ({ params }) => {
    return (
        <div className="flex-grow flex flex-col justify-center items-center w-full">
            <EditCandidates campaignID={params.campaignID} />
        </div>
    )

}

export default EditCandidatesPage;