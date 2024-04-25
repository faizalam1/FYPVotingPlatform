import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const UserCampaignsPage = async ({ params }) => {
    const session = await getServerSession(authOptions);
    const user = session.user;
  return (
    <div>
        User {params.user} Campaigns Page
        <ul>
            <li>User ID: {user.id}</li>
            <li>Name: {user.name}</li>
            <li>Username: {user.username}</li>
            <li>Email: {user.email}</li>
            
        </ul>
    </div>
  )
}

export default UserCampaignsPage