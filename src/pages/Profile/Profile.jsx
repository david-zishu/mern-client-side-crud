import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Spinner from "../../components/Spinner/Spinner";
import "./Profile.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSingleUser } from "../../services/Apis";
import { BASE_URL } from "../../services/helper";
import moment from "moment";

const Profile = () => {
  const { id } = useParams();
  const [userprofile, setUserProfile] = useState({});
  const [showspin, setShowSpin] = useState(true);

  const userProfileGet = async () => {
    const response = await getSingleUser(id);
    if (response.status === 201) {
      console.log(response.data);
      setUserProfile(response.data);
    } else {
      console.log("error while fetch single user");
    }
  };

  useEffect(() => {
    userProfileGet();
    setTimeout(() => {
      setShowSpin(false);
    }, 1200);
  }, [id]);

  return (
    <>
      {showspin ? (
        <Spinner />
      ) : (
        <div className="container">
          <Card className="card-profile shadow col-lg-6 mx-auto mt-5">
            <Card.Body>
              <Row>
                <div className="col">
                  <div className="card-profile-stats d-flex justify-content-center">
                    <img
                      src={`${BASE_URL}/uploads/${userprofile.profile}`}
                      alt={userprofile.fname}
                    />
                  </div>
                </div>
              </Row>
              <div className="text-center">
                <h3>{userprofile.fname + userprofile.lname}</h3>
                <h4>
                  <i className="fa-solid fa-envelope email"></i>&nbsp;:-{" "}
                  <span>{userprofile.email}</span>{" "}
                </h4>
                <h5>
                  <i className="fa-solid fa-mobile"></i>&nbsp;:-{" "}
                  <span>{userprofile.mobile}</span>{" "}
                </h5>
                <h4>
                  <i className="fa-solid fa-person"></i>&nbsp;:-{" "}
                  <span>{userprofile.gender}</span>{" "}
                </h4>
                <h4>
                  <i className="fa-solid fa-location-pin location"></i>&nbsp;:-{" "}
                  <span>{userprofile.location}</span>{" "}
                </h4>
                <h4>
                  Status&nbsp;:- <span>{userprofile.status}</span>{" "}
                </h4>
                <h5>
                  <i className="fa-solid fa-calendar-days calendar"></i>
                  &nbsp;Date Created&nbsp;:-{" "}
                  <span>
                    {moment(userprofile.createdAt).format("DD-MM-YYYY")}
                  </span>{" "}
                </h5>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
    </>
  );
};

export default Profile;
