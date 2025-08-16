import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  ChevronRight,
  ChevronLeft,
  Calendar,
  Users,
  Clock,
  FileText,
  Heart,
  Activity,
  Stethoscope,
  Baby,
} from "lucide-react";

const HospitalRosterForm = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const isRTL = currentLang === "ar";

  const { mymode } = useSelector((state) => state.mode);
  const isDark = mymode === "dark";

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    category: "",
    department: "",
    scientificDegree: "",
    shiftHours: "",
    contractingType: "",
    dateFrom: "",
    dateTo: "",
    doctorCounts: {},
  });

  // Static data with translations
  const staticData = {
    categories: [
      {
        id: "heart",
        nameAr: "القلب والأوعية الدموية",
        nameEn: "Cardiology",
        icon: <Heart className="w-5 h-5" />,
      },
      {
        id: "surgery",
        nameAr: "الجراحة",
        nameEn: "Surgery",
        icon: <Activity className="w-5 h-5" />,
      },
      {
        id: "pediatrics",
        nameAr: "طب الأطفال",
        nameEn: "Pediatrics",
        icon: <Baby className="w-5 h-5" />,
      },
      {
        id: "internal",
        nameAr: "الباطنة",
        nameEn: "Internal Medicine",
        icon: <Stethoscope className="w-5 h-5" />,
      },
      {
        id: "emergency",
        nameAr: "الطوارئ",
        nameEn: "Emergency",
        icon: <Activity className="w-5 h-5" />,
      },
    ],
    departments: {
      heart: [
        {
          id: "cardiac_surgery",
          nameAr: "جراحة القلب",
          nameEn: "Cardiac Surgery",
        },
        {
          id: "interventional",
          nameAr: "القسطرة التداخلية",
          nameEn: "Interventional Cardiology",
        },
        {
          id: "electrophysiology",
          nameAr: "الفيسيولوجيا الكهربية",
          nameEn: "Electrophysiology",
        },
      ],
      surgery: [
        {
          id: "general_surgery",
          nameAr: "جراحة عامة",
          nameEn: "General Surgery",
        },
        {
          id: "neurosurgery",
          nameAr: "جراحة مخ وأعصاب",
          nameEn: "Neurosurgery",
        },
        {
          id: "orthopedic",
          nameAr: "جراحة عظام",
          nameEn: "Orthopedic Surgery",
        },
      ],
      pediatrics: [
        {
          id: "general_pediatrics",
          nameAr: "طب أطفال عام",
          nameEn: "General Pediatrics",
        },
        { id: "neonatology", nameAr: "حديثي الولادة", nameEn: "Neonatology" },
        {
          id: "pediatric_surgery",
          nameAr: "جراحة أطفال",
          nameEn: "Pediatric Surgery",
        },
      ],
      internal: [
        {
          id: "general_internal",
          nameAr: "باطنة عامة",
          nameEn: "General Internal Medicine",
        },
        {
          id: "gastroenterology",
          nameAr: "أمراض الجهاز الهضمي",
          nameEn: "Gastroenterology",
        },
        { id: "nephrology", nameAr: "أمراض الكلى", nameEn: "Nephrology" },
      ],
      emergency: [
        {
          id: "adult_emergency",
          nameAr: "طوارئ البالغين",
          nameEn: "Adult Emergency",
        },
        {
          id: "pediatric_emergency",
          nameAr: "طوارئ الأطفال",
          nameEn: "Pediatric Emergency",
        },
        { id: "trauma", nameAr: "الصدمات", nameEn: "Trauma" },
      ],
    },
    scientificDegrees: [
      { id: "resident", nameAr: "طبيب مقيم", nameEn: "Resident" },
      { id: "specialist", nameAr: "أخصائي", nameEn: "Specialist" },
      { id: "consultant", nameAr: "استشاري", nameEn: "Consultant" },
      { id: "professor", nameAr: "أستاذ", nameEn: "Professor" },
    ],
    shiftHours: [
      {
        id: "morning",
        nameAr: "صباحي (8 ص - 4 م)",
        nameEn: "Morning (8 AM - 4 PM)",
      },
      {
        id: "evening",
        nameAr: "مسائي (4 م - 12 ص)",
        nameEn: "Evening (4 PM - 12 AM)",
      },
      {
        id: "night",
        nameAr: "ليلي (12 ص - 8 ص)",
        nameEn: "Night (12 AM - 8 AM)",
      },
      { id: "full_day", nameAr: "24 ساعة", nameEn: "24 Hours" },
    ],
    contractingTypes: [
      { id: "permanent", nameAr: "دائم", nameEn: "Permanent" },
      { id: "temporary", nameAr: "مؤقت", nameEn: "Temporary" },
      { id: "contract", nameAr: "تعاقد", nameEn: "Contract" },
      { id: "part_time", nameAr: "جزئي", nameEn: "Part Time" },
    ],
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // Reset dependent fields
      ...(field === "category" && { department: "" }),
    }));
  };

  const generateDateRange = () => {
    if (!formData.dateFrom || !formData.dateTo) return [];

    const start = new Date(formData.dateFrom);
    const end = new Date(formData.dateTo);
    const dates = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }

    return dates;
  };

  const handleDoctorCountChange = (date, count) => {
    const dateString = date.toISOString().split("T")[0];
    setFormData((prev) => ({
      ...prev,
      doctorCounts: {
        ...prev.doctorCounts,
        [dateString]: parseInt(count) || 0,
      },
    }));
  };

  const getArabicDayName = (date) => {
    const days = [
      "الأحد",
      "الاثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ];
    return days[date.getDay()];
  };

  const getEnglishDayName = (date) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[date.getDay()];
  };

  const formatDate = (date) => {
    return currentLang === "ar"
      ? date.toLocaleDateString("ar-EG", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedToStep2 = () => {
    return (
      formData.category &&
      formData.department &&
      formData.scientificDegree &&
      formData.shiftHours &&
      formData.contractingType
    );
  };

  const canProceedToStep3 = () => {
    return formData.dateFrom && formData.dateTo;
  };

  const getDisplayName = (item) => {
    return currentLang === "ar" ? item.nameAr : item.nameEn;
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2
          className={`text-2xl font-bold mb-2 ${
            isDark ? "text-white" : "text-gray-800"
          } ${isRTL ? "font-arabic" : ""}`}
        >
          {t("roster.setup") || "إعداد الروستر"}
        </h2>
        <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
          {t("roster.selectDepartmentDetails") || "اختر تفاصيل القسم والتخصص"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Selection */}
        <div className="space-y-2">
          <label
            className={`block text-sm font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t("roster.mainSpecialty") || "التخصص الرئيسي"}{" "}
            <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              isDark
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value="">
              {t("roster.selectSpecialty") || "اختر التخصص"}
            </option>
            {staticData.categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {getDisplayName(cat)}
              </option>
            ))}
          </select>
        </div>

        {/* Department Selection */}
        <div className="space-y-2">
          <label
            className={`block text-sm font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t("roster.department") || "القسم"}{" "}
            <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.department}
            onChange={(e) => handleInputChange("department", e.target.value)}
            disabled={!formData.category}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              isDark
                ? "bg-gray-700 border-gray-600 text-white disabled:bg-gray-800"
                : "bg-white border-gray-300 text-gray-900 disabled:bg-gray-100"
            }`}
          >
            <option value="">
              {t("roster.selectDepartment") || "اختر القسم"}
            </option>
            {formData.category &&
              staticData.departments[formData.category]?.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {getDisplayName(dept)}
                </option>
              ))}
          </select>
        </div>

        {/* Scientific Degree */}
        <div className="space-y-2">
          <label
            className={`block text-sm font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t("roster.scientificDegree") || "الدرجة العلمية"}{" "}
            <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.scientificDegree}
            onChange={(e) =>
              handleInputChange("scientificDegree", e.target.value)
            }
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              isDark
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value="">
              {t("roster.selectScientificDegree") || "اختر الدرجة العلمية"}
            </option>
            {staticData.scientificDegrees.map((degree) => (
              <option key={degree.id} value={degree.id}>
                {getDisplayName(degree)}
              </option>
            ))}
          </select>
        </div>

        {/* Shift Hours */}
        <div className="space-y-2">
          <label
            className={`block text-sm font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t("roster.shiftHours") || "ساعات المناوبة"}{" "}
            <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.shiftHours}
            onChange={(e) => handleInputChange("shiftHours", e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              isDark
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value="">
              {t("roster.selectShiftHours") || "اختر ساعات المناوبة"}
            </option>
            {staticData.shiftHours.map((shift) => (
              <option key={shift.id} value={shift.id}>
                {getDisplayName(shift)}
              </option>
            ))}
          </select>
        </div>

        {/* Contracting Type */}
        <div className="space-y-2 md:col-span-2">
          <label
            className={`block text-sm font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {t("roster.contractingType") || "نوع التعاقد"}{" "}
            <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.contractingType}
            onChange={(e) =>
              handleInputChange("contractingType", e.target.value)
            }
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              isDark
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value="">
              {t("roster.selectContractingType") || "اختر نوع التعاقد"}
            </option>
            {staticData.contractingTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {getDisplayName(type)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2
          className={`text-2xl font-bold mb-2 ${
            isDark ? "text-white" : "text-gray-800"
          } ${isRTL ? "font-arabic" : ""}`}
        >
          {t("roster.timePeriod") || "تحديد الفترة الزمنية"}
        </h2>
        <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
          {t("roster.selectDateRange") || "اختر من تاريخ إلى تاريخ"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            className={`block text-sm font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <Calendar className={`inline w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
            {t("roster.fromDate") || "من تاريخ"}{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.dateFrom}
            onChange={(e) => handleInputChange("dateFrom", e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              isDark
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />
        </div>

        <div className="space-y-2">
          <label
            className={`block text-sm font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <Calendar className={`inline w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
            {t("roster.toDate") || "إلى تاريخ"}{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.dateTo}
            onChange={(e) => handleInputChange("dateTo", e.target.value)}
            min={formData.dateFrom}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              isDark
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />
        </div>
      </div>

      {/* Preview selected details */}
      {canProceedToStep2() && (
        <div
          className={`p-4 rounded-lg ${
            isDark
              ? "bg-blue-900/20 border border-blue-700"
              : "bg-blue-50 border border-blue-200"
          }`}
        >
          <h3
            className={`font-semibold mb-2 ${
              isDark ? "text-blue-300" : "text-blue-800"
            }`}
          >
            {t("roster.selectionSummary") || "ملخص الاختيارات"}:
          </h3>
          <div
            className={`space-y-1 text-sm ${
              isDark ? "text-blue-200" : "text-blue-700"
            }`}
          >
            <p>
              <strong>{t("roster.specialty") || "التخصص"}:</strong>{" "}
              {getDisplayName(
                staticData.categories.find((c) => c.id === formData.category)
              )}
            </p>
            <p>
              <strong>{t("roster.department") || "القسم"}:</strong>{" "}
              {getDisplayName(
                staticData.departments[formData.category]?.find(
                  (d) => d.id === formData.department
                )
              )}
            </p>
            <p>
              <strong>
                {t("roster.scientificDegree") || "الدرجة العلمية"}:
              </strong>{" "}
              {getDisplayName(
                staticData.scientificDegrees.find(
                  (d) => d.id === formData.scientificDegree
                )
              )}
            </p>
            <p>
              <strong>{t("roster.shiftHours") || "ساعات المناوبة"}:</strong>{" "}
              {getDisplayName(
                staticData.shiftHours.find((s) => s.id === formData.shiftHours)
              )}
            </p>
            <p>
              <strong>{t("roster.contractingType") || "نوع التعاقد"}:</strong>{" "}
              {getDisplayName(
                staticData.contractingTypes.find(
                  (t) => t.id === formData.contractingType
                )
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => {
    const dates = generateDateRange();

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2
            className={`text-2xl font-bold mb-2 ${
              isDark ? "text-white" : "text-gray-800"
            } ${isRTL ? "font-arabic" : ""}`}
          >
            {t("roster.specifyDoctorCount") || "تحديد عدد الأطباء"}
          </h2>
          <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
            {t("roster.enterDoctorCountPerDay") ||
              "أدخل عدد الأطباء المطلوب لكل يوم"}
          </p>
        </div>

        {dates.length > 0 && (
          <div
            className={`rounded-lg shadow-sm border ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
                  <tr>
                    <th
                      className={`px-4 py-3 text-sm font-medium ${
                        isRTL ? "text-right" : "text-left"
                      } ${isDark ? "text-gray-200" : "text-gray-700"}`}
                    >
                      {t("roster.day") || "اليوم"}
                    </th>
                    <th
                      className={`px-4 py-3 text-sm font-medium ${
                        isRTL ? "text-right" : "text-left"
                      } ${isDark ? "text-gray-200" : "text-gray-700"}`}
                    >
                      {t("roster.date") || "التاريخ"}
                    </th>
                    <th
                      className={`px-4 py-3 text-sm font-medium ${
                        isRTL ? "text-right" : "text-left"
                      } ${isDark ? "text-gray-200" : "text-gray-700"}`}
                    >
                      {t("roster.doctorCount") || "عدد الأطباء"}
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    isDark ? "divide-gray-700" : "divide-gray-200"
                  }`}
                >
                  {dates.map((date, index) => {
                    const dateString = date.toISOString().split("T")[0];
                    return (
                      <tr
                        key={index}
                        className={`${
                          isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"
                        }`}
                      >
                        <td
                          className={`px-4 py-3 text-sm font-medium ${
                            isDark ? "text-gray-200" : "text-gray-900"
                          }`}
                        >
                          {currentLang === "ar"
                            ? getArabicDayName(date)
                            : getEnglishDayName(date)}
                        </td>
                        <td
                          className={`px-4 py-3 text-sm ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {formatDate(date)}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            value={formData.doctorCounts[dateString] || ""}
                            onChange={(e) =>
                              handleDoctorCountChange(date, e.target.value)
                            }
                            className={`w-24 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              isDark
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                            placeholder="0"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {dates.length > 0 && (
          <div
            className={`p-4 rounded-lg ${
              isDark
                ? "bg-green-900/20 border border-green-700"
                : "bg-green-50 border border-green-200"
            }`}
          >
            <h3
              className={`font-semibold mb-2 ${
                isDark ? "text-green-300" : "text-green-800"
              }`}
            >
              <Users className={`inline w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
              {t("roster.totalDoctorsRequired") || "إجمالي الأطباء المطلوبين"}
            </h3>
            <p className={`${isDark ? "text-green-200" : "text-green-700"}`}>
              <strong>
                {Object.values(formData.doctorCounts).reduce(
                  (sum, count) => sum + (count || 0),
                  0
                )}
              </strong>{" "}
              {t("roster.doctor") || "طبيب"} {t("roster.during") || "خلال"}{" "}
              <strong>{dates.length}</strong> {t("roster.days") || "أيام"}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen py-8 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    currentStep >= step
                      ? "bg-blue-600 text-white"
                      : isDark
                      ? "bg-gray-700 text-gray-400"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-colors ${
                      currentStep > step
                        ? "bg-blue-600"
                        : isDark
                        ? "bg-gray-700"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Labels */}
        <div className="grid grid-cols-3 gap-4 mb-8 text-center text-sm">
          <div
            className={`transition-colors ${
              currentStep >= 1
                ? "text-blue-600 font-semibold"
                : isDark
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            <FileText className="w-5 h-5 mx-auto mb-1" />
            {t("roster.departmentDetails") || "تفاصيل القسم"}
          </div>
          <div
            className={`transition-colors ${
              currentStep >= 2
                ? "text-blue-600 font-semibold"
                : isDark
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            <Calendar className="w-5 h-5 mx-auto mb-1" />
            {t("roster.timePeriod") || "الفترة الزمنية"}
          </div>
          <div
            className={`transition-colors ${
              currentStep >= 3
                ? "text-blue-600 font-semibold"
                : isDark
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            <Users className="w-5 h-5 mx-auto mb-1" />
            {t("roster.doctorCount") || "عدد الأطباء"}
          </div>
        </div>

        {/* Form Content */}
        <div
          className={`rounded-lg shadow-sm p-8 ${
            isDark
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Navigation Buttons */}
          <div
            className={`flex justify-between mt-8 pt-6 border-t ${
              isDark ? "border-gray-700" : "border-gray-200"
            } ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-2 border rounded-lg transition-colors ${
                isDark
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {isRTL ? (
                <>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  {t("common.previous") || "السابق"}
                </>
              ) : (
                <>
                  <ChevronRight className="w-4 h-4 mr-2" />
                  {t("common.previous") || "Previous"}
                </>
              )}
            </button>

            {currentStep < 3 ? (
              <button
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && !canProceedToStep2()) ||
                  (currentStep === 2 && !canProceedToStep3())
                }
                className={`flex items-center px-6 py-2 rounded-lg transition-colors ${
                  (currentStep === 1 && !canProceedToStep2()) ||
                  (currentStep === 2 && !canProceedToStep3())
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isRTL ? (
                  <>
                    {t("common.next") || "التالي"}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    {t("common.next") || "Next"}
                    <ChevronLeft className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => {
                  const message =
                    currentLang === "ar"
                      ? "تم حفظ الروستر بنجاح!"
                      : "Roster saved successfully!";
                  alert(message);
                  console.log("Final Form Data:", formData);
                }}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Clock className={`w-4 h-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                {t("roster.saveRoster") || "حفظ الروستر"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalRosterForm;
