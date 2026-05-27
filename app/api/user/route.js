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

export async function PATCH(request) {

    try {

        const { email, district, land_area_acres } =
            await request.json();

        if (!email || !district || !land_area_acres) {
            return NextResponse.json(
                {
                    message: "Email, district and land area are required",
                },
                {
                    status: 400,
                }
            );
        }

        const landArea = Number(land_area_acres);

        if (!Number.isFinite(landArea) || landArea <= 0) {
            return NextResponse.json(
                {
                    message: "Land area must be greater than 0",
                },
                {
                    status: 400,
                }
            );
        }

        const client = await clientPromise;
        const db = client.db("Prakriti");
        const collection = db.collection("user");

        const result = await collection.findOneAndUpdate(
            {
                email,
            },
            {
                $set: {
                    district: district.trim(),
                    land_area_acres: landArea,
                    updatedAt: new Date(),
                },
            },
            {
                returnDocument: "after",
            }
        );

        if (!result) {
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
                message: "Settings updated",
                user: result,
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
