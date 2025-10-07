import mongoose, {Document, Schema, Types} from "mongoose";

export interface ICoupon extends Document {
    created: Date;
    code: string;
    email: string;
    duration: string;
    durationInMonths?: number;
    redeemBy?: Date;
    maxRedemptions?: number;
    timesRedeemed: number;
    percentOff?: number;
    amountOff?: number;
    currency?: string;
    isDeleted?: boolean;
}

const CouponSchema: Schema<ICoupon> = new Schema<ICoupon>({
    created: { type: Date, required: true, default: Date.now },
    code: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    duration: { type: String, required: true, enum: ['forever', 'once', 'repeating'] },
    durationInMonths: { type: Number, required: function() { return this.duration === 'repeating'; } },
    redeemBy: { type: Date },
    maxRedemptions: { type: Number, min: 1 },
    timesRedeemed: { type: Number, required: true, default: 0 },
    percentOff: { type: Number, min: 1, max: 100 },
    amountOff: { type: Number, min: 0 },
    currency: { type: String, required: function() { return this.amountOff != null; } },
    isDeleted: { type: Boolean, default: false },
})

const Coupon = mongoose.model<ICoupon>("Coupon", CouponSchema);

export default Coupon;
