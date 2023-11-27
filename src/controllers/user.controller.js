import { User } from '../model/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if ([name, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ email }],
    });

    if (existedUser) {
        throw new ApiError(409, "User Email id already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    const cloudinaryUploadResult = await uploadOnCloudinary(avatarLocalPath);

    if (!cloudinaryUploadResult) {
        throw new ApiError(400, "Error uploading avatar to Cloudinary");
    }

    const user = await User.create({
        email: email.toLowerCase(),
        avatar: cloudinaryUploadResult.url, 
        password,
        name
    });

    const createUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createUser, "User registered Successfully")
    );
});

export { registerUser };
