import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import UserCampaigns from '@/components/Portal/UserCampaigns';

const UserCampaignsPage = async ({ params }) => {
  const session = await getServerSession(authOptions);
  const user = session.user;
  if (user.username !== params.user) {
    redirect(`/portal/campaigns/${user.username}`);
  }

  return (
    <>
      <UserCampaigns />
    </>
  )
}

export default UserCampaignsPage