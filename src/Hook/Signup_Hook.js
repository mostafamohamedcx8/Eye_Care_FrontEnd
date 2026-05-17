import { useEffect, useState } from "react";
import { State, City } from "country-state-city";
import { useDispatch, useSelector } from "react-redux";
import { CreateUser } from "../Redux/actions/Useraction";
import { validateSignupForm } from "../Validations/validateSignupForm";
import notify from "../Hook/useNotification";
import { useNavigate } from "react-router-dom";

export const Signup_Hook = (t) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // --- States ---
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedcity, setSelectedcity] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [imagemedicallicense, setimagemedicallicense] = useState(null);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+49");
  const [dateOfBirthDay, setDateOfBirthDay] = useState("");
  const [dateOfBirthMonth, setDateOfBirthMonth] = useState("");
  const [dateOfBirthYear, setDateOfBirthYear] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [salutation, setsalutation] = useState("");
  const [fullAddress, setFullAddress] = useState("");

  const [loading, setloading] = useState(true);
  const [ispress, setispress] = useState(false);

  const User = useSelector((state) => state.alluser.User);

  // --- Helpers ---
  const fullPhoneNumber = countryCode + phoneNumber;

  // --- Effects ---
  useEffect(() => {
    const germanStates = State.getStatesOfCountry("DE");
    setStates(germanStates);
  }, []);

  useEffect(() => {
    if (selectedState) {
      const foundCities = City.getCitiesOfState("DE", selectedState);
      setCities(foundCities);
    }
  }, [selectedState]);

  // --- Handlers ---
  const resetFormFields = () => {
    setFirstname("");
    setLastname("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPhoneNumber("");
    setsalutation("");
    setDateOfBirthDay("");
    setDateOfBirthMonth("");
    setDateOfBirthYear("");
    setSelectedState("");
    setSelectedcity("");
    setFullAddress("");
    setPostalCode("");
    setimagemedicallicense(null);
    setloading(true);
    setispress(false);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleShowModal = (e) => {
    e.preventDefault();
    const isValid = validateSignupForm({
      firstname,
      lastname,
      email,
      password,
      passwordConfirm: confirmPassword,
      phoneNumber,
      countryCode,
      dateOfBirthDay,
      dateOfBirthMonth,
      dateOfBirthYear,
      salutation,
      postalCode,
      state: selectedState,
      city: selectedcity,
      fullAddress,
      t,
    });

    if (!isValid) return;
    setShowModal(true);
  };

  // --- Inputs Handlers ---
  const onChangefirstname = (e) => setFirstname(e.target.value);
  const onChangelastname = (e) => setLastname(e.target.value);
  const onChangeEmail = (e) => setEmail(e.target.value);
  const onChangedPassword = (e) => setPassword(e.target.value);
  const onChangeConfirmPassword = (e) => setConfirmPassword(e.target.value);
  const onChangePhoneNumber = (e) => setPhoneNumber(e.target.value);
  const onChangeCountryCode = (e) => setCountryCode(e.target.value);
  const onChangedSelectedState = (e) => setSelectedState(e.target.value);
  const onChangedSelectedcity = (e) => setSelectedcity(e.target.value);
  const onChangedateOfBirthDay = (e) => setDateOfBirthDay(e.target.value);
  const onChangedateOfBirthMonth = (e) => setDateOfBirthMonth(e.target.value);
  const onChangedateOfBirthYear = (e) => setDateOfBirthYear(e.target.value);
  const onChangedsalutation = (e) => setsalutation(e.target.value);
  const onChangedPostalCode = (e) => setPostalCode(e.target.value);
  const onChangedFullAddress = (e) => setFullAddress(e.target.value);
  const onChangedimagemedicallicense = (e) =>
    setimagemedicallicense(e.target.files[0]);

  // --- Submit Logic ---
  const handelSubmit = async () => {
    // ✅ إزالة event parameter — مش محتاجينه
    const formattedMonth = dateOfBirthMonth.toString().padStart(2, "0");
    const formattedDay = dateOfBirthDay.toString().padStart(2, "0");
    const dateOfBirthString = `${dateOfBirthYear}-${formattedMonth}-${formattedDay}`;

    const stateObject = states.find((state) => state.isoCode === selectedState);
    const stateName = stateObject ? stateObject.name : selectedState;

    const formData = new FormData();
    formData.append("firstName", firstname);
    formData.append("lastName", lastname);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("passwordConfirm", confirmPassword);
    formData.append("phoneNumber", fullPhoneNumber);
    formData.append("salutation", salutation);
    formData.append("state", stateName);
    formData.append("city", selectedcity);
    formData.append("fullAddress", fullAddress);
    formData.append("role", "optician");
    formData.append("postalCode", postalCode);
    formData.append("dateOfBirth", dateOfBirthString);

    if (imagemedicallicense) {
      formData.append("medicalLicenseImage", imagemedicallicense);
    }

    setloading(true);
    setispress(true);

    const res = await dispatch(CreateUser(formData));
    console.log(res);

    setloading(false);
  };

  // --- Response Effect ---
  useEffect(() => {
    if (loading === false && User) {
      if (User?.status === 201) {
        resetFormFields();
        notify(t("signuphook.successAccountCreated"), "success");
        setTimeout(() => navigate("/Login"), 1500);
      } else if (User?.data?.errors?.[0]?.msg === "Email already exists") {
        notify(t("signuphook.emailExists"), "warn");
      } else {
        notify(User?.data?.message || t("signuphook.errorOccurred"), "error");
      }

      setispress(false); // ✅ هنا بعد اللوجيك
      setloading(true);
    }
  }, [loading, User, t, navigate]);

  return [
    handleShowModal,
    firstname,
    lastname,
    dateOfBirthDay,
    dateOfBirthMonth,
    dateOfBirthYear,
    salutation,
    email,
    password,
    confirmPassword,
    selectedState,
    states,
    selectedcity,
    cities,
    postalCode,
    fullAddress,
    ispress,
    loading,
    showModal,
    handleCloseModal,
    handelSubmit,
    imagemedicallicense,
    onChangefirstname,
    onChangelastname,
    onChangeEmail,
    onChangedFullAddress,
    onChangedPostalCode,
    onChangedSelectedState,
    onChangedSelectedcity,
    onChangedateOfBirthDay,
    onChangedateOfBirthMonth,
    onChangedateOfBirthYear,
    onChangedimagemedicallicense,
    onChangedsalutation,
    onChangedPassword,
    onChangeConfirmPassword,
    onChangePhoneNumber,
    phoneNumber,
    onChangeCountryCode,
    countryCode,
  ];
};
