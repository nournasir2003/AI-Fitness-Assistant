"use client";
import { useState, useMemo } from "react";
import "./SettingsForm.css";

import {
  validateFullName,
  validateEmail,
  validatePassword,
} from "./validation";
export { validateFullName, validateEmail, validatePassword };

const initialValues = {
  fullName: "",
  email: "",
  password: "",
};

const initialTouched = {
  fullName: false,
  email: false,
  password: false,
};

export default function SettingsForm() {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState(initialTouched);
  const [saved, setSaved] = useState(false);

  const errors = useMemo(
    () => ({
      fullName: validateFullName(values.fullName),
      email: validateEmail(values.email),
      password: validatePassword(values.password),
    }),
    [values],
  );

  const isValid = !errors.fullName && !errors.email && !errors.password;

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Once the user has saved once, keep live-validating as they fix fields.
    if (saved) {
      setSaved(false);
    }
  }

  function handleBlur(event) {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    // Guard clause: submission should be unreachable while invalid since the
    // button is disabled, but this protects against programmatic submits
    // (e.g. pressing Enter) firing before disabled state re-renders.
    if (!isValid) {
      setTouched({ fullName: true, email: true, password: true });
      return;
    }
    setSaved(true);
  }

  return (
    <div className="settings-form">
      <div className="settings-form__panel">
        <header className="settings-form__header">
          <div className="settings-form__title-row">
            <h1 className="settings-form__title">Account settings</h1>
            <span
              className={`settings-form__status settings-form__status--${
                isValid ? "valid" : "invalid"
              }`}
              role="status"
            >
              <span className="settings-form__status-dot" aria-hidden="true" />
              {isValid ? "Ready to save" : "Incomplete"}
            </span>
          </div>
          <p className="settings-form__subtitle">
            Update your name, email, and password.
          </p>
        </header>

        <form
          className="settings-form__form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="settings-form__field">
            <label className="settings-form__label" htmlFor="fullName">
              Full name
            </label>
            <input
              className="settings-form__input"
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              value={values.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={touched.fullName && !!errors.fullName}
              aria-describedby={
                touched.fullName && errors.fullName
                  ? "fullName-error"
                  : undefined
              }
            />
            {touched.fullName && errors.fullName && (
              <p
                className="settings-form__error"
                id="fullName-error"
                role="alert"
              >
                {errors.fullName}
              </p>
            )}
          </div>

          <div className="settings-form__field">
            <label className="settings-form__label" htmlFor="email">
              Email
            </label>
            <input
              className="settings-form__input"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="jane@example.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={touched.email && !!errors.email}
              aria-describedby={
                touched.email && errors.email ? "email-error" : undefined
              }
            />
            {touched.email && errors.email && (
              <p className="settings-form__error" id="email-error" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div className="settings-form__field">
            <label className="settings-form__label" htmlFor="password">
              Password
            </label>
            <input
              className="settings-form__input"
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={touched.password && !!errors.password}
              aria-describedby={
                touched.password && errors.password
                  ? "password-error"
                  : undefined
              }
            />
            {touched.password && errors.password && (
              <p
                className="settings-form__error"
                id="password-error"
                role="alert"
              >
                {errors.password}
              </p>
            )}
          </div>

          <div className="settings-form__actions">
            <button
              className="settings-form__submit"
              type="submit"
              disabled={!isValid}
            >
              Save changes
            </button>
            {saved && (
              <p className="settings-form__success" role="status">
                Settings saved.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
