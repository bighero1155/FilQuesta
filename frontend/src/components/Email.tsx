import React, { useState } from "react";

interface EmailFieldErrors {
  name?: string[];
  email?: string[];
  message?: string[];
}

interface EmailProps {
  defaultMessage?: string;
}

const EmailForm: React.FC<EmailProps> = ({ defaultMessage = "" }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: defaultMessage,
  });

  const [errors, setErrors] = useState<EmailFieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: string; message: string }>({
    type: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setAlert({ type: "", message: "" });

    try {
      const response = await fetch("http://localhost:8000/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN":
            (
              document.querySelector(
                'meta[name="csrf-token"]'
              ) as HTMLMetaElement
            )?.content || "",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setAlert({ type: "success", message: "Email submitted!" });
        setFormData({ name: "", email: "", message: "" });
      } else if (response.status === 422) {
        const data = await response.json();
        setErrors(data.errors);
      } else {
        setAlert({ type: "danger", message: "An error occurred." });
      }
    } catch {
      setAlert({ type: "danger", message: "Server error." });
    } finally {
      setLoading(false);
      setTimeout(() => setAlert({ type: "", message: "" }), 5000);
    }
  };

  return (
    <form
      className="d-flex justify-content-center flex-column align-items-center w-50 mx-auto mt-5 bg-secondary-subtle p-4 rounded-3"
      onSubmit={handleSubmit}
      noValidate
    >
      {alert.message && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}

      <div className="mb-3 w-100">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className={`form-control ${errors.name ? "is-invalid" : ""}`}
          value={formData.name}
          onChange={handleChange}
          disabled={loading}
        />
        {errors.name && (
          <div className="invalid-feedback">{errors.name[0]}</div>
        )}
      </div>

      <div className="mb-3 w-100">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className={`form-control ${errors.email ? "is-invalid" : ""}`}
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
        />
        {errors.email && (
          <div className="invalid-feedback">{errors.email[0]}</div>
        )}
      </div>

      <div className="mb-3 w-100">
        <label htmlFor="message" className="form-label">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          className={`form-control ${errors.message ? "is-invalid" : ""}`}
          value={formData.message}
          onChange={handleChange}
          disabled={loading}
        />
        {errors.message && (
          <div className="invalid-feedback">{errors.message[0]}</div>
        )}
      </div>

      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit an Email"}
      </button>
    </form>
  );
};

export default EmailForm;
