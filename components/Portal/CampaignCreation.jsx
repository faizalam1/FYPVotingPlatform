'use client'
import { useEffect, useState } from 'react'
import Candidate from '@/components/Portal/Candidate'
import { set } from 'mongoose';

const CampaignCreation = () => {
    const [campaignName, setCampaignName] = useState('');
    const [campaignDescription, setCampaignDescription] = useState('');
    const [votingType, setVotingType] = useState('Default');
    const [campaignStart, setCampaignStart] = useState('');
    const [campaignEnd, setCampaignEnd] = useState('');
    const [isDomainRestricted, setIsDomainRestricted] = useState(false);
    const [domain, setDomain] = useState('');
    const [numberOfCandidates, setNumberOfCandidates] = useState(2);
    const [areAdditionalFields, setAreAdditionalFields] = useState(false);
    const [numberOfAdditionalFields, setNumberOfAdditionalFields] = useState(0);
    const [candidates, setCandidates] = useState(Array.from({ length: numberOfCandidates }, (_, index) => {
        return { name: '', description: '', image: null, additionalFields: [] }
    }));

    const convertDateTimetoUTC = (datetime) => {
        const date = new Date(datetime);
        return date.toISOString();
    }

    const addCandidate = (name, description, image, additionalFields, index) => {
        let newCandidates = candidates.slice();
        if (name != null)
            newCandidates[index]["name"] = name;
        if (description != null)
            newCandidates[index]["description"] = description;
        if (image != null)
            newCandidates[index]["image"] = image;
        if (additionalFields != null)
            newCandidates[index]["additionalFields"] = additionalFields;
        setCandidates(newCandidates);
    }

    return (
        <section className="flex flex-col justify-center items-center space-y-4 bg-white rounded-2xl p-8 lg:w-1/2 md:w-3/4 sm:w-full p-4">
            <h1 className="text-3xl font-bold">Create New Campaign</h1>
            <form className="flex flex-col space-y-4 justify-center w-3/4">
                <div className="flex flex-col">
                    <label className="text-sm font-semibold">Campaign Name</label>
                    <input
                        type="text"
                        className="p-2 border rounded-lg border-gray-300 w-full"
                        placeholder="Enter Campaign Name"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-semibold">Campaign Description</label>
                    <textarea
                         className="p-2 border rounded-lg border-gray-300 w-full"
                        placeholder="Enter Campaign Description"
                        value={campaignDescription}
                        onChange={(e) => setCampaignDescription(e.target.value)}
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-semibold">Voting Type</label>
                    <select
                         className="p-2 border rounded-lg border-gray-300 w-full"
                        value={votingType}
                        onChange={(e) => setVotingType(e.target.value)}
                    >
                        <option value="Default">Default</option>
                        <option value="Ranked">Ranked</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-semibold">Campaign Start</label>
                    <input
                        type="datetime-local"
                        className="p-2 border rounded-lg border-gray-300 w-full"
                        onChange={(e) => setCampaignStart(convertDateTimetoUTC(e.target.value))}
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-semibold">Campaign End</label>
                    <input
                        type="datetime-local"
                        className="p-2 border rounded-lg border-gray-300 w-full"
                        onChange={(e) => setCampaignEnd(convertDateTimetoUTC(e.target.value))}
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-semibold">
                        <input
                            type="checkbox"
                            checked={isDomainRestricted}
                            onChange={(e) => setIsDomainRestricted(e.target.checked)}
                        />
                        Restrict Voters to specific domain
                    </label>
                </div>
                {isDomainRestricted && (
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold">Allowed Domain</label>
                        <input
                            type="text"
                            className="p-2 border rounded-lg border-gray-300 w-full"
                            placeholder="Enter allowed domain"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                        />
                    </div>
                )}
                <div className="flex flex-col">
                    <label className="text-sm font-semibold">Number of Candidates</label>
                    <input
                        type="number"
                        className="p-2 border rounded-lg border-gray-300 w-full"
                        value={numberOfCandidates}
                        onChange={(e) => setNumberOfCandidates(e.target.value)}
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-semibold">
                        <input
                            type="checkbox"
                            checked={areAdditionalFields}
                            onChange={(e) => setAreAdditionalFields(e.target.checked)}
                        />
                        Add Additional fields for Candidates
                    </label>
                </div>
                {areAdditionalFields && (
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold">Number of Additional Fields</label>
                        <input
                            type="number"
                            className="border border-gray-200 rounded-lg p-2 mb-2"
                            value={numberOfAdditionalFields}
                            onChange={(e) => setNumberOfAdditionalFields(e.target.value)}
                        />
                    </div>
                )}

                {Array.from({ length: numberOfCandidates }, (_, index) => {
                    return <Candidate key={index} index={index} areAdditionalFields={areAdditionalFields} numberOfAdditionalFields={numberOfAdditionalFields} addCandidate={addCandidate} />
                })}

                <button className="bg-blue-500 text-white font-semibold p-2 rounded-lg">Create Campaign</button>

            </form>

        </section>
    )
}

export default CampaignCreation