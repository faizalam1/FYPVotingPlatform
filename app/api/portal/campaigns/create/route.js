import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/utils/database';
import { Campaign } from '@/models/campaign';
import { Candidate } from '@/models/candidate';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const session = getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            { error: "Unauthorized!" },
            { status: 401 }
        );
    }

    const campaign = req.body;
    const user = session.user;
    console.log({ campaign, user })

    const campaignNameRegex = new RegExp(/^[a-zA-Z0-9 ]+$/);
    const votingTypeRegex = new RegExp(/^(Default|Ranked)$/);
    const datetimeISORegex = new RegExp(/^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))$/);
    const domainsRegex = new RegExp(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
    const candidateNameRegex = /^[a-zA-Z]([a-zA-Z0-9\-_ ]*[a-zA-Z0-9])?$/

    if (!(campaignNameRegex.test(campaign.campaignName) &&
        campaign.campaignDescription.length >= 10 &&
        votingTypeRegex.test(campaign.votingType) &&
        datetimeISORegex.test(campaign.campaignStart) &&
        datetimeISORegex.test(campaign.campaignEnd) &&
        new Date(campaign.campaignEnd) > new Date() &&
        new Date(campaign.campaignStart) < new Date(campaign.campaignEnd) &&
        (campaign.isRestrictedByEmail ? 
            ((campaign.domains.length > 0) && campaign.domains.every(domain => domainsRegex.test(domain)))
            : 
            true
        ) &&
        campaign.numberOfCandidates >= 2 &&
        campaign.numberOfCandidates == campaign.candidates.length &&
        (campaign.areAdditionalFieldsRequired ? 
            campaign.numberOfAdditionalFields > 0
            :
            true
        ) &&
        campaign.areCandidatesValid &&
        campaign.candidates.every(candidate => 
            candidateNameRegex.test(candidate.name) && 
            candidate.description.length >= 10 && 
            candidate.additionalFields.length == campaign.numberOfAdditionalFields &&
            candidate.additionalFields.every(field => field.name && field.value)
        )
    )) {
        return NextResponse.json(
            { error: "Invalid Campaign Data!" },
            { status: 400 }
        );
    }

    try{
        await connectToDatabase();
    }
    catch(err){
        return NextResponse.json(
            { error: "Internal Server Error!" },
            { status: 500 }
        );
    }

    // const campaignNameExists = await Campaign.findOne({ name: campaign.campaignName, createdBy: user.id });
    // if (campaignNameExists) {
    //     return NextResponse.json(
    //         { error: "Campaign name already exists!" },
    //         { status: 400 }
    //     );
    // }

    // const campaignRecord = await Campaign.create({
    //     name: campaign.campaignName,
    //     description: campaign.campaignDescription,
    //     votingType: campaign.votingType,
    //     startDateTime: new Date(campaign.campaignStart),
    //     endDateTime: new Date(campaign.campaignEnd),
    //     isRestrictedByEmail: campaign.isRestrictedByEmail,
    //     restrictedDomains: campaign.domains,
    //     numberOfCandidates: campaign.numberOfCandidates,
    //     createdBy: user.id
    // });

    // for (let i = 0; i < campaign.numberOfCandidates; i++) {
    //     const candidate = campaign.candidates[i];
    //     const candidateRecord = await Candidate.create({
    //         name: candidate.name,
    //         description: candidate.description,
    //         additionalFields: candidate.additionalFields,
    //         campaign: campaignRecord.id
    //     });
    // }

    return NextResponse.json(
        { message: "Campaign created successfully!" },
        { status: 201 }
    );


}