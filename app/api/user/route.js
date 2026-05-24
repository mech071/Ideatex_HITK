import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request) {

    try {

        const { searchParams } = new URL(request.url);

        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json(
                {
                    message: "Email is required",
                },
                {
                    status: 400,
                }
            );
        }

        const client = await clientPromise;

        const db = client.db("Prakriti");

        const collection = db.collection("user");

        const user = await collection.findOne({
            email: email,
        });

        if (!user) {
            return NextResponse.json(
                {
                    message: "User not found",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                user,
            },
            {
                status: 200,
            }
        );

    } catch (error) {

        return NextResponse.json(
            {
                message: "Something went wrong",
                error: error.message,
            },
            {
                status: 500,
            }
        );

    }

}