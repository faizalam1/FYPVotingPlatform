'use client';
import Card from "@/components/Card";
import Link from "next/link";

const HomePage = () => {
    return (
        <div
            className="flex flex-col justify-center items-center bg-[#F3F4F6] w-full text-black font-sans"
        >
            <div className="flex flex-col items-center p-8 pb-24">
                <h1 className="text-2xl font-semibold">
                    Welcome to the Voting Management Portal
                </h1>
                <p>
                    All your voting needs in one place.
                </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
                <Link href="/portal/campaigns/create">
                    <Card imageSrc="/assets/icons/add.svg" heading="Create Campaign" content="Start a new voting campaign with ease." width={80} />
                </Link>
                <Link href="/portal/campaigns">
                    <Card imageSrc="/assets/icons/list.svg" heading="Manage Campaigns" content="Oversee your active and upcoming campaigns." width={80} />
                </Link>
                <Link href="/portal/vote">
                    <Card imageSrc="/assets/icons/vote.svg" heading="Vote" content="Cast your vote in ongoing campaigns." width={80} />
                </Link>
                <Link href="/portal/campaigns/results">
                    <Card imageSrc="/assets/icons/analysis.svg" heading="Results" content="View the results of completed campaigns." width={80} />
                </Link>
            </div>
        </div>
    )
}

export default HomePage