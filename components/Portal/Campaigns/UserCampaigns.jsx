'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"


const UserCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const fetchCampaigns = async () => {
      const response = await fetch('/api/portal/campaigns/listUserCampaigns');
      if (response.status == 200) {
        const data = await response.json();
        setCampaigns(data);
      }
      else if (response.status == 204) {
        alert("No campaigns found");
        setCampaigns([]);
      }
      else if (response.status == 401) {
        alert("Unauthorized");
      }
      else {
        alert("Error fetching campaigns");
      }
    }
    fetchCampaigns();
  }, [])

  return (
    <div className="flex-grow flex flex-col bg-[#F3F4F6] p-8 space-y-12">
      <h1 className="text-2xl font-bold">Your Voting Campaigns</h1>
      <div className="flex justify-between items-center mt-4 space-x-16">
        <div className="bg-white rounded-2xl p-6 w-1/4">
          <p className="text-lg font-semibold">Total Campaigns</p>
          <p className="text-xl p-1">{campaigns.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 w-1/4">
          <p className="text-lg font-semibold">Active Campaigns</p>
          <p className="text-xl p-1">{campaigns.filter(
            campaign => {
              return new Date(campaign.endDateTime) > new Date() && new Date(campaign.startDateTime) < new Date();
            }
          ).length}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 w-1/4">
          <p className="text-lg font-semibold">Ended Campaigns</p>
          <p className="text-xl p-1">{campaigns.filter(
            campaign => {
              return new Date(campaign.endDateTime) < new Date();
            }
          ).length}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 w-1/4">
          <p className="text-lg font-semibold">Upcoming Campaigns</p>
          <p className="text-xl p-1">{campaigns.filter(
            campaign => {
              return new Date(campaign.startDateTime) > new Date();
            }
          ).length}</p>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex flex-row text-gray-600 p-4">
          <p className="w-1/6">CAMPAIGN NAME</p>
          <p className="w-1/6">STATUS</p>
          <p className="w-1/6">VOTING TYPE</p>
          <p className="w-1/6">START DATE</p>
          <p className="w-1/6">END DATE</p>
          <p className="w-1/5"></p>
        </div>

        {campaigns.map(campaign => (
          <div key={campaign._id} className="flex flex-row justify-between items-center bg-white rounded-lg p-4">
            <p className="w-1/6">{campaign.name}</p>
            <div className="w-1/6">
              {new Date(campaign.endDateTime) > new Date() && new Date(campaign.startDateTime) < new Date() ?
                (
                  <div className="p-2 rounded-3xl bg-[#BBF7D0] text-[#14532D] font-semibold w-fit">Active</div>
                )
                : new Date(campaign.startDateTime) > new Date() ?
                  (
                    <div className="p-2 rounded-3xl bg-[#1FAEFF] bg-opacity-40 text-[#08A4FC] w-fit">Upcoming</div>
                  )
                  :
                  (
                    <div className="p-2 rounded-3xl bg-[#ffaa98] text-[#74451c] font-semibold w-fit">Ended</div>
                  )
              }
            </div>
            <p className="w-1/6">{campaign.votingType}</p>
            <p className="w-1/6">{new Date(campaign.startDateTime).toLocaleDateString()}</p>
            <p className="w-1/6">{new Date(campaign.endDateTime).toLocaleDateString()}</p>
            <span className="w-1/5 flex justify-between">
              <button
                className="text-[#2563EB]"
                onClick={() => {
                  navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}/portal/vote/${campaign._id}`);
                }}
              >
                Copy Voting Link
              </button>
              <button className="text-[#2563EB] ml-4" onClick={() => {
                router.push(`/portal/campaigns/edit/${campaign._id}`);
                router.refresh();
              }}>Edit</button>
              <button className="text-[#F87171] ml-4" onClick={async ()=>{
                const res = await fetch(`/api/portal/campaigns/deleteCampaign?id=${campaign._id}`, {
                  method: 'DELETE',
                });
                if (res.status == 200) {
                  alert("Campaign deleted successfully!");
                }
                else if (res.status == 404) {
                  alert("Campaign not found!");
                }
                else if (res.status == 401) {
                  alert("Unauthorized!");
                }
                else {
                  alert("Failed to delete campaign");
                }
                router.push('/portal/campaigns')
                router.refresh()
              }}>Delete</button>
              <button className="text-[#FBBF24] ml-4" onClick={() => {
                router.push(`/portal/result/${campaign._id}`)
                router.refresh();
              }}
              >Results</button>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserCampaigns