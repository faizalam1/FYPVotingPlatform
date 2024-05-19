import Result from "@/components/Portal/Campaigns/Result"

const ResultPage = ({ params }) => {
  const { campaignID } = params
  return (
    <Result campaignID={campaignID} />
  )
}

export default ResultPage