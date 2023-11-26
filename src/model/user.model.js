import mongoose, {Schema, mongo} from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new Schema(
    {
        email: {
            type: String,
            trim: true,
            required: [ true, "Email is required"],
            unique: true,
            index: true
        },
        password: {
            type: String,
            required: [true, "password is required"],
        },
        name: {
                type: String,
                required: true,
                maxLength: [20, "Name must be less than 20 charater"]
        },
        avatar: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String
        }

    },{timestamps: true}
);

// Middleware to hash the pasword before savind

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 15);
    }
    next();
})

// Mthods to chek if the entered password is correct
userSchema.methods.isPasswordCurrect = async function(password){
    return await
    bcrypt.compare(password, this.password)
}


// methods to generate an access token for the user is called snipped

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
        _id: this._id,
        email: this.email,
        password: this.password,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
};

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



// Creating the User model uing the userSchama
export const User = mongoose.model("User", userSchema);