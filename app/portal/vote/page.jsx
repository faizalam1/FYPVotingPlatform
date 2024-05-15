'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const VoteCampaignSearchPage = () => {
  
  const [campaignId, setCampaignId] = useState('')

  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    router.push(`/portal/vote/${campaignId}`)
    router.refresh()
  }

  return (
    <div className="flex flex-col justify-center items-center p-16 m-auto space-y-4">
        <h1 
            className="text-2xl font-bold text-center"
        >
            Campaign To Vote
        </h1>
        <input 
            type="text"
            placeholder="Campaign ID"
            className="border border-gray-300 rounded-lg p-2"
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
        />
        <button
            className="bg-blue-500 text-white p-2 rounded-lg mt-4"
            onClick={handleSubmit}
        >
            Vote
        </button>
    </div>
  )
}

export default VoteCampaignSearchPage