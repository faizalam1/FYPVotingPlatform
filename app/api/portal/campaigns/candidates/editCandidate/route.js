import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "@/utils/database";
import Campaign from "@/models/campaign";
import Candidate from "@/models/candidate";
import uploadCandidatePicture from "@/utils/uploadCandidatePicture";
import { NextResponse } from "next/server";

export async function PUT(req) {
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
    const id = formdata.get("id")

    if (!id) {
        return NextResponse.json({ error: "Candidate ID is required!" }, { status: 400 });
    }

    const nameRegex = /^[a-zA-Z]([a-zA-Z0-9\-_ ]*[a-zA-Z0-9])?$/
    const urlRegex = /^(http|https):\/\/[^ "]+$/

    if (
        !(nameRegex.test(name) &&
        description.length < 1024 &&
        (image == null ||
        (typeof image === "string" &&
        urlRegex.test(image)) ||
        (image instanceof File &&
        image.name.split(".")[1].match(/(jpg|jpeg|png)/) &&
        image.size <= 1024 * 1024 * 2 &&
        image.name.split(".").length === 2)))
        ){
            return NextResponse.json({ error: "Invalid data!" }, { status: 400 });
        }
    try {
        await connectToDatabase();
        const oldCandidate = await Candidate.findById(id);
        if (!oldCandidate) {
            return NextResponse.json({ error: "Candidate not found!" }, { status: 404 });
        }
        const campaign = await Campaign.findById(oldCandidate.campaignID);
        if (!campaign) {
            return NextResponse.json({ error: "Campaign not found!" }, { status: 404 });
        }
        if (campaign.createdBy.toString() !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
        }
        let newImage = image
        if (image instanceof File)
            newImage = await uploadCandidatePicture(image,`${user.username}/${campaign.name}`);

        oldCandidate.name = name;
        oldCandidate.description = description;
        oldCandidate.image = newImage;
        oldCandidate.additionalFields = additionalFields;
        await oldCandidate.save();
        
        return NextResponse.json({ message: "Candidate updated successfully!" });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal Server Error!" }, { status: 500 });
    }
}