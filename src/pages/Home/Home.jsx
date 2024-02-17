import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Alert from "react-bootstrap/Alert";
import { ToastContainer, toast } from "react-toastify";
import Spinner from "../../components/Spinner/Spinner";
import Tables from "../../components/Tables/Tables";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { useState, useEffect, useContext } from "react";
import {
  AddDataContext,
  DeleteDataContext,
  UpdateDataContext,
} from "../../context/ContextProvider";
import { getAllUsers, deleteUser, exportCsv } from "../../services/Apis";

const Home = () => {
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("new");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  const { userAdd, setUserAdd } = useContext(AddDataContext);
  const { userUpdate, setUserUpdate } = useContext(UpdateDataContext);
  const { userDelete, setUserDelete } = useContext(DeleteDataContext);
  const [showSpin, setShowSpin] = useState(true);
  const navigate = useNavigate();

  const onAddUser = () => {
    navigate("/register");
  };

  //  handle export csv
  const handleExport = async () => {
    const response = await exportCsv();

    if (response.status === 200) {
      window.open(response.data.downloadUrl, "blank");
    } else {
      toast.error("error !");
    }
  };

  const getUsers = async () => {
    const response = await getAllUsers(search, gender, status, sort, page);

    if (response.status === 200) {
      setUsers(response.data.users);
      setPageCount(response.data.pagination.pageCount);
    } else {
      console.log("Something goes wrong!");
    }
  };

  //  pagination
  // handle prev bnt
  const handlePrevPageBtn = () => {
    setPage(() => {
      if (page === 1) return page;
      return page - 1;
    });
  };

  // handle next
  const handleNextPageBtn = () => {
    setPage(() => {
      if (page === pageCount) return page;
      return page + 1;
    });
  };

  useEffect(() => {
    getUsers();
    setTimeout(() => {
      setShowSpin(false);
    }, 1200);
  }, [search, gender, status, sort, page]);

  // handle delete
  const handleDelete = async (id) => {
    const response = await deleteUser(id);
    if (response.status === 201) {
      getUsers();
      setUserDelete(response.data);
    } else {
      console.log("Error");
    }
  };

  return (
    <>
      {userAdd ? (
        <Alert
          variant="success"
          className="text-center"
          onClose={() => setUserAdd("")}
          dismissible
        >
          {userAdd.fname} Successfully Added
        </Alert>
      ) : (
        ""
      )}
      {userUpdate ? (
        <Alert
          variant="primary"
          className="text-center"
          onClose={() => setUserUpdate("")}
          dismissible
        >
          {userUpdate.fname} updated successfully
        </Alert>
      ) : (
        ""
      )}
      {userDelete ? (
        <Alert
          variant="danger"
          className="text-center"
          onClose={() => setUserDelete("")}
          dismissible
        >
          {userDelete.fname} deleted successfully
        </Alert>
      ) : (
        ""
      )}
      <div className="container">
        <div className="main_div">
          {/* search add btn */}
          <div className="search_add mt-4 d-flex justify-content-between">
            <div className="search col-lg-4">
              <Form className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="success" className="search_btn">
                  Search
                </Button>
              </Form>
            </div>
            <div className="add_btn">
              <Button variant="primary" onClick={onAddUser}>
                <i className="fa-solid fa-plus"></i>&nbsp; Add User
              </Button>
            </div>
          </div>
          {/* export,gender,status */}

          <div className="filter_div mt-5 d-flex justify-content-between flex-wrap">
            <div className="export_csv">
              <Button className="export_btn" onClick={handleExport}>
                Export To Csv
              </Button>
            </div>
            <div className="filter_gender">
              <div className="filter">
                <h3>Filter By Gender</h3>
                <div className="gender d-flex justify-content-between">
                  <Form.Check
                    type={"radio"}
                    label={`All`}
                    name="gender"
                    value={"All"}
                    onChange={(e) => setGender(e.target.value)}
                    defaultChecked
                  />
                  <Form.Check
                    type={"radio"}
                    label={`Male`}
                    name="gender"
                    value={"Male"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  <Form.Check
                    type={"radio"}
                    label={`Female`}
                    name="gender"
                    value={"Female"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* sort by value */}
            <div className="filter_newold">
              <h3>Sort By Value</h3>
              <Dropdown className="dropdown text-center">
                <Dropdown.Toggle className="dropdown_btn" id="dropdown-basic">
                  <i className="fa-solid fa-sort"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setSort("new")}>
                    New
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSort("old")}>
                    Old
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            {/* filter by status */}
            <div className="filter_status">
              <div className="status">
                <h3>Filter By Status</h3>
                <div className="status_radio d-flex justify-content-between flex-wrap">
                  <Form.Check
                    type={"radio"}
                    label={`All`}
                    name="status"
                    value={"All"}
                    onChange={(e) => setStatus(e.target.value)}
                    defaultChecked
                  />
                  <Form.Check
                    type={"radio"}
                    label={`Active`}
                    name="status"
                    value={"Active"}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                  <Form.Check
                    type={"radio"}
                    label={`InActive`}
                    name="status"
                    value={"InActive"}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {showSpin ? (
          <Spinner />
        ) : (
          <Tables
            users={users}
            onDeleteUser={handleDelete}
            onGetAllUsers={getUsers}
            handlePrevPageBtn={handlePrevPageBtn}
            handleNextPageBtn={handleNextPageBtn}
            page={page}
            pageCount={pageCount}
            setPage={setPage}
          />
        )}
      </div>
    </>
  );
};

export default Home;
