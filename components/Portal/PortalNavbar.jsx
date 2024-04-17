import Link from "next/link"
import Image from "next/image"


const Navbar = () => {
  return (
    <nav
      className="bg-[#1F2937] text-white flex justify-between p-4"
    >
      <p>
        SV Portal
      </p>
      <ul className="flex justify-between space-x-4">
        <li>
          <Link href="/portal/campaigns/create">Create Campaign</Link>
        </li>
        <li>
          <Link href="/portal/campaigns">Manage Campaigns</Link>
        </li>
        <li>
          <Link href="/portal/campaigns/vote">Vote</Link>
        </li>
        <li>
          <Link href="/portal/campaigns/results">Results</Link>
        </li>
        <li className="pt-1">
          <Image src="/assets/icons/notification.svg" alt="Notification" width={12} height={12} />
        </li>
        <li className="pt-1">
          <Image src="/assets/icons/profile.svg" alt="Profile" width={16} height={16} />
        </li>
      </ul>
    </nav>
  )
}

export default Navbar