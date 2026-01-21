import connectDB from "@/libs/mongodb";
import Estate from "@/models/Estate";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { 
      estateName, estateType, address, city, state, pincode,
      adminName, adminEmail, adminPhone, managementType, countryCode,
      totalUnits, securityContacts, amenities,
      username, password 
    } = body;

    // Basic validation
    if (!estateName || !estateType || !address || !city || 
        !adminName || !adminEmail || !adminPhone || 
        !totalUnits || !username || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if username or admin email already exists
    const existingEstate = await Estate.findOne({
      $or: [
        { username: username },
        { "admin.email": adminEmail }
      ]
    });

    if (existingEstate) {
      return NextResponse.json(
        { error: "Username or Email already registered" },
        { status: 409 }
      );
    }

    // Create new estate
    const newEstate = await Estate.create({
      name: estateName,
      type: estateType,
      address: {
        fullAddress: address,
        city: city,
        state: state,
        pincode: pincode
      },
      admin: {
        name: adminName,
        email: adminEmail,
        phone: `${countryCode || ''}${adminPhone}`
      },
      managementType,
      units: Number(totalUnits),
      securityContact: securityContacts,
      amenities,
      username,
      password // Note: In production, password must be hashed!
    });

    return NextResponse.json(
      { message: "Estate registered successfully", estateId: newEstate._id },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration validation error:", error);
    return NextResponse.json(
      { error: "Registration failed", details: error.message },
      { status: 500 }
    );
  }
}
