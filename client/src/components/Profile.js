import axios from "axios";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import profile from "../assets/avatar_2.jpeg";
import styles from "../styles/Username.module.css";

const Profile = () => {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "email@gmail.com",
    address: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  async function fetchUserInfo() {
    try {
      const response = await axios.get("http://localhost:5000/api/user/sharma");
      const userData = response.data.user;
      setFormData({
        username: userData.username,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        mobileNumber: userData.mobile || "",
        email: userData.email,
        address: userData.address || "",
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const { firstName, lastName, mobileNumber, email, address } = formData;
    const namePattern = /^[a-zA-Z]{2,}$/;
    if (firstName !== "" && !namePattern.test(firstName)) {
      toast.error("Invalid firstName");
      return false;
    }
    if (lastName !== "" && !namePattern.test(lastName)) {
      toast.error("Invalid lastName");
      return false;
    }
    const mobilePattern = /^[0-9]{10}$/;
    if (mobileNumber !== "" && !mobilePattern.test(mobileNumber)) {
      toast.error("Mobile Number should contain exactly 10 digits");
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (address !== "" && address.length < 5) {
      toast.error("Please enter a valid address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, firstName, lastName, mobile, address, profile } = formData;
    if (validateForm()) {
      try {
        const response = await axios.put(
          `http://localhost:5000/api/user/updateUser/${formData.username}`,
          { email, firstName, lastName, mobile, address, profile }
        );
        console.log("Update response:", response);
        toast.success(response.data.message);
        fetchUserInfo();
      } catch (error) {
        toast.error(error.response.data.message);
        console.error("Update error:", error);
      }
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center h-screen">
      <Toaster />
      <div className={`${styles.glass} py-2`}>
        <div className="flex flex-col items-center">
          <h4 className="text-5xl font-bold">Profile</h4>
          <span className="py-1 text-base w-2/3 text-center text-gray-500">
            @{formData.username}
          </span>
        </div>
        <form className="py-1 " onSubmit={handleSubmit}>
          <div className="flex justify-center py-2">
            <label htmlFor="profile" className="cursor-pointer">
              <img
                src={imageUrl || profile}
                className={styles.profile_img}
                alt="avatar"
              />
            </label>
            <input
              type="file"
              accept="image/*"
              id="profile"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div className="flex flex-col items-center gap-2 ">
            <div className="flex gap-2">
              <input
                className={styles.textBox}
                type="text"
                placeholder="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              <input
                className={styles.textBox}
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="flex gap-2">
              <input
                className={styles.textBox}
                type="number"
                placeholder="Mobile Number"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
              />
              <input
                className={styles.textBox}
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <input
              className={styles.textBox}
              type="text"
              placeholder="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            <button className={styles.btn} type="submit">
              Update
            </button>
          </div>

          <div className="text-center py-4">
            <span className="text-gray-500">
              Come back Later ?{" "}
              <Link className="text-red-500" to="/register">
                Log Out
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
