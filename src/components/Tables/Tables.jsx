import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";
import { ToastContainer, toast } from "react-toastify";
import Badge from "react-bootstrap/Badge";
import { Link } from "react-router-dom";
import "./Table.css";
import { BASE_URL } from "../../services/helper";
import { updateUserStatus } from "../../services/Apis";
import Paginations from "../Pagination/Paginations";

const Tables = ({
  users,
  onDeleteUser,
  onGetAllUsers,
  handlePrevPageBtn,
  handleNextPageBtn,
  page,
  pageCount,
  setPage,
}) => {
  const handleStatusChange = async (id, status) => {
    const response = await updateUserStatus(id, status);

    if (response.status === 201) {
      onGetAllUsers();
      toast.success("Status Updated");
    } else {
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <div className="container mt-2">
        <Row>
          <div className="col">
            <Card className="shadow">
              <Table className="align-items-center" responsive="sm">
                <thead className="thead-dark">
                  <tr className="table-dark">
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>Status</th>
                    <th>Profile</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((element, index) => {
                      return (
                        <tr key={element._id}>
                          <td>{index + 1 + (page - 1) * 4}</td>
                          <td>{element.fname + " " + element.lname}</td>
                          <td>{element.email}</td>
                          <td>{element.gender == "Male" ? "M" : "F"}</td>
                          <td className="d-flex align-items-center">
                            <Dropdown className="text-center">
                              <Dropdown.Toggle
                                className="dropdown_btn"
                                id="dropdown-basic"
                              >
                                <Badge
                                  bg={
                                    element.status == "Active"
                                      ? "primary"
                                      : "danger"
                                  }
                                >
                                  {element.status}
                                  <i className="fa-solid fa-angle-down"></i>
                                </Badge>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item
                                  onClick={() =>
                                    handleStatusChange(element._id, "Active")
                                  }
                                >
                                  Active
                                </Dropdown.Item>
                                <Dropdown.Item
                                  onClick={() =>
                                    handleStatusChange(element._id, "InActive")
                                  }
                                >
                                  InActive
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                          <td className="img_parent">
                            <img
                              src={`${BASE_URL}/uploads/${element.profile}`}
                              alt="img"
                            />
                          </td>
                          <td>
                            <Dropdown>
                              <Dropdown.Toggle
                                variant="light"
                                className="action"
                                id="dropdown-basic"
                              >
                                <i className="fa-solid fa-ellipsis-vertical"></i>
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item>
                                  <Link
                                    to={`/userprofile/${element._id}`}
                                    className="text-decoration-none"
                                  >
                                    <i
                                      className="fa-solid fa-eye"
                                      style={{ color: "green" }}
                                    ></i>{" "}
                                    <span>View</span>
                                  </Link>
                                </Dropdown.Item>
                                <Dropdown.Item>
                                  <Link
                                    to={`/edit/${element._id}`}
                                    className="text-decoration-none"
                                  >
                                    <i
                                      className="fa-solid fa-pen-to-square"
                                      style={{ color: "blue" }}
                                    ></i>{" "}
                                    <span>Edit</span>
                                  </Link>
                                </Dropdown.Item>
                                <Dropdown.Item>
                                  <div
                                    onClick={() => onDeleteUser(element._id)}
                                  >
                                    <i
                                      className="fa-solid fa-trash"
                                      style={{ color: "red" }}
                                    ></i>{" "}
                                    <span>Delete</span>
                                  </div>
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <div className="no_data text-center">No data found!</div>
                  )}
                </tbody>
              </Table>
              <Paginations
                handlePrevPageBtn={handlePrevPageBtn}
                handleNextPageBtn={handleNextPageBtn}
                page={page}
                pageCount={pageCount}
                setPage={setPage}
              />
            </Card>
          </div>
        </Row>
        <ToastContainer />
      </div>
    </>
  );
};

export default Tables;
