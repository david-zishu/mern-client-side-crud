import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Select from "react-select";
import Spinner from "../../components/Spinner/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "./Edit.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "./Edit.css";
import { getSingleUser, updateUser } from "../../services/Apis";
import { BASE_URL } from "../../services/helper";
import { useContext } from "react";
import { UpdateDataContext } from "../../context/ContextProvider";
const Edit = () => {
  const navigate = useNavigate();
  // status options
  const options = [
    { value: "Active", label: "Active" },
    { value: "InActive", label: "InActive" },
  ];
  const { id } = useParams();
  const [showSpin, setShowSpin] = useState(true);
  const [inputData, setInputData] = useState({
    fname: "",
    lname: "",
    email: "",
    mobile: "",
    gender: "",
    location: "",
  });

  const [status, setStatus] = useState("Active");
  const [imgData, setImagData] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");

  const { userUpdate, setUserUpdate } = useContext(UpdateDataContext);

  useEffect(() => {
    if (image) {
      setImagData("");
      setPreview(URL.createObjectURL(image));
    }

    setTimeout(() => {
      setShowSpin(false);
    }, 1200);
  }, [image]);

  // set status
  const handleStatus = (e) => {
    setStatus(e.value);
  };

  // SetInput Value
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  // set Profile
  const handleProfileImage = (e) => {
    setImage(e.target.files[0]);
  };

  // fetch single user
  const getUser = async () => {
    const response = await getSingleUser(id);
    if (response.status === 201) {
      setInputData(response.data);
      setStatus(response.data.status);
      setImagData(response.data.profile);
    } else {
      console.log("error");
    }
  };

  // handle user data
  const handleUserData = async (e) => {
    e.preventDefault();
    const { fname, lname, email, gender, mobile, location } = inputData;

    if (fname === "") {
      toast.error("First Name is required");
    } else if (lname === "") {
      toast.error("Last Name is required");
    } else if (email === "") {
      toast.error("Email is required");
    } else if (gender === "") {
      toast.error("Gender is required");
    } else if (mobile === "") {
      toast.error("Mobile is required");
    } else if (location === "") {
      toast.error("Location is required");
    } else if (!email.includes("@")) {
      toast.error("Enter valid email");
    } else if (mobile.length > 10) {
      toast.error("Enter valid mobile");
    } else {
      const data = new FormData();
      data.append("fname", fname);
      data.append("lname", lname);
      data.append("email", email);
      data.append("mobile", mobile);
      data.append("gender", gender);
      data.append("status", status);
      data.append("user_profile", image || imgData);
      data.append("location", location);

      const config = {
        "Content-Type": "multipart/form-data",
      };
      const response = await updateUser(id, data, config);
      if (response.status === 201) {
        setUserUpdate(response.data);
        navigate("/");
      }
    }
  };

  useEffect(() => {
    getUser();
  }, [id]);

  return (
    <>
      {showSpin ? (
        <Spinner />
      ) : (
        <div className="container">
          <h2 className="text-center mt-2">Update Your Details</h2>
          <Card className="shadow mt-3">
            <div className="profile_div text-center py-3">
              <img
                src={image ? preview : `${BASE_URL}/uploads/${imgData}`}
                alt={inputData.fname}
              />
            </div>
            <Form className="px-4 py-2">
              <Row>
                <Form.Group className="mb-3 col-lg-6">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fname"
                    value={inputData.fname}
                    onChange={handleInputChange}
                    placeholder="Enter First Name..."
                  />
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lname"
                    value={inputData.lname}
                    onChange={handleInputChange}
                    placeholder="Enter Last Name..."
                  />
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={inputData.email}
                    onChange={handleInputChange}
                    placeholder="Enter Email..."
                  />
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6">
                  <Form.Label>Mobile No.</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobile"
                    value={inputData.mobile}
                    onChange={handleInputChange}
                    placeholder="Enter Mobile No..."
                  />
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6">
                  <Form.Label>Select Gender</Form.Label>
                  <Form.Check
                    type={"radio"}
                    label={`Male`}
                    name="gender"
                    value={"Male"}
                    checked={inputData.gender === "Male" ? true : false}
                    onChange={handleInputChange}
                  />
                  <Form.Check
                    type={"radio"}
                    label={`Female`}
                    name="gender"
                    checked={inputData.gender === "Female" ? true : false}
                    value={"Female"}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6">
                  <Form.Label>Select Your Status</Form.Label>
                  <Select
                    defaultValue={status}
                    options={options}
                    onChange={handleStatus}
                  />
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6">
                  <Form.Label>Select Profile</Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    onChange={handleProfileImage}
                  />
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6">
                  <Form.Label>Enter Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={inputData.location}
                    onChange={handleInputChange}
                    placeholder="Enter Location..."
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  onClick={handleUserData}
                >
                  Update
                </Button>
              </Row>
            </Form>
          </Card>
          <ToastContainer position="top-center" />
        </div>
      )}
    </>
  );
};

export default Edit;
