import User from "../models/User.js";

export const getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const updateProfile = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      height,
      currentWeight,
      targetWeight,
      goal,
      activityLevel,
      profileImage,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) user.name = name;
    if (age !== undefined) user.age = age || null;
    if (gender !== undefined) user.gender = gender || null;
    if (height !== undefined) user.height = height || null;
    if (currentWeight !== undefined) user.currentWeight = currentWeight || null;
    if (targetWeight !== undefined) user.targetWeight = targetWeight || null;
    if (goal !== undefined) user.goal = goal || null;
    if (activityLevel !== undefined) user.activityLevel = activityLevel;
    if (profileImage !== undefined && profileImage) {
      user.profileImage = profileImage;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (req.file) {
      user.profileImage = req.file.path;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully.",
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.error("Upload Profile Image Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
