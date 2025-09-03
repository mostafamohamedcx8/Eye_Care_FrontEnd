import { useEffect, useState } from "react";
import { State, City } from "country-state-city";
import { useDispatch, useSelector } from "react-redux";
import { CreateUser } from "../Redux/actions/Useraction";
import { validateSignupForm } from "../Validations/validateSignupForm";
import notify from "../Hook/useNotification";
import { useNavigate } from "react-router-dom";

export const Signup_Hook = (t) => {
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [imagemedicallicense, setimagemedicallicense] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedcity, setSelectedcity] = useState("");
  useEffect(() => {
    const germanStates = State.getStatesOfCountry("DE"); // DE = Germany
    setStates(germanStates);
  }, []);
  useEffect(() => {
    if (selectedState) {
      const foundCities = City.getCitiesOfState("DE", selectedState);
      setCities(foundCities);
    }
  }, [selectedState]);

  const dispatch = useDispatch();

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
  const fullPhoneNumber = countryCode + phoneNumber;

  const resetFormFields = () => {
    setFirstname("");
    setLastname("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPhoneNumber("");
    setsalutation("");
    setDateOfBirthDay("Day");
    setDateOfBirthMonth("Month");
    setDateOfBirthYear("Year");
    setSelectedState("");
    setSelectedcity("");
    setFullAddress("");
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

    if (!isValid) return; // لو فيه خطأ ميفتحش المودال

    setShowModal(true); // لو البيانات صحيحة افتح المودال
  };
  const onChangefirstname = (e) => {
    e.persist();
    setFirstname(e.target.value);
  };
  const onChangelastname = (e) => {
    e.persist();
    setLastname(e.target.value);
  };

  const onChangedateOfBirthDay = (e) => {
    e.persist();
    setDateOfBirthDay(e.target.value);
  };
  const onChangedateOfBirthMonth = (e) => {
    e.persist();
    setDateOfBirthMonth(e.target.value);
  };
  const onChangedateOfBirthYear = (e) => {
    e.persist();
    setDateOfBirthYear(e.target.value);
  };
  const onChangedsalutation = (e) => {
    e.persist();
    setsalutation(e.target.value);
  };
  const onChangeEmail = (e) => {
    e.persist();
    setEmail(e.target.value);
  };
  const onChangedPassword = (e) => {
    e.persist();
    setPassword(e.target.value);
  };
  const onChangeConfirmPassword = (e) => {
    e.persist();
    setConfirmPassword(e.target.value);
  };
  const onChangePhoneNumber = (e) => {
    e.persist();
    setPhoneNumber(e.target.value);
  };
  const onChangeCountryCode = (e) => {
    e.persist();
    setCountryCode(e.target.value);
  };
  const onChangedSelectedState = (e) => {
    e.persist();
    setSelectedState(e.target.value);
  };
  const onChangedSelectedcity = (e) => {
    e.persist();
    setSelectedcity(e.target.value);
  };
  const onChangedPostalCode = (e) => {
    e.persist();
    setPostalCode(e.target.value);
  };
  const onChangedFullAddress = (e) => {
    e.persist();
    setFullAddress(e.target.value);
  };
  const onChangedimagemedicallicense = (e) => {
    e.persist();
    setimagemedicallicense(e.target.files[0]);
  };

  const handelSubmit = async (event) => {
    event.preventDefault();

    const monthNames = t("signup.englishMonths", { returnObjects: true });
    const monthName = monthNames[parseInt(dateOfBirthMonth) - 1];
    const stateObject = states.find((state) => state.isoCode === selectedState);
    const stateName = stateObject ? stateObject.name : selectedState;

    // 1. Create FormData object
    const formData = new FormData();

    // 2. Append normal fields
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
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
    // Append nested dateOfBirth fields
    formData.append("dateOfBirth.day", Number(dateOfBirthDay));
    formData.append("dateOfBirth.month", monthName);
    formData.append("dateOfBirth.year", Number(dateOfBirthYear));
    formData.append("imagemedicallicense", imagemedicallicense); // أضف الصورة

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

    setloading(true);
    setispress(true);

    const res = await dispatch(CreateUser(formData)); // ← خزن النتيجة هنا
    console.log("Response from backend:", res); // send FormData object
    setloading(false);
  };

  useEffect(() => {
    if (loading === false && User) {
      setispress(false);
      if (User?.status === 201) {
        resetFormFields();
        notify(t("signuphook.successAccountCreated"), "success");
        navigate("/Login");
      } else if (User?.data?.errors?.[0]?.msg === "Email already exists") {
        notify(t("signuphook.emailExists"), "warn");
      } else {
        notify(User?.data?.message || t("signuphook.errorOccurred"), "error");
      }
      setTimeout(() => {
        setloading(true);
      }, 1500);
    }
  }, [loading, User]);

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
