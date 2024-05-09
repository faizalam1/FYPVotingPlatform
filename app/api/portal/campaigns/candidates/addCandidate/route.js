import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/utils/database";
import Campaign from "@/models/campaign";
import Candidate from "@/models/candidate";
import uploadCandidatePicture from "@/utils/uploadCandidatePicture";
import { NextResponse } from "next/server";

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }

    const user = session.user;

    const formdata = await req.formData();
    const name = formdata.get("name");
    const description = formdata.get("description")
    const image = formdata.get("image");
    const additionalFields = JSON.parse(formdata.get("additionalFields"));
    const campaignID = formdata.get("campaignID")

    if (!name || !description || !campaignID) {
        return NextResponse.json({ error: "Name, description and campaign ID are required!" }, { status: 400 });
    }

    const nameRegex = /^[a-zA-Z]([a-zA-Z0-9\-_ ]*[a-zA-Z0-9])?$/

    if (
        !(nameRegex.test(name) &&
        description.length >= 10 &&
        description.length < 500 &&
        image == null ||
        (image instanceof File &&
        image.name.split(".")[1].match(/(jpg|jpeg|png)/) &&
        image.size <= 1024 * 1024 * 2 &&
        image.name.split(".").length === 2))
        ){
            return NextResponse.json({ error: "Invalid data!" }, { status: 400 });
        }
    try {
        await connectToDatabase();
        const campaign = await Campaign.findById(campaignID);
        if (!campaign) {
            return NextResponse.json({ error: "Campaign not found!" }, { status: 404 });
        }
        if (campaign.createdBy.toString() !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
        }
        const candidate = await Candidate.findOne({name:name, campaignID: campaignID});
        if (candidate) {
            return NextResponse.json({ error: "Candidate already exists!" }, { status: 400 });
        }
        let imageURL = ""
        if (image)
            imageURL = await uploadCandidatePicture(image,`${user.username}/${campaign.name}`);

        const newCandidate = await Candidate.create({ name:name, description:description, image:imageURL, additionalFields:additionalFields, campaignID:campaignID });
        
        return NextResponse.json({ message: "Candidate Added successfully!" });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal Server Error!" }, { status: 500 });
    }
}