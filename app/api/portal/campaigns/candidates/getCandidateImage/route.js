import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import downloadCandidatePicture from "@/utils/downloadCandidatePicture";
import { NextResponse } from "next/server";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
  }

  const {searchParams} = new URL(req.url);
  const imageURL = decodeURIComponent(searchParams.get('url'))

  if (!imageURL) {
    return NextResponse.json({ error: "Image URL not provided!" }, { status: 400 });
  }

  try{
    const image = await downloadCandidatePicture(imageURL);
    if (!image) {
      return NextResponse.json({ error: "Image not found!" }, { status: 404 });
    }
  
    return NextResponse.json(image);
  }
  catch(err){
    return NextResponse.json({ error: "Internal Server Error!" }, { status: 500 });
  }
}