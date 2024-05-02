import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

const page = async ({ params }) => {
    const session = await getServerSession(authOptions);
    const user = session.user;
    
    return (
        <div>{params.campaignID}</div>
    )
}

export default page