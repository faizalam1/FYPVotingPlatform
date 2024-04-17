import Card from "@/components/Card"

const PortalHomePage = () => {

  return (
    <div
      className="flex flex-col justify-evenly items-center bg-[#F3F4F6] min-w-screen min-h-screen p-8 text-black space-y-24"
    >
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-semibold">
          Welcome to the Voting Management Portal
        </h1>
        <p>
          All your voting needs in one place.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-4 items-baseline">
        <Card imageSrc="/assets/icons/add.svg" heading="Create Campaign" content="Start a new voting campaign with ease." width={80} />
        <Card imageSrc="/assets/icons/list.svg" heading="Manage Campaigns" content="Oversee your active and upcoming campaigns." width={80} />
        <Card imageSrc="/assets/icons/vote.svg" heading="Vote" content="Cast your vote in ongoing campaigns." width={80} />
        <Card imageSrc="/assets/icons/analysis.svg" heading="Results" content="View the results of completed campaigns." width={80} />
      </div>
    </div>
  )
}

export default PortalHomePage