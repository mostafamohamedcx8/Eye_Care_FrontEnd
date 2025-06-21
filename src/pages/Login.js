import Header from "../component/Header";
import NavBar from "../component/NavBar";
import { Link } from "react-router-dom";
import Footer from "../component/Footer";
import { Button, Container, Form, Row, Spinner } from "react-bootstrap";
import { Login_Hook } from "../Hook/Login_Hook";

const LoginSection = () => {
  const [
    email,
    password,
    loading,
    ispress,
    HandelSubmit,
    onChangeEmail,
    onChangePassword,
  ] = Login_Hook();

  return (
    <>
      {/* Hero Section */}
      <Row>
        <div className="hero-section">
          <div className="overlay hero-section">
            <div className="breadcrumb">
              <Link to="/" className="breadcrumb-link">
                Home
              </Link>
              <span className="separator">/</span>
              <span className="active">Login</span>
            </div>
            <h1 className="title">Login</h1>
          </div>
        </div>
      </Row>

      {/* Content Section */}
      <Container
        className="mt-5 mb-5 p-4 border rounded shadow"
        style={{ maxWidth: "600px", backgroundColor: "#f8f9fa" }}
      >
        <h2 className="text-center mb-4">Login</h2>
        <Form onSubmit={HandelSubmit}>
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Email"
              value={email}
              onChange={onChangeEmail}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={onChangePassword}
            />
          </Form.Group>

          <Button type="submit" className="w-100 mb-2 welcome-button">
            Log In
          </Button>

          <div className="text-center ">
            <small>
              Forgotten password <a href="/ResetPassword">Click here</a>
            </small>
            <br />
            <small>
              Don't have an account? <a href="/Signup">Sign Up</a>
            </small>
          </div>
        </Form>
        {ispress ? (
          loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <h4> done </h4>
          )
        ) : null}
      </Container>
    </>
  );
};
const Login = () => {
  return (
    <div className="color-body">
      <Header />
      <NavBar />
      <LoginSection />
      <Footer />
    </div>
  );
};

export default Login;
