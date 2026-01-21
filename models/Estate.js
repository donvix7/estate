import mongoose from "mongoose";

const estateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Estate name is required'],
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Estate type is required'],
        enum: ['apartment', 'gated', 'townhouse', 'villa', 'cooperative']
    },
    address: {
        fullAddress: { type: String, required: true },
        city: { type: String, required: true },
        state: String,
        pincode: String
    },
    admin: {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true }
    },
    managementType: {
        type: String,
        enum: ['owner', 'association', 'professional'],
        default: 'owner'
    },
    units: {
        type: Number,
        required: true,
        min: 1
    },
    securityContact: {
        type: String,
        required: true
    },
    amenities: [String],
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Estate = mongoose.models.Estate || mongoose.model("Estate", estateSchema);

export default Estate;
