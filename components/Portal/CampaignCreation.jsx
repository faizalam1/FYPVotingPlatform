'use client'
import { useState } from 'react'
import Candidate from '@/components/Portal/Candidate'
import { Tooltip } from "react-tooltip";

const CampaignCreation = () => {
    const [campaignName, setCampaignName] = useState('');
    const [campaignDescription, setCampaignDescription] = useState('');
    const [votingType, setVotingType] = useState('Default');
    const [campaignStart, setCampaignStart] = useState('');
    const [campaignEnd, setCampaignEnd] = useState('');
    const [isRestrictedByEmail, setIsRestrictedByEmail] = useState(false);
    const [domains, setDomains] = useState([]);
    const [numberOfCandidates, setNumberOfCandidates] = useState(2);
    const [areAdditionalFieldsRequired, setAreAdditionalFieldsRequired] = useState(false);
    const [numberOfAdditionalFields, setNumberOfAdditionalFields] = useState(0);
    const [candidates, setCandidates] = useState(Array.from({ length: numberOfCandidates }, (_, index) => {
        return { name: '', description: '', image: null, additionalFields: [] }
    }));
    const [areCandidatesValid, setAreCandidatesValid] = useState(false);

    const convertDateTimetoUTC = (datetime) => {
        const date = new Date(datetime);
        return date.toISOString();
    }

    const changeAreCandidatesValid = (newAreCandidatesValid) => {
        if (newAreCandidatesValid) {
            setAreCandidatesValid(prev => prev && newAreCandidatesValid);
        }
        else{
            setAreCandidatesValid(newAreCandidatesValid);
        }
    };

    const changeNumberOfCandidates = (newNumber) => {
        setNumberOfCandidates(prevNumber => {
            let newNumberOfCandidates;
            if (newNumber < 0) {
                newNumberOfCandidates = 2;
            }
            else {
                newNumberOfCandidates = newNumber;
            }
            if (prevNumber < newNumber){
                const newCandidates = Array.from({ length: newNumberOfCandidates-prevNumber }, (_, index) => {
                    return {
                        name: '', description: '', image: null, additionalFields: Array.from({ length: numberOfAdditionalFields }, (_, index) => {
                            return { name: '', value: '' }
                        }
                        )
                    }
                });
                setCandidates(candidates.concat(newCandidates));
            }
            else{
                setCandidates(candidates.slice(0, newNumberOfCandidates));
            }
            return newNumberOfCandidates;
        })}

    const changeNumberOfAdditionalFields = (newNumber) => {
        setNumberOfAdditionalFields(prevNumber => {
            let newNumberOfAdditionalFields;
            if (newNumber < 0) {
                newNumberOfAdditionalFields = 1;
            }
            else {
                newNumberOfAdditionalFields = newNumber;
            }
            setCandidates(candidates.map(candidate => {
                if (candidate.additionalFields.length < newNumberOfAdditionalFields){
                    const newAdditionalFields = Array.from({ length: newNumberOfAdditionalFields-candidate.additionalFields.length }, (_, index) => {
                        return { name: '', value: '' }
                    });
                    return { ...candidate, additionalFields: candidate.additionalFields.concat(newAdditionalFields) };
                }
                else{
                    return { ...candidate, additionalFields: candidate.additionalFields.slice(0, newNumberOfAdditionalFields) };
                }
            }));
            return newNumberOfAdditionalFields;
        })}

    const addCandidate = (name, description, image, additionalFields, index) => {
        let newCandidates = candidates.slice();
        if (index >= 0 && index < newCandidates.length) {
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
        else{
            console.error(`Index ${index} out of bounds for candidates array`);
        }
    }

    const nameRegex = new RegExp(/^[a-zA-Z0-9 ]+$/);
    const votingTypeRegex = new RegExp(/^(Default|Ranked)$/);
    const datetimeISORegex = new RegExp(/^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))$/);
    const domainsRegex = new RegExp(/^([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(, )?)+$/);
    const campaignStartDateTime = new Date(campaignStart);
    const campaignEndDateTime = new Date(campaignEnd);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (nameRegex.test(campaignName) === false) {
            alert("Invalid Campaign Name");
            return;
        }
        if (campaignDescription.length < 10) {
            alert("Campaign Description should be atleast 10 characters long");
            return;
        }
        if (votingTypeRegex.test(votingType) === false) {
            alert("Invalid Voting Type");
            return;
        }
        if (campaignStart === '' || campaignEnd === '') {
            alert("Please enter valid start and end dates");
            return;
        }
        if (campaignEndDateTime <= new Date()) {
            alert("Campaign End should be in the future");
            return;
        }
        if (campaignStartDateTime >= campaignEndDateTime) {
            alert("Campaign End should be after Campaign Start");
            return;
        }
        if (isRestrictedByEmail && domains.length === 0) {
            alert("Please enter atleast one domain");
            return;
        }
        if (numberOfCandidates < 2) {
            alert("Please enter atleast 2 candidates");
            return;
        }
        if (areAdditionalFieldsRequired && numberOfAdditionalFields < 1) {
            alert("Please enter atleast 1 additional field");
            return;
        }
        if (!areCandidatesValid){
            alert("Please fill all candidate details");
            return;
        }
        if (
            campaign.candidates.every(candidate => 
                candidateNameRegex.test(candidate.name) && 
                candidate.description.length >= 10 && 
                candidate.additionalFields.length === numberOfAdditionalFields &&
                candidate.additionalFields.every(field => field.name && field.value)
            )
        ){
            alert("Please fill all candidate details");
            return;
        }
        const res = fetch('/api/portal/campaigns/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                campaignName,
                campaignDescription,
                votingType,
                campaignStart,
                campaignEnd,
                isRestrictedByEmail,
                domains,
                numberOfCandidates,
                areAdditionalFieldsRequired,
                numberOfAdditionalFields,
                candidates,
                areCandidatesValid
            })
        })

        if (res.status == 201)
            alert("Campaign Created Successfully");
    }

    return (
        <section className="flex flex-col justify-center items-center space-y-4 bg-white rounded-2xl p-8 lg:w-1/2 md:w-3/4 sm:w-full">
            <h1 className="text-3xl font-bold">Create New Campaign</h1>
            <form className="flex flex-col space-y-4 justify-center w-3/4">
                <div className="flex flex-col">
                    <label className="text-sm font-semibold">Campaign Name</label>
                    <a
                        data-tooltip-id="CampaignNameError"
                        data-tooltip-variant="error"
                        data-tooltip-content="Please enter a valid name. It should contain only letters, numbers and space."
                    >
                        <input
                            type="text"
                            className="p-2 border rounded-lg border-gray-300 w-full"
                            placeholder="Enter Campaign Name"
                            value={campaignName}
                            onChange={(e) => setCampaignName(e.target.value)}
                            required
                        />
                    </a>
                    <Tooltip
                        id="CampaignNameError"
                        place="bottom"
                        effect="solid"
                        hidden={nameRegex.test(campaignName)}
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-semibold">Campaign Description</label>
                    <a
                        data-tooltip-id="CampaignDescriptionError"
                        data-tooltip-variant="error"
                        data-tooltip-content="Please enter a valid description. It should contain atleast 10 characters."
                    >
                        <textarea
                            className="p-2 border rounded-lg border-gray-300 w-full"
                            placeholder="Enter Campaign Description"
                            value={campaignDescription}
                            onChange={(e) => setCampaignDescription(e.target.value)}
                            required
                        />
                    </a>
                    <Tooltip
                        id="CampaignDescriptionError"
                        place="bottom"
                        effect="solid"
                        hidden={campaignDescription.length >= 10}
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-semibold">Voting Type</label>
                    <a
                        data-tooltip-id="VotingTypeError"
                        data-tooltip-variant="error"
                        data-tooltip-content="Please enter a valid voting type. It should be either Default or Ranked."
                    >
                        <select
                            className="p-2 border rounded-lg border-gray-300 w-full"
                            value={votingType}
                            onChange={(e) => setVotingType(e.target.value)}
                            required
                        >
                            <option value="Default">Default</option>
                            <option value="Ranked">Ranked</option>
                        </select>
                    </a>
                    <Tooltip
                        id="VotingTypeError"
                        place="bottom"
                        effect="solid"
                        hidden={votingTypeRegex.test(votingType)}
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-semibold">Campaign Start</label>
                    <a
                        data-tooltip-id="CampaignStartError"
                        data-tooltip-variant="error"
                        data-tooltip-content="Please enter a valid start datetime like 2024-04-24T20:50."
                    >
                        <input
                            type="datetime-local"
                            className="p-2 border rounded-lg border-gray-300 w-full"
                            onChange={(e) => setCampaignStart(convertDateTimetoUTC(e.target.value))}
                            required
                        />
                    </a>
                    <Tooltip
                        id="CampaignStartError"
                        place="bottom"
                        effect="solid"
                        hidden={datetimeISORegex.test(campaignStart)}
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-semibold">Campaign End</label>
                    <a
                        data-tooltip-id="CampaignEndError"
                        data-tooltip-variant="error"
                        data-tooltip-content="Please enter a valid end date like 2024-04-24T20:50."
                    >
                        <input
                            type="datetime-local"
                            className="p-2 border rounded-lg border-gray-300 w-full"
                            onChange={(e) => setCampaignEnd(convertDateTimetoUTC(e.target.value))}
                            required
                        />
                    </a>
                    <Tooltip
                        id="CampaignEndError"
                        place="bottom"
                        effect="solid"
                        hidden={
                            datetimeISORegex.test(campaignEnd)
                            ||
                            new Date(campaignStart) < new Date(campaignEnd)
                        }
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-semibold">
                        <input
                            type="checkbox"
                            checked={isRestrictedByEmail}
                            onChange={(e) => setIsRestrictedByEmail(e.target.checked)}
                        />
                        Restrict Voters to specific domain
                    </label>
                </div>
                {isRestrictedByEmail && (
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold">Allowed Domains</label>
                        <a
                            data-tooltip-id="DomainsError"
                            data-tooltip-variant="error"
                            data-tooltip-content="Please enter a valid domain. It should be a comma separated list of domains."
                        >
                            <input
                                type="text"
                                className="p-2 border rounded-lg border-gray-300 w-full"
                                placeholder="Domain1, Domain2, ..."
                                value={domains.join(', ')}
                                onChange={(e) => setDomains(e.target.value.split(', '))}
                            />
                        </a>
                        <Tooltip
                            id="DomainsError"
                            place="bottom"
                            effect="solid"
                            hidden={domainsRegex.test(domains.join(', '))}
                        />
                    </div>
                )}
                <div className="flex flex-col">
                    <label className="text-sm font-semibold">Number of Candidates</label>
                    <a
                        data-tooltip-id="NumberOfCandidatesError"
                        data-tooltip-variant="error"
                        data-tooltip-content="Please enter a valid number. It should be atleast 2."
                    >
                        <input
                            type="number"
                            className="p-2 border rounded-lg border-gray-300 w-full"
                            value={numberOfCandidates}
                            onChange={(e) => changeNumberOfCandidates(e.target.value)}
                            required
                        />
                    </a>
                    <Tooltip
                        id="NumberOfCandidatesError"
                        place="bottom"
                        effect="solid"
                        hidden={numberOfCandidates >= 2}
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-semibold">
                        <input
                            type="checkbox"
                            checked={areAdditionalFieldsRequired}
                            onChange={(e) => setAreAdditionalFieldsRequired(e.target.checked)}
                        />
                        Add Additional fields for Candidates
                    </label>
                </div>
                {areAdditionalFieldsRequired && (
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold">Number of Additional Fields</label>
                        <a
                            data-tooltip-id="NumberOfAdditionalFieldsError"
                            data-tooltip-variant="error"
                            data-tooltip-content="Please enter a valid number. It should be atleast 1."
                        >
                            <input
                                type="number"
                                className="border border-gray-200 rounded-lg p-2 mb-2 w-full"
                                value={numberOfAdditionalFields}
                                onChange={(e) => changeNumberOfAdditionalFields(e.target.value)}
                            />
                        </a>
                        <Tooltip
                            id="NumberOfAdditionalFieldsError"
                            place="bottom"
                            effect="solid"
                            hidden={numberOfAdditionalFields >= 1}
                        />
                    </div>
                )}

                {Array.from({ length: numberOfCandidates }, (_, index) => {
                    return <Candidate 
                                key={index}
                                index={index}
                                areAdditionalFieldsRequired={areAdditionalFieldsRequired}
                                numberOfAdditionalFields={numberOfAdditionalFields}
                                addCandidate={addCandidate}
                                changeAreCandidatesValid={changeAreCandidatesValid}
                            />
                })}

                <button
                    className="bg-blue-500 text-white font-semibold p-2 rounded-lg"
                    onClick={handleSubmit}>
                    Create Campaign
                </button>

            </form>

        </section>
    )
}

export default CampaignCreation;