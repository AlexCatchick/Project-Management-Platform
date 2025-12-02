import { timeStamp } from 'console';
import mongoose, { Schema } from 'mongoose';
import jwt from "jsonwebtoken";
import crypto from "crypto-js";
//new Schema({fields, {timeseries or timestamps}})
const UserSchema = new Schema({
    avatar: {
        type: {
            url: String,
            localPath: String
        },
        default: {
            url: "https://placehold.co/600x400",
            localPath: "/"
        }
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,

    },
    fullName: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String
    },
    forgotPasswordToken: {
        type: String
    },
    forgotPasswordTokenExpiry: {
        type: Date
    },
    emailVerificationToken: {
        type: String
    },
    emailVerificationExpiry: {
        type: Date
    }

},
    {
        timestamps: true
    });
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password, 10)
    next()
})
UserSchema.methods.isPasswordCorrect = async (password) => {
    return await bcrypt.compare(password, this.password);
}
UserSchema.methods.generateAccessToken = () => {
    //jwt.sign({payload},secret,expiryDuration)
    return jwt.sign({
        _id: this._id,
        email: this.email,
        password: this.password
    },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    )
}
UserSchema.methods.generateRefreshToken = () => {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        password: this.password
    },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    )
}
UserSchema.methods.generateRandomCode = () => {
    const x = crypto.randomBytes(20).toString("hex");
    const hashed_x = crypto.createHash("SHA256").update(x).digest("hex")
    const tokenExpiry = Date.now() + (20 * 60 * 1000); //20 mins
    return { x, hashed_x, tokenExpiry };
}
const UserModel = mongoose.model('User', UserSchema);
export default UserModel;