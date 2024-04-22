import Link from "next/link"
import Image from "next/image"


const Navbar = () => {
  return (
    <nav
      className="bg-[#1F2937] text-white flex justify-between font-semibold font-sans w-full px-3 py-3">
      <Link href="/portal">
        <div className="items-center rounded-[10px] border-[2px] hover:bg-gray-700 px-3 py-2 hover:underline">
          SV Portal
        </div>
      </Link> 
      <div className="flex space-x-7">
      <Link href="/portal/campaigns/create">
        <button className="items-center rounded-[10px] border-[2px] hover:bg-gray-700 px-3 py-2 hover:underline">
          Create Campaign
        </button>
      </Link>
      <Link href="/portal/campaigns">
        <button className="items-center rounded-[10px] border-[2px] hover:bg-gray-700 px-3 py-2 hover:underline">
          Manage Campaigns
        </button>
      </Link>
      <Link href="/portal/campaigns/vote">
        <button className="items-center rounded-[10px] border-[2px] hover:bg-gray-700  px-3 py-2 hover:underline">
          Vote
        </button>
      </Link>
      <Link href="/portal/campaigns/results">
        <button className="items-center rounded-[10px] border-[2px] hover:bg-gray-700 px-3 py-2 hover:underline">
          Results
        </button>
      </Link>
      <button className="items-center rounded-full border-[2px] hover:bg-gray-700 px-3 py-2">
          <Image src="/assets/icons/notification.svg" alt="Notification" width={15} height={16} />
      </button>
      <button className="items-center rounded-full border-[2px] hover:bg-gray-700 px-3 py-2">
          <Image src="/assets/icons/profile.svg" alt="Profile" width={15} height={16} />
      </button>
      </div>
    </nav>
  )
}

export default Navbar