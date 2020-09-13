import React from "react";
import "./App.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import usStates from "./us_states.json";

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const numericStringExp = /^[0-9]*$/;

const schema = yup.object().shape({
  quantity: yup.number().integer().min(1).max(3).required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  address1: yup.string().required(),
  city: yup.string().required(),
  state: yup.string().required(),
  zip: yup
    .string()
    .matches(numericStringExp, "zipcode should be numeric string")
    .required(),
  email: yup.string().email().required(),
  phone: yup
    .string()
    .required()
    .matches(phoneRegExp, "Phone number is not valid"),
  ccNum: yup
    .string()
    .matches(numericStringExp, "credit card number should be numeric string")
    .max(16)
    .required(),
  expiration: yup.string().required(),
});

function App() {
  const { register, handleSubmit, errors, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const [orderTotal, setOrdderTotal] = React.useState(0.0);
  const [orderMessage, setOrderMessage] = React.useState("");

  const clearMessagelater = () => {
    setTimeout(() => setOrderMessage(""), 5000);
  };

  const onSubmit = (data) => {
    // integrate with sever to submit order
    const order = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      address: {
        street1: data.address1,
        street2: data.address2,
        city: data.city,
        state: data.state,
        zip: data.zip,
      },
      phone: data.phone,
      quantity: data.quantity,
      total: (data.quantity * 49.97).toFixed(2).toString(),
      payment: {
        ccNum: data.ccNum,
        exp: data.expiration,
      },
    };

    // call backend post API to create a new order, if succeed,
    // display a success message. If failed, display error message
    // from server
    fetch("http://localhost:5000/api/magic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // fetch api come to then block even when api failed
        if (data.errorCode) {
          setOrderMessage(data.message);
        } else {
          // this is really success
          reset();
          setOrderMessage("An order has been submitted successfully");
        }

        clearMessagelater();
      })
      .catch((error) => {
        setOrderMessage(error.message);
        clearMessagelater();
      });
  };

  const handleChangeQuantity = (evt) => {
    // total price will change based on qusntity, with 2 decimals
    const total = (evt.target.value * 49.99).toFixed(2);
    setOrdderTotal(total);
  };
  return (
    <form className="App" onSubmit={handleSubmit(onSubmit)}>
      <h1>Magic Potion #1</h1>
      <div className="CartContainer">
        <img alt="magic potion" className="LogoImage" src="./logo.jpg" />
        <div className="PriceContainer">
          <label className="UnitPrice">Unit Price: $49.99</label>
          <label htmlFor="quantity" className="required">
            Qty
          </label>
          <input
            type="number"
            name="quantity"
            placeholder="max 3"
            min="1"
            max="3"
            ref={register}
            onChange={handleChangeQuantity}
          ></input>
          {errors.quantity && <p>{errors.quantity.message}</p>}
          <label className="UnitPrice">Total Price: {orderTotal}</label>
        </div>
      </div>
      <h1 className="LeftText">Contact | Billing Information</h1>
      <div className="ContactBillingContainer">
        <div className="RowContainer">
          <div className="TwoFieldContainer">
            <input
              text="text"
              name="firstName"
              placeholder="First Name"
              ref={register}
            />
            {errors.firstName && <p>{errors.firstName.message}</p>}
          </div>
          <div className="TwoFieldContainer">
            <input
              text="text"
              name="lastName"
              placeholder="Last Name"
              ref={register}
            />
            {errors.lastName && <p>{errors.lastName.message}</p>}
          </div>
        </div>
        <div className="RowContainer">
          <div className="OneFieldContainer">
            <input
              name="address1"
              type="text"
              placeholder="Address Line 1"
              ref={register}
            />
            {errors.address1 && <p>{errors.address1.message}</p>}
          </div>
        </div>
        <div className="RowContainer">
          <div className="OneFieldContainer">
            <input name="address2" type="text" placeholder="Address Line 2" />
          </div>
        </div>
        <div className="RowContainer">
          <div className="ThreeFieldContainer">
            <input name="city" type="text" placeholder="City" ref={register} />
            {errors.city && <p>{errors.city.message}</p>}
          </div>
          <div className="ThreeFieldContainer">
            <select name="state" ref={register}>
              {usStates.map((state) => (
                <option key={state.abbreviation} value={state.abbreviation}>
                  {state.name}
                </option>
              ))}
            </select>
            {errors.state && <p>{errors.state.message}</p>}
          </div>
          <div className="ThreeFieldContainer">
            <input
              name="zip"
              type="text"
              placeholder="Zip Code"
              ref={register}
            />
            {errors.zip && <p>{errors.zip.message}</p>}
          </div>
        </div>
        <div className="RowContainer">
          <div className="TwoFieldContainer">
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              ref={register}
            />
            {errors.email && <p>{errors.email.message}</p>}
          </div>
          <div className="TwoFieldContainer">
            <input
              name="phone"
              type="number"
              placeholder="Phone Number"
              ref={register}
            />
            {errors.phone && <p>{errors.phone.message}</p>}
          </div>
        </div>
        <div className="RowContainer">
          <div className="TwoFieldContainer">
            <input
              name="ccNum"
              type="number"
              placeholder="Credit Card Number"
              ref={register}
            />
            {errors.ccNum && <p>{errors.ccNum.message}</p>}
          </div>
          <div className="TwoFieldContainer">
            <input
              name="expiration"
              type="month"
              placeholder="mm/yy"
              ref={register}
            />
            {errors.expiration && <p>{errors.expiration.message}</p>}
          </div>
        </div>
      </div>
      <div className="RowContainer">
        <p>{orderMessage}</p>
      </div>
      <div className="RowContainer">
        <input className="SubmitButton" type="submit" />
      </div>
    </form>
  );
}

export default App;
