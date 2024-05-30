'use client'
import { useState } from 'react';
import Candidate from '@/components/Portal/Campaigns/Candidate';
import { useRouter } from 'next/navigation';

const CampaignCreation = () => {
    const [campaignName, setCampaignName] = useState('');
    const [campaignDescription, setCampaignDescription] = useState('');
    const [votingType, setVotingType] = useState('Default');
    const [viewResults, setViewResults] = useState('PostVoting');
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

    const router = useRouter();

    const convertDateTimetoUTC = (datetime) => {
        const date = new Date(datetime);
        return date.toISOString();
    }

    const changeNumberOfCandidates = (newNumber) => {
        setNumberOfCandidates(prevNumber => {
            let newNumberOfCandidates;
            if (newNumber < 0) {
                newNumberOfCandidates = 2;
            }
            else {
                newNumberOfCandidates = newNumber;
            }
            if (prevNumber < newNumber) {
                const newCandidates = Array.from({ length: newNumberOfCandidates - prevNumber }, (_, index) => {
                    return {
                        name: '', description: '', image: null, additionalFields: Array.from({ length: numberOfAdditionalFields }, (_, index) => {
                            return { name: '', value: '' }
                        }
                        )
                    }
                });
                setCandidates(candidates.concat(newCandidates));
            }
            else {
                setCandidates(candidates.slice(0, newNumberOfCandidates));
            }
            return newNumberOfCandidates;
        })
    }

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
                if (candidate.additionalFields.length < newNumberOfAdditionalFields) {
                    const newAdditionalFields = Array.from({ length: newNumberOfAdditionalFields - candidate.additionalFields.length }, (_, index) => {
                        return { name: '', value: '' }
                    });
                    return { ...candidate, additionalFields: candidate.additionalFields.concat(newAdditionalFields) };
                }
                else {
                    return { ...candidate, additionalFields: candidate.additionalFields.slice(0, newNumberOfAdditionalFields) };
                }
            }));
            return newNumberOfAdditionalFields;
        })
    }

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
        else {
            console.error(`Index ${index} out of bounds for candidates array`);
        }
    }

    const nameRegex = new RegExp(/^[a-zA-Z0-9 ]+$/);
    const votingTypeRegex = new RegExp(/^(Default|Ranked)$/);
    const viewResultsRegex = new RegExp(/^(PostVoting|Live)$/);
    const datetimeISORegex = new RegExp(/^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))$/);
    const domainsRegex = new RegExp(/^([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(, )?)+$/);
    const candidateNameRegex = /^[a-zA-Z]([a-zA-Z0-9\-_ ]*[a-zA-Z0-9])?$/;
    const campaignStartDateTime = new Date(campaignStart);
    const campaignEndDateTime = new Date(campaignEnd);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (nameRegex.test(campaignName) === false) {
            alert("Invalid Campaign Name");
            return;
        }
        if (campaignDescription.length > 1024) {
            alert("Campaign Description should be no more than 1024 characters.");
            return;
        }
        if (votingTypeRegex.test(votingType) === false) {
            alert("Invalid Voting Type");
            return;
        }
        if (viewResultsRegex.test(viewResults) === false) {
            alert("Invalid View Results Type");
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
        if (
            !(candidates.every(candidate =>
                candidateNameRegex.test(candidate.name) &&
                candidate.description.length <= 1024 &&
                candidate.additionalFields.length === numberOfAdditionalFields &&
                candidate.additionalFields.every(field => field.name && field.value)
            ))
        ) {
            alert("Please fill all candidate details correctly.");
            return;
        }
        if (!(candidates.every(
            candidate =>
                candidate.image == null ||
                (candidate.image instanceof File &&
                candidate.image.size <= 1024 * 1024 * 2 &&
                candidate.image.name.split('.').length === 2 &&
                candidate.image.name.split('.')[1].match(/(jpg|jpeg|png)/)
                )
        ))
        ) {
            
            alert("Please upload valid images (jpg, jpeg, png) of upto 2 MBs for candidates");
            return;
        }
        if (candidates.some(candidate => candidates.filter(c => c.name === candidate.name).length > 1)) {
            alert("Candidate names should be unique");
            return;
        }

        const formData = new FormData();
        formData.append('campaignName', campaignName);
        formData.append('campaignDescription', campaignDescription);
        formData.append('votingType', votingType);
        formData.append('viewResults', viewResults);
        formData.append('campaignStart', campaignStart);
        formData.append('campaignEnd', campaignEnd);
        formData.append('isRestrictedByEmail', isRestrictedByEmail);
        formData.append('domains', domains.join(', '));
        formData.append('numberOfCandidates', numberOfCandidates);
        formData.append('areAdditionalFieldsRequired', areAdditionalFieldsRequired);
        formData.append('numberOfAdditionalFields', numberOfAdditionalFields);
        candidates.forEach((candidate, index) => {
            formData.append(`candidate${index}-name`, candidate.name);
            formData.append(`candidate${index}-description`, candidate.description);
            formData.append(`candidate${index}-image`, candidate.image);
            candidate.additionalFields.forEach((field, index2) => {
                formData.append(`candidate${index}-additionalField${index2}-name`, field.name);
                formData.append(`candidate${index}-additionalField${index2}-value`, field.value);
            });
        });

        const res = await fetch('/api/portal/campaigns/create', {
            method: 'POST',
            body: formData
        })

        if (res.status == 201){
            alert("Campaign Created Successfully");
            router.push("/portal/campaigns");
            router.refresh();
        }
        else
            alert(res.status + "\n" + (await res.json()).error)
    }

    return (
        <section className="flex flex-col justify-center items-center space-y-4 bg-white rounded-2xl p-8 lg:w-1/2 md:w-3/4 sm:w-full">
            <h1 className="text-3xl font-bold">Create New Campaign</h1>
            <form className="flex flex-col space-y-4 justify-center w-3/4">
                <div className="flex flex-col">
                    <label className="text-sm font-semibold">Campaign Name</label>
                    <input
                        type="text"
                        className={`p-2 border rounded-lg w-full ${nameRegex.test(campaignName) ? 'border-gray-300' : 'border-red-500'}`}
                        placeholder="Enter Campaign Name"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        required
                    />
                    {!nameRegex.test(campaignName) && (
                        <span className="text-red-500 text-xs">Please enter a valid name. It should contain only letters, numbers, and spaces.</span>
                    )}
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-semibold">Campaign Description</label>
                    <textarea
                        className={`p-2 border rounded-lg w-full ${campaignDescription.length < 1024 ? 'border-gray-300' : 'border-red-500'}`}
                        placeholder="Enter Campaign Description"
                        value={campaignDescription}
                        onChange={(e) => setCampaignDescription(e.target.value)}
                    />
                    {campaignDescription.length > 1024 && (
                        <p className="text-red-500 text-xs">Please enter a valid description. It should be less than 1024 characters.</p>
                    )}
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-semibold">Voting Type</label>
                    <select
                        className={`p-2 border rounded-lg w-full ${votingTypeRegex.test(votingType) ? 'border-gray-300' : 'border-red-500'}`}
                        value={votingType}
                        onChange={(e) => setVotingType(e.target.value)}
                        required
                    >
                        <option value="Default">Default</option>
                        <option value="Ranked">Ranked</option>
                    </select>
                    {!votingTypeRegex.test(votingType) && (
                        <span className="text-red-500 text-xs">Please enter a valid voting type. It should be either Default or Ranked.</span>
                    )}
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-semibold">View Results</label>
                    <select
                        className={`p-2 border rounded-lg w-full ${viewResultsRegex.test(viewResults) ? 'border-gray-300' : 'border-red-500'}`}
                        value={viewResults}
                        onChange={(e) => setViewResults(e.target.value)}
                        required
                    >
                        <option value="PostVoting">PostVoting</option>
                        <option value="Live">Live</option>
                    </select>
                    {!viewResultsRegex.test(viewResults) && (
                        <span className="text-red-500 text-xs">Please enter a valid view results type. It should be either PostVoting or Live.</span>
                    )}
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-semibold">Campaign Start</label>
                    <input
                        type="datetime-local"
                        className={`p-2 border rounded-lg w-full ${datetimeISORegex.test(campaignStart) ? 'border-gray-300' : 'border-red-500'}`}
                        onChange={(e) => setCampaignStart(convertDateTimetoUTC(e.target.value))}
                        required
                    />
                    {!datetimeISORegex.test(campaignStart) && (
                        <span className="text-red-500 text-xs">Please enter a valid start datetime like 2024-04-24T20:50.</span>
                    )}
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-semibold">Campaign End</label>
                    <input
                        type="datetime-local"
                        className={`p-2 border rounded-lg w-full ${(datetimeISORegex.test(campaignEnd) && new Date(campaignStart) < new Date(campaignEnd)) ? 'border-gray-300' : 'border-red-500'}`}
                        onChange={(e) => setCampaignEnd(convertDateTimetoUTC(e.target.value))}
                        required
                    />
                    {(!datetimeISORegex.test(campaignEnd) || new Date(campaignStart) >= new Date(campaignEnd)) && (
                        <span className="text-red-500 text-xs">Please enter a valid end datetime and ensure it is after the start datetime.</span>
                    )}
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
                        <input
                            type="text"
                            className={`p-2 border rounded-lg w-full ${domainsRegex.test(domains.join(', ')) ? 'border-gray-300' : 'border-red-500'}`}
                            placeholder="Domain1, Domain2, ..."
                            value={domains.join(', ')}
                            onChange={(e) => setDomains(e.target.value.split(', '))}
                        />
                        {!domainsRegex.test(domains.join(', ')) && (
                            <span className="text-red-500 text-xs">Please enter a valid domain. It should be a comma separated list of domains.</span>
                        )}
                    </div>
                )}
                <div className="flex flex-col">
                    <label className="text-sm font-semibold">Number of Candidates</label>
                    <input
                        type="number"
                        className={`p-2 border rounded-lg w-full ${numberOfCandidates >= 2 ? 'border-gray-300' : 'border-red-500'}`}
                        value={numberOfCandidates}
                        onChange={(e) => changeNumberOfCandidates(parseInt(e.target.value))}
                        required
                    />
                    {numberOfCandidates < 2 && (
                        <span className="text-red-500 text-xs">Please enter a valid number. It should be at least 2.</span>
                    )}
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
                        <input
                            type="number"
                            className={`border border-gray-200 rounded-lg p-2 mb-2 w-full ${numberOfAdditionalFields >= 1 ? 'border-gray-300' : 'border-red-500'}`}
                            value={numberOfAdditionalFields}
                            onChange={(e) => changeNumberOfAdditionalFields(parseInt(e.target.value))}
                        />
                        {numberOfAdditionalFields < 1 && (
                            <span className="text-red-500 text-xs">Please enter a valid number. It should be at least 1.</span>
                        )}
                    </div>
                )}
                <div>
                    <p className='text-sm text-gray-400'>Note: Candidates names must be unique.</p>
                </div>
                <div>
                    <h2 className="text-lg font-semibold mt-4">Candidates</h2>
                </div>
    
                {Array.from({ length: numberOfCandidates }, (_, index) => {
                    return <Candidate
                        key={index}
                        index={index}
                        areAdditionalFieldsRequired={areAdditionalFieldsRequired}
                        numberOfAdditionalFields={numberOfAdditionalFields}
                        addCandidate={addCandidate}
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