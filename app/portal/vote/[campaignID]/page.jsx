import Vote from "@/components/Portal/Vote"

const VotePage = ({ params }) => {
  const { campaignID } = params

  return (
    <Vote campaignID={campaignID} />
  )
}

export default VotePage