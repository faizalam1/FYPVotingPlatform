'use client'

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import EditCandidateForm from "@/components/Portal/Campaigns/EditCandidateForm"

const EditCandidates = ({ campaignID }) => {
    const [candidates, setCandidates] = useState([])
    const candidateRef = useRef([])
    const router = useRouter();
    const nameRegex = /^[a-zA-Z]([a-zA-Z0-9\-_ ]*[a-zA-Z0-9])?$/
    useEffect(() => {
        const getCandidates = async () => {
            const res = await fetch(`/api/portal/campaigns/candidates/getCampaignCandidates?campaignID=${campaignID}`)
            if (res.status === 200) {
                const data = await res.json()
                candidateRef.current = data
                const candidates = data.map(candidate => {
                    return {
                        "name": candidate.name,
                        "description": candidate.description,
                        "image": candidate.image,
                        "additionalFields": candidate.additionalFields
                    }
                }
                )
                setCandidates(candidates)
            }
            else if (res.status === 204) {
                setCandidates([])
            }
            else if (res.status === 404) {
                alert("No campaign found!")
                router.push("/portal")
                router.refresh()
            }
            else if (res.status === 401) {
                alert("Unauthorized!")
                router.push("/app/auth")
                router.refresh()
            }
            else {
                alert("Internal Server Error!")
                router.push("/portal")
                router.refresh()
            }
        }
        getCandidates()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campaignID])

    const removeCandidate = (index) => {
        candidateRef.current[index].isDeleted = true
        setCandidates((prev) => prev.filter((_, i) => i !== index))
    }

    const addCandidate = () => {
        candidateRef.current.push({ "name": "", "description": "", "image": "", "additionalFields": [], "campaignID": campaignID, "isAdded": true })
        setCandidates((prev) => prev.concat({ "name": "", "description": "", "image": "", "additionalFields": [] }))
    }

    const updateCandidate = (name, description, image, additionalFields, index) => {
        candidateRef.current[index].name = name
        candidateRef.current[index].description = description
        candidateRef.current[index].image = image
        candidateRef.current[index].additionalFields = additionalFields
        if (candidateRef.current[index].isAdded === undefined) {
            candidateRef.current[index].isUpdated = true
        }
        setCandidates((prev) => prev.map((candidate, i) => {
            if (i === index) {
                return { "name": name, "description": description, "image": image, "additionalFields": additionalFields }
            }
            return candidate
        }
        ))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        candidateRef.current.forEach((candidate, index) => {
            if (!nameRegex.test(candidate.name)){
                alert(`Invalid name for candidate ${index + 1}`)
                return;
            }
            if (candidate.description.length > 500){
                alert(`Description for candidate ${index + 1} is too long!`)
                return;
            }
            const formData = new FormData()
            formData.append('name', candidate.name)
            formData.append('description', candidate.description)
            formData.append('image', candidate.image)
            formData.append('additionalFields', JSON.stringify(candidate.additionalFields))
            
            if (candidate.isAdded){
                addCandidateToDB(formData, candidate)
            }
            if (candidate.isUpdated){
                updateCandidateInDB(formData, candidate)
            }
            else if (candidate.isDeleted){
                deleteCandidateInDB(candidate)
            }

            async function deleteCandidateInDB(candidate) {
                const res = await fetch(`/api/portal/campaigns/candidates/deleteCandidate?id=${candidate._id}`, {
                    method: 'DELETE'
                })
                if (res.status === 200) {
                    alert(`Candidate ${index + 1} deleted successfully!`)
                }
                else if (res.status === 404) {
                    alert("Candidate not found!")
                }
                else {
                    alert(`Failed to delete candidate ${index + 1}`)
                }
            }

            async function updateCandidateInDB(formData, candidate) {
                formData.append("id", candidate._id)
                const res = await fetch('/api/portal/campaigns/candidates/editCandidate', {
                    method: 'PUT',
                    body: formData
                })
                if (res.status === 200) {
                    alert(`Candidate ${index + 1} updated successfully!`)
                }
                else if (res.status === 404) {
                    alert("Candidate not found!")
                }
                else {
                    alert(`Failed to update candidate ${index + 1}`)
                }
            }

            async function addCandidateToDB(formData, candidate) {
                formData.append('campaignID', candidate.campaignID)
                const res = await fetch('/api/portal/campaigns/candidates/addCandidate', {
                    method: 'POST',
                    body: formData
                })
                if (res.status === 200) {
                    alert(`Candidate ${index + 1} added successfully!`)
                }
                else if (res.status === 404) {
                    alert("Campaign not found!")
                }
                else if (res.status == 400){
                    alert(res.error)
                }
                else {
                    alert(`Failed to add candidate ${index + 1}`)
                }
            }
        })
    }

    return (
        <div className="p-8 w-full">
            <form className="flex flex-col items-center justify-center">
                <h1 className="font-bold text-2xl">Edit Candidates</h1>
                {
                    candidates.length === 0 ? <h3>No Candidates Found!</h3> :
                        candidates.map((candidate, index) => (
                            <EditCandidateForm key={index} candidate={candidate} index={index} removeCandidate={removeCandidate} updateCandidate={updateCandidate} />
                        ))
                }
                <button onClick={(e) => {
                    e.preventDefault()
                    addCandidate()
                }}
                    className="text-base bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mt-4"
                >
                    Add Candidate
                </button>

                <button
                    onClick={handleSubmit}
                    className="text-base bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded mt-4"
                >
                    Save Changes
                </button>
            </form>
        </div>
    )
}

export default EditCandidates