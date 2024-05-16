'use client'
import { useState, useEffect } from "react"
import Countdown from "react-countdown"
import { useRouter } from "next/navigation"
import Image from "next/image"

const Vote = ({ campaignID }) => {
    const [campaign, setCampaign] = useState(null)
    const [candidates, setCandidates] = useState([])
    const [candidateImages, setCandidateImages] = useState({})
    const [vote, setVote] = useState(null)
    const [secret, setSecret] = useState("")

    const router = useRouter()

    useEffect(() => {
        const fetchCampaign = async () => {
            const res = await fetch(`/api/portal/vote/getCampaign?id=${campaignID}`)
            if (res.status == 200){
                const data = await res.json()
                const fetchedCampaign = {
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    votingType: data.votingType,
                    startDateTime: new Date(data.startDateTime),
                    endDateTime: new Date(data.endDateTime),
                }
                setCampaign(fetchedCampaign)
                return fetchedCampaign
            }
            else{
                alert(res.status + "\n" + res.error)
                router.push("/portal/campaigns")
                router.refresh()
            }
            
        }
        const fetchCandidateImage = async (url) => {
            if (!url) return null
            const res = await fetch(`/api/portal/campaigns/candidates/getCandidateImage?url=${encodeURIComponent(url)}`)
            const data = await res.json()
            if (data.error) {
                console.error(data.error)
                return
            }
            return data.base64
        }
        const fetchCandidates = async (campaignResult) => {
            const res = await fetch(`/api/portal/vote/getCandidates?id=${campaignID}`)
            if (res.status != 200){
                alert(res.status + "\n" + res.error)
                router.push("/portal/campaigns")
                router.refresh()
            }
            let data = await res.json()
            data.candidates.forEach(async (candidate, index) => {
                let image = await fetchCandidateImage(candidate.image)
                candidate.imagebase64 = image ? "data:image;base64," + image: null
                setCandidateImages((prev) => {
                    return {
                        ...prev,
                        [candidate.image]: candidate.imagebase64
                    }
                })
                
                if (campaignResult.votingType == "Ranked"){
                    setVote((prev) => {
                        return {
                            ...prev,
                            [candidate.name]: index+1
                        }
                    })
                }
            });
            setCandidates(data.candidates)
        }
        const fetchData = async () => {
            let campaignResult = await fetchCampaign()
            await fetchCandidates(campaignResult)    
        }
        fetchData()
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campaignID])

    useEffect(() => {
        console.log(vote)
    },[vote])

    const handleVote = async () => {
        if (campaign.votingType == "Default"){
            let candidateID = null;
            candidates.forEach((candidate) => {
                if (vote == candidate.name){
                    candidateID = candidate.id
                }
            })
            if (candidateID == null){
                alert("Vote candidate not found!")
                return
            }
            const res = await fetch(`/api/portal/vote/voteDefault`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    campaignID: campaign.id,
                    candidateID: candidateID,
                    secret: secret
                })
            })
            if (res.status == 200){
                alert("Vote Successful!")
                router.push("/portal/campaigns")
                router.refresh()
            }
            else{
                const data = await res.json()
                alert(res.status + "\n" + data.error)
            }
        }
        else if (campaign.votingType == "Ranked"){
            let voteArray = []
            let rankArray = []
            candidates.forEach((candidate) => {
                Object.keys(vote).forEach((key) => {
                    rankArray.push(vote[key])
                    if (key == candidate.name){
                        voteArray.push({ candidateID: candidate.id, rank: vote[key]})
                    }
                })
            })
            for (let i = 1; i <= candidates.length; i++){
                if (!rankArray.includes(i)){
                    alert("Rank " + i + " is missing!")
                    return
                }
            }
            const res = await fetch(`/api/portal/vote/voteRanked`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    campaignID: campaign.id,
                    rankedVote: voteArray,
                    secret: secret
                })
            })
            if (res.status == 200){
                alert("Vote Successful!")
                router.push("/portal/campaigns")
                router.refresh()
            }
            else{
                const data = await res.json()
                alert(res.status + "\n" + data.error)
            }
        }
    }

    return (
        <div
            className="flex flex-col flex-grow items-center p-16 space-y-4 bg-[#f3f4f6]"
        >
            <div
                className="flex flex-col justify-around items-center space-y-4 bg-white p-8 rounded-2xl w-2/3 h-full"
            >
                {campaign && (
                    <div
                        className="flex flex-col items-center space-y-4 w-full"
                    >
                        <h1
                            className="text-2xl font-bold text-center"
                        >{campaign.name}</h1>
                        <p
                            className="text-center"
                        >{campaign.description}</p>
                    </div>
                )}
                {Date.now() < campaign?.startDateTime &&
                    <div
                        className="flex flex-col items-center space-y-4"
                    >
                        <p
                            className="text-center text-blue-500"
                        >Campaign has not started yet!</p>
                        <div
                            className="text-center text-blue-600 text-3xl"
                        >
                            <Countdown
                                date={campaign?.startDateTime}
                                onComplete={() => router.refresh()}
                            />
                        </div>
                    </div>}
                {Date.now() > campaign?.endDateTime &&
                    <p
                        className="text-center text-red-500"
                    >
                        Campaign has ended!
                    </p>
                }
                {
                    Date.now() >= campaign?.startDateTime &&
                    Date.now() <= campaign?.endDateTime &&
                    <div
                        className="flex flex-col items-center space-y-4 w-3/4"
                    >
                        <p
                            className="text-center text-green-500"
                        >
                            Campaign is active!
                        </p>
                        <div
                            className="text-center text-green-400 text-3xl"
                        >
                            <Countdown
                                date={campaign?.endDateTime}
                                onComplete={() => router.refresh()}
                            />
                        </div>
                        <div>
                            <h2
                                className="text-xl font-bold text-center"
                            >Candidates</h2>
                        </div>
                        {
                            candidates.map((candidate, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col space-y-4 w-full px-24"
                                >
                                    <p
                                        className="font-semibold"
                                    >{candidate.name}</p>
                                    <p
                                        className=""
                                    >{candidate.description}</p>
                                    <div
                                        className="flex"
                                        >
                                    <Image
                                        src={candidateImages[candidate.image] ? candidateImages[candidate.image]: "/assets/icons/loading.svg"}
                                        alt={candidate.name}
                                        width={64}
                                        height={64}
                                        className="rounded-full"
                                        />
                                    </div>
                                    {candidate.additionalFields.map((field, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between w-full"
                                        >
                                            <p
                                                className="font-medium"
                                            >{field.name}</p>
                                            <p>:</p>
                                            <p
                                                className=""
                                            >{field.value}</p>
                                        </div>
                                    ))}
                                </div>
                            ))
                        }
                    <h3
                        className="text-xl font-bold text-center"
                    >Vote</h3>
                    {campaign?.votingType === "Default" &&
                    <div
                        className="flex flex-col items-center space-y-4 w-full px-24"
                    >
                        <div className="flex justify-between w-full">
                            <p
                                className="font-semibold px-4"
                            >Choose Candidate</p>
                        </div>
                        <div onChange={(e)=> setVote(e.target.value)}>
                        {
                            candidates.map((candidate, index) => (
                                <div key={index} className="flex justify-between w-full">
                                <label
                                    htmlFor={candidate.name}
                                    className="p-2.5 font-semibold"
                                >{candidate.name}</label>
                                <input
                                    type="radio"
                                    name="Vote"
                                    id={candidate.name}
                                    value={candidate.name}
                                    checked= {vote == candidate.name}
                                    onChange = {(e) => {
                                        setVote(e.target.value)
                                    }}
                                />
                                </div>
                            ))
                        }
                        </div>
                    </div>
                    }
                    {campaign?.votingType === "Ranked" &&
                    <div
                        className="flex flex-col items-center space-y-4 w-full px-24"
                    >
                        <div className="flex justify-between w-full">
                            <p
                                className="font-semibold px-4"
                            >Candidates</p>
                            <p
                                className="font-semibold px-4"
                            >Priority</p>
                        </div>
                        {candidates.map((candidate, index) => (
                            <div key={index} className="flex justify-between w-full">
                                <p
                                    className="p-2.5 font-semibold"
                                >{candidate.name}</p>
                                <input
                                    type="number"
                                    min="1"
                                    max={candidates.length}
                                    value={vote ? vote[candidate.name] ? vote[candidate.name]: index + 1 : index + 1}
                                    disabled={ vote? vote[candidate.name] ? false: true : true }
                                    onChange={(e) => {
                                        setVote((prev) => {
                                            return {
                                                ...prev,
                                                [candidate.name]: Number.parseInt(e.target.value)
                                            }
                                        })
                                    }}
                                    className="p-2.5 text-center border-2 border-blue-500 rounded-2xl w-16"
                                />
                            </div>
                        ))
                        }
                        
                        </div>
                    }
                    <label htmlFor="">Secret for Vote Anonymity</label>
                    <input
                        type="password"
                        className="p-2.5 border-2 border-blue-500 rounded-2xl w-64"
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                    />
                    <button
                            className="p-4 bg-blue-500 rounded-2xl text-white"
                            onClick={() => handleVote()}
                        >{campaign?.votingType} Vote</button>
                    </div>
                }
            </div>
        </div>
    )
}
export default Vote
