"use client";

import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FloatingLabelSelect } from "../../components/formUI/select";
import { FloatingLabelInput } from "../../components/formUI/textField";

// Icons
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <circle cx="12" cy="16" r="1"></circle>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const CameraIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

const IdCardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);

const GraduationCapIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
  </svg>
);

const FileTextIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14,2 14,8 20,8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10,9 9,9 8,9"></polyline>
  </svg>
);

const BriefcaseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

const FolderIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
);

// Validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateArabicName = (name) => {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(name);
};

const validateEnglishName = (name) => {
  const englishRegex = /^[a-zA-Z\s]+$/;
  return englishRegex.test(name);
};

const validateMobile = (mobile) => {
  const mobileRegex = /^[0-9+\-\s()]+$/;
  return mobileRegex.test(mobile) && mobile.length >= 10;
};

const validatePassword = (password) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  return password.length >= 8 && hasUpperCase && hasLowerCase && hasNumbers;
};

// Floating Label Input Component

// Toggle Button Component - REMOVED (no longer needed)

// File Upload Component
const FileUpload = ({ value, onChange, placeholder }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <div
        onClick={() => fileInputRef.current?.click()}
        className="flex h-24 w-full rounded-md border border-input bg-background hover:bg-accent cursor-pointer transition-colors"
      >
        {preview ? (
          <div className="flex items-center justify-center w-full">
            <img
              src={preview}
              alt="Preview"
              className="h-20 w-20 object-cover rounded"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full text-muted-foreground">
            <div className="text-center">
              <CameraIcon />
              <p className="mt-2 text-sm">{placeholder}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Error Message Component
const ErrorMessage = ({ error }) =>
  error ? <div className="text-red-500 text-xs mt-1">{error}</div> : null;

// Main Component
const SignUp = () => {
  const { mymode } = useSelector((state) => state.mode);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactMethod, setContactMethod] = useState("email"); // "email" or "phone"
  const [formData, setFormData] = useState({
    nameArabic: "",
    nameEnglish: "",
    email: "",
    mobile: "",
    category: "",
    nationalId: "",
    contractingType: "",
    scientificDegree: "",
    printNumber: "",
    userImage: null,
    password: "",
  });
  const [errors, setErrors] = useState({});

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const categoryOptions = [
    { value: "doctor", label: "Doctor" },
    { value: "engineer", label: "Engineer" },
    { value: "lawyer", label: "Lawyer" },
    { value: "teacher", label: "Teacher" },
    { value: "other", label: "Other" },
  ];

  const contractingTypeOptions = [
    { value: "full-time", label: "بدوام كامل" },
    { value: "part-time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "freelance", label: "Freelance" },
  ];

  const scientificDegreeOptions = [
    { value: "high-school", label: "High School" },
    { value: "bachelor", label: "Bachelor" },
    { value: "master", label: "Master" },
    { value: "phd", label: "PhD" },
    { value: "diploma", label: "Diploma" },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nameArabic.trim()) {
      newErrors.nameArabic = "Arabic name is required";
    } else if (!validateArabicName(formData.nameArabic)) {
      newErrors.nameArabic = "Please enter a valid Arabic name";
    }

    if (!formData.nameEnglish.trim()) {
      newErrors.nameEnglish = "English name is required";
    } else if (!validateEnglishName(formData.nameEnglish)) {
      newErrors.nameEnglish = "Please enter a valid English name";
    }

    // Validate based on selected contact method
    if (contactMethod === "email") {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    } else {
      if (!formData.mobile.trim()) {
        newErrors.mobile = "Mobile number is required";
      } else if (!validateMobile(formData.mobile)) {
        newErrors.mobile = "Please enter a valid mobile number";
      }
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.nationalId.trim()) {
      newErrors.nationalId = "National ID is required";
    } else if (formData.nationalId.length < 10) {
      newErrors.nationalId = "National ID must be at least 10 characters";
    }

    if (!formData.contractingType) {
      newErrors.contractingType = "Contracting type is required";
    }

    if (!formData.scientificDegree) {
      newErrors.scientificDegree = "Scientific degree is required";
    }

    if (!formData.printNumber.trim()) {
      newErrors.printNumber = "Print number is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters with uppercase, lowercase, and number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleContactMethodChange = (method) => {
    setContactMethod(method);
    // Clear errors for the contact fields when switching
    setErrors((prev) => ({
      ...prev,
      email: "",
      mobile: "",
    }));

    // Clear the non-selected field value
    if (method === "email") {
      handleInputChange("mobile", "");
    } else {
      handleInputChange("email", "");
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Prepare form data with the selected contact method
      const submissionData = {
        ...formData,
        contactMethod,
        primaryContact:
          contactMethod === "email" ? formData.email : formData.mobile,
      };

      console.log("Form submitted:", submissionData);
      alert("Account created successfully!");
    } catch (error) {
      console.error("Error creating account:", error);
      alert("Error creating account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-2xl">
        <div className="relative bg-white dark:bg-black border border-border rounded-lg p-6 shadow-sm transition-all duration-200 hover:shadow-md">
          <div className="flex flex-col space-y-2 text-center mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your details below to create your account
            </p>
          </div>

          <div className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FloatingLabelInput
                  id="nameArabic"
                  type="text"
                  value={formData.nameArabic}
                  onChange={(e) =>
                    handleInputChange("nameArabic", e.target.value)
                  }
                  placeholder="الاسم بالعربية"
                  icon={<UserIcon />}
                  dir="rtl"
                  error={errors.nameArabic}
                />
                <ErrorMessage error={errors.nameArabic} />
              </div>

              <div className="space-y-2">
                <FloatingLabelInput
                  id="nameEnglish"
                  type="text"
                  value={formData.nameEnglish}
                  onChange={(e) =>
                    handleInputChange("nameEnglish", e.target.value)
                  }
                  placeholder="Name in English"
                  icon={<UserIcon />}
                  error={errors.nameEnglish}
                />
                <ErrorMessage error={errors.nameEnglish} />
              </div>
            </div>

            {/* Contact Method Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Choose your contact method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleContactMethodChange("email")}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                    contactMethod === "email"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  <MailIcon />
                  <span className="font-medium">Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleContactMethodChange("phone")}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                    contactMethod === "phone"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  <PhoneIcon />
                  <span className="font-medium">Phone</span>
                </button>
              </div>
            </div>

            {/* Dynamic Contact Field */}
            <div className="space-y-2">
              {contactMethod === "email" ? (
                <>
                  <FloatingLabelInput
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Email Address"
                    icon={<MailIcon />}
                    error={errors.email}
                  />
                  <ErrorMessage error={errors.email} />
                </>
              ) : (
                <>
                  <FloatingLabelInput
                    id="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) =>
                      handleInputChange("mobile", e.target.value)
                    }
                    placeholder="Mobile Number"
                    icon={<PhoneIcon />}
                    error={errors.mobile}
                  />
                  <ErrorMessage error={errors.mobile} />
                </>
              )}
            </div>

            {/* Category and National ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FloatingLabelSelect
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  placeholder="Category"
                  icon={<FolderIcon />}
                  options={categoryOptions}
                  error={errors.category}
                />
                <ErrorMessage error={errors.category} />
              </div>

              <div className="space-y-2">
                <FloatingLabelInput
                  id="nationalId"
                  type="text"
                  value={formData.nationalId}
                  onChange={(e) =>
                    handleInputChange("nationalId", e.target.value)
                  }
                  placeholder="National ID"
                  icon={<IdCardIcon />}
                  error={errors.nationalId}
                />
                <ErrorMessage error={errors.nationalId} />
              </div>
            </div>

            {/* Contracting Type and Scientific Degree */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FloatingLabelSelect
                  id="contractingType"
                  value={formData.contractingType}
                  onChange={(e) =>
                    handleInputChange("contractingType", e.target.value)
                  }
                  placeholder="Contracting Type"
                  icon={<BriefcaseIcon />}
                  options={contractingTypeOptions}
                  error={errors.contractingType}
                />
                <ErrorMessage error={errors.contractingType} />
              </div>

              <div className="space-y-2">
                <FloatingLabelSelect
                  id="scientificDegree"
                  value={formData.scientificDegree}
                  onChange={(e) =>
                    handleInputChange("scientificDegree", e.target.value)
                  }
                  placeholder="Scientific Degree"
                  icon={<GraduationCapIcon />}
                  options={scientificDegreeOptions}
                  error={errors.scientificDegree}
                />
                <ErrorMessage error={errors.scientificDegree} />
              </div>
            </div>

            {/* Print Number */}
            <div className="space-y-2">
              <FloatingLabelInput
                id="printNumber"
                type="text"
                value={formData.printNumber}
                onChange={(e) =>
                  handleInputChange("printNumber", e.target.value)
                }
                placeholder="Print Number"
                icon={<FileTextIcon />}
                error={errors.printNumber}
              />
              <ErrorMessage error={errors.printNumber} />
            </div>

            {/* User Image */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                User Image
              </label>
              <FileUpload
                value={formData.userImage}
                onChange={(file) => handleInputChange("userImage", file)}
                placeholder="Click to upload your photo"
              />
              <ErrorMessage error={errors.userImage} />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <FloatingLabelInput
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Password"
                icon={<LockIcon />}
                rightIcon={showPassword ? <EyeOffIcon /> : <EyeIcon />}
                onRightIconClick={togglePasswordVisibility}
                error={errors.password}
              />
              <ErrorMessage error={errors.password} />
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </div>

          {/* Sign In Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="underline underline-offset-4 hover:text-primary transition-colors"
              >
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
