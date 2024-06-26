'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const EditCampaign = ({ campaignID }) => {
    const [campaignName, setCampaignName] = useState("");
    const [campaignDescription, setCampaignDescription] = useState("");
    const [votingType, setVotingType] = useState("Default");
    const [viewResults, setViewResults] = useState("PostVoting");
    const [campaignStart, setCampaignStart] = useState("");
    const [campaignEnd, setCampaignEnd] = useState("");
    const [isRestrictedByEmail, setIsRestrictedByEmail] = useState(false);
    const [domains, setDomains] = useState([]);

    const router = useRouter();

    const nameRegex = new RegExp(/^[a-zA-Z0-9 ]+$/);
    const votingTypeRegex = new RegExp(/^(Default|Ranked)$/);
    const viewResultsRegex = new RegExp(/^(PostVoting|Live)$/);
    const datetimeISORegex = new RegExp(/^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))$/);
    const domainsRegex = new RegExp(/^([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(, )?)+$/);
    
    useEffect(() => {
        const fetchCampaign = async () => {
            const response = await fetch(`/api/portal/campaigns/getCampaign?id=${campaignID}`);
            if (response.status == 200) {
                const data = await response.json();
                setCampaignName(data.name);
                setCampaignDescription(data.description);
                setVotingType(data.votingType);
                setViewResults(data.viewResults);
                setCampaignStart(data.startDateTime);
                setCampaignEnd(data.endDateTime);
                setIsRestrictedByEmail(data.isRestrictedByEmail);
                setDomains(data.allowedDomains);
            }
            else if (response.status == 401) {
                alert("Unauthorized");
                router.push("/app/auth");
                router.refresh();
            }
            else if (response.status == 404) {
                alert("Campaign not found");
                router.push("/portal");
                router.refresh();
            }
            else {
                alert("Error fetching campaign");
                router.push("/portal");
                router.refresh();
            }
        }
        fetchCampaign();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campaignID])

    const convertDateTimetoUTC = (datetime) => {
        const date = new Date(datetime);
        return date.toISOString();
    }

    const convertDateTimetoLocal = (datetime) => {
        if (datetime === "") return ""
        const date = new Date(datetime);
        return ((new Date(date.getTime() - new Date().getTimezoneOffset()*60*1000)).toISOString().slice(0,19))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const campaignStartDateTime = new Date(campaignStart);
        const campaignEndDateTime = new Date(campaignEnd);
        if (!nameRegex.test(campaignName)) {
            alert("Please enter a valid name. It should contain only letters, numbers and space.");
            return;
        }
        if (campaignDescription.length > 1024) {
            alert("Please enter a valid description. It should contain at most 1024 characters.");
            return;
        }
        if (!votingTypeRegex.test(votingType)) {
            alert("Please enter a valid voting type. It should be either Default or Ranked.");
            return;
        }
        if (!viewResultsRegex.test(viewResults)) {
            alert("Please enter a valid view results. It should be either PostVoting or Live.");
            return;
        }
        if (!datetimeISORegex.test(campaignStart)) {
            alert("Please enter a valid start datetime like 2024-04-24T20:50.");
            return;
        }
        if (!datetimeISORegex.test(campaignEnd) || campaignStartDateTime >= campaignEndDateTime) {
            alert("Please enter a valid end date like 2024-04-24T20:50.");
            return;
        }
        if (isRestrictedByEmail && !domainsRegex.test(domains.join(', '))) {
            alert("Please enter a valid domain. It should be a comma separated list of domains.");
            return;
        }

        const response = await fetch("/api/portal/campaigns/editCampaign", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                campaignID: campaignID,
                name: campaignName,
                description: campaignDescription,
                votingType: votingType,
                viewResults: viewResults,
                startDateTime: campaignStart,
                endDateTime: campaignEnd,
                isRestrictedByEmail: isRestrictedByEmail,
                allowedDomains: domains
            })
        });
        if (response.status == 200) {
            alert("Campaign edited successfully");
            router.push("/portal");
            router.refresh();
        }
        else if (response.status == 400) {
            alert("Invalid Campaign Data!");
        }
        else if (response.status == 401) {
            alert("Unauthorized");
            router.push("/app/auth");
            router.refresh();
        }
        else if (response.status == 404) {
            alert("Campaign not found");
            router.push("/portal");
            router.refresh();
        }
        else {
            alert("Error editing campaign");
        }

    }

    return (
        <section className="flex flex-col justify-center items-center space-y-4 bg-white rounded-2xl p-8 lg:w-1/2 md:w-3/4 sm:w-full">
            <h1 className="text-2xl font-bold">Edit Campaign</h1>
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
                        <p className="text-red-500 text-xs">Please enter a valid description. It should contain at most 1024 characters.</p>
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
                        value={convertDateTimetoLocal(campaignStart)}
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
                        className={`p-2 border rounded-lg w-full ${datetimeISORegex.test(campaignEnd) && new Date(campaignStart) < new Date(campaignEnd) ? 'border-gray-300' : 'border-red-500'}`}
                        onChange={(e) => setCampaignEnd(convertDateTimetoUTC(e.target.value))}
                        value={convertDateTimetoLocal(campaignEnd)}
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
                <Link className="flex justify-center items-center" href={`/portal/campaigns/edit/candidates/${campaignID}`}>
                    <p className="bg-green-500 text-white rounded-lg p-2">
                        Edit Candidates
                    </p>
                </Link>
    
                <button
                    className="bg-blue-500 text-white rounded-lg p-2"
                    onClick={handleSubmit}
                >
                    Edit Campaign
                </button>
            </form>
        </section>
    )
    
}

export default EditCampaign