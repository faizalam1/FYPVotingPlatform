"use client"
import { useState, useEffect, useRef } from "react"
import ToggleSwitch from "@/components/ToggleSwitch";
import { set } from "mongoose";

const Result = ({ campaignID }) => {
    const [campaign, setCampaign] = useState({});
    const [result, setResult] = useState([]);
    const [isResultPublished, setIsResultPublished] = useState(false);
    const [isLive, setIsLive] = useState(false);
    const [reupdateResult, setReupdateResult] = useState(true);
    const [refreshTime, setRefreshTime] = useState(-1);
    const [round, setRound] = useState(0);

    const barColors = ["FF7F7F","FFBF7F","77DD77","7FBFFF","7F7FFF","BF7FFF"]

    useEffect(() => {
        const fetchCampaign = async () => {
            const response = await fetch(`/api/portal/vote/getCampaign?id=${campaignID}`);
            if (response.status == 200) {
                const data = await response.json();
                setIsResultPublished(data.isResultsPublic);
                const live = data.viewResults == "Live" && new Date(data.endDateTime) > new Date();
                setIsLive(live);
                if (live && refreshTime == -1) {
                    setRefreshTime(120000);
                }
                setCampaign(data);
            }
            else if (response.status == 403) {
                alert("User is not allowed to view this campaign");
            }
            else if (response.status == 404) {
                alert("No campaign found");
            }
            else if (response.status == 401) {
                alert("Unauthorized");
            }
            else {
                alert("Error fetching campaign");
            }
        }

        const getResult = async () => {
            const response = await fetch(`/api/portal/result/getResult?id=${campaignID}`);
                if (response.status == 200) {
                    const data = await response.json();
                    setResult(data.result);
                }
                else if (response.status == 403) {
                    alert("User is not allowed to view this campaign");
                }
                else if (response.status == 404) {
                    alert((await response.json()).error);
                }
                else if (response.status == 401) {
                    alert("Unauthorized");
                }
                else {
                    alert("Error fetching result");
                }
                return;
            }
    
        const fetchResult = async () => {
            if (!reupdateResult) {
                await getResult();
            }
            const updateResult = await fetch(`/api/portal/result/updateResult?id=${campaignID}`, {
                method: 'PUT'
            });
            if (updateResult.status == 200) {
                await getResult();
            }
            else if (updateResult.status == 400) {
                const data = await updateResult.json();
                if (data.error == "Result already calculated!")
                    setReupdateResult(false);
            }
            else if (updateResult.status == 403) {
                alert("User is not allowed to view this campaign");
            }
            else if (updateResult.status == 404) {
                alert((await updateResult.json()).error);
            }
            else if (updateResult.status == 401) {
                alert("Unauthorized");
            }
            else {
                alert("Error updating result");
            }
    
        }

        fetchCampaign();
        fetchResult();

        if (refreshTime > 0) {
            const interval = setInterval(() => {
                fetchCampaign();
                fetchResult();
            }, refreshTime);
            return () => clearInterval(interval);
        }
    }, [refreshTime, campaignID, reupdateResult])

    const publishResult = async (isPublished) => {
        const response = await fetch('/api/portal/result/editPublishResult', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                CampaignID: campaignID,
                isResultsPublic: isPublished
            })
        });
        if (response.status == 200) {
            setIsResultPublished(isPublished);
        }
        else if (response.status == 401) {
            alert("Unauthorized");
        }
        else if (response.status == 404) {
            alert("Campaign not found");
        }
        else {
            alert("Error publishing result");
        }
    }
    return (
        <div className="flex flex-col flex-grow bg-[#f3f4f6]">
            <h1
                className="text-2xl font-bold p-8"
            >
                Campaign {isLive ? "Live" : ""} Result
            </h1>
            <div
                className="flex flex-col flex-grow bg-white mx-8 mb-8 p-8 space-y-4"
            >
                <div>
                    <h2
                        className="text-lg font-semibold"
                    >
                        Campaign Name: {campaign.name}
                    </h2>
                    <p
                        className="text-sm font-medium pl-4"
                    >
                        {isLive ? "Will Be" : ""} Completed On: {new Date(campaign.endDateTime).toLocaleString()}
                    </p>
                </div>
                <div
                    className="flex flex-col flex-grow space-y-4"
                >
                    <div className="flex flex-grow">
                        <div className="flex justify-center items-center">
                            <button
                                className="text-4xl p-4 bg-[#d0d1d3] hover:bg-[#f3f4f6] rounded-xl disabled:opacity-25 disabled:cursor-not-allowed"
                                disabled={round == 0 || result.type == "Default"}
                                onClick={() => setRound(prev => prev - 1)}
                            >
                                &#10094;
                            </button>
                        </div>
                        <div className="flex flex-col flex-grow">
                            <div
                                className="flex flex-grow-0 justify-between bg-[#f3f4f6] p-4 rounded-xl"
                            >
                                <h3 className="w-1/3">CANDIDATE NAME</h3>
                                <h3 className="w-1/3">VOTES</h3>
                                <h3 className="w-1/3">PERCENTAGE</h3>
                            </div>
                            {
                                result && Array.isArray(result.result) && result.result.length > round && 
                                result.result[round].map((candidate, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="flex flex-grow-0 justify-between p-4 bg-white rounded-xl"
                                        >
                                            <p className="w-1/3">{candidate.name}</p>
                                            <p className="w-1/3">{candidate.votes}</p>
                                            <p className="w-1/3">{((candidate.votes)/result.totalVotes)*100}%</p>
                                        </div>
                                    )
                                })
                            }
                            <div className="flex flex-grow flex-col space-y-4">
                            {
                                result && Array.isArray(result.result) && result.result.length > round && 
                                result.result[round].map((candidate, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="bg-[#f3f4f6] rounded-xl"
                                        >
                                            <div 
                                            className={`p-2 rounded-xl overflow-hidden text-sm text-center`} 
                                            style={{width: `${((candidate.votes)/result.totalVotes)*100}%`,
                                                    backgroundColor: candidate.votes == 0 ? "transparent" : `#${barColors[index % 6]}`
                                            }}>
                                                {candidate.name}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            </div>
                            <div className="flex flex-grow-0 justify-between p-4 rounded-xl text-sm font-thin">
                                Round {round+1} of {result?.result?.length}
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            <button
                                className="text-4xl p-4 bg-[#d0d1d3] hover:bg-[#f3f4f6] rounded-xl disabled:opacity-25 disabled:cursor-not-allowed"
                                disabled={result && Array.isArray(result.result) && (round == result.result.length - 1 || result.type == "Default")}
                                onClick={() => setRound(prev => prev + 1)}
                            >
                                &#10095;
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <ToggleSwitch
                        isChecked={isResultPublished}
                        handleCheckboxChange={() => publishResult(!isResultPublished)}
                        labelText="Publish Result"
                    />
                </div>
            </div>
        </div>
    )
}

export default Result