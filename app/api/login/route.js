import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request) {

    try {

        const { name, district, phone, email } = await request.json();

        if (!name || !district || !phone || !email) {
            return NextResponse.json(
                {
                    message: "All fields are required",
                },
                {
                    status: 400,
                }
            );
        }

        const client = await clientPromise;

        const db = client.db("Prakriti");

        const collection = db.collection("user");

        // check if user already exists
        const existingUser = await collection.findOne({
            email: email,
        });

        if (existingUser) {

            return NextResponse.json(
                {
                    message: "User already exists",
                    user: existingUser,
                },
                {
                    status: 200,
                }
            );

        }

        // insert new user
        await collection.insertOne({
            name,
            district,
            phone,
            email,
            createdAt: new Date(),
        });

        return NextResponse.json(
            {
                message: "Login successful",
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