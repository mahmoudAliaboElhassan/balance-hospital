import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import {
  updateContractingType,
  getContractingTypeById,
} from "../../../state/act/actContractingType";
import { useNavigate, useParams, Link } from "react-router-dom";
import LoadingGetData from "../../../components/LoadingGetData";
import { ArrowLeft, ArrowRight, Save, X } from "lucide-react";

function EditContractingType() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const currentLang = i18n.language;
  const isRTL = currentLang === "ar";

  const {
    loadingUpdateContractingType,
    selectedContractingType,
    loadingGetSingleContractingType,
    singleContractingTypeError,
  } = useSelector((state) => state.contractingType);

  const { mymode } = useSelector((state) => state.mode);
  const isDark = mymode === "dark";

  // Validation schema
  const validationSchema = Yup.object().shape({
    id: Yup.number()
      .required(t("validation.required"))
      .positive(t("validation.positiveNumber"))
      .integer(t("validation.integerOnly")),
    nameArabic: Yup.string()
      .required(t("contractingTypes.form.validation.nameArabicRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(255, t("validation.maxLength", { count: 255 }))
      .matches(
        /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]+$/,
        t("validation.arabicOnly")
      ),
    nameEnglish: Yup.string()
      .required(t("contractingTypes.form.validation.nameEnglishRequired"))
      .min(2, t("validation.minLength", { count: 2 }))
      .max(255, t("validation.maxLength", { count: 255 }))
      .matches(/^[a-zA-Z\s]+$/, t("validation.englishOnly")),
    allowOvertimeHours: Yup.boolean().required(),
    maxHoursPerWeek: Yup.number()
      .min(1, t("contractingTypes.form.validation.maxHoursMin"))
      .max(168, t("contractingTypes.form.validation.maxHoursMax"))
      .integer(t("validation.integerOnly"))
      .required(t("contractingTypes.form.validation.maxHoursRequired")),
    isActive: Yup.boolean().required(),
  });

  useEffect(() => {
    if (id) {
      dispatch(getContractingTypeById(id));
    }
  }, [dispatch, id]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(
        updateContractingType({ id, contractingTypeData: values })
      ).unwrap();

      toast.success(t("contractingTypes.success.updated"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/admin-panel/contracting-types");
    } catch (error) {
      console.error("ContractingType update error:", error);

      Swal.fire({
        title: t("contractingTypes.error.title"),
        text:
          currentLang === "en"
            ? error?.messageEn ||
              error?.message ||
              t("contractingTypes.error.updateFailed")
            : error?.messageAr ||
              error?.message ||
              t("contractingTypes.error.updateFailed"),
        icon: "error",
        confirmButtonText: t("common.ok"),
        confirmButtonColor: "#ef4444",
        background: isDark ? "#374151" : "#ffffff",
        color: isDark ? "#ffffff" : "#111827",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingGetSingleContractingType) return <LoadingGetData />;

  if (singleContractingTypeError) {
    return (
      <div
        className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <div className="max-w-2xl mx-auto">
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-sm border ${
              isDark ? "border-gray-700" : "border-gray-200"
            } p-6`}
          >
            <div className="text-center py-12">
              <div className="text-red-500 text-lg mb-4">
                {currentLang === "ar"
                  ? singleContractingTypeError?.messageAr ||
                    "حدث خطأ أثناء تحميل بيانات نوع التعاقد"
                  : singleContractingTypeError?.messageEn ||
                    "Error loading contracting type data"}
              </div>
              <Link
                to="/admin-panel/contracting-types"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                  {t("contractingTypes.backToList")}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedContractingType) {
    return (
      <div
        className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <div className="max-w-2xl mx-auto">
          <div
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-sm border ${
              isDark ? "border-gray-700" : "border-gray-200"
            } p-6`}
          >
            <div className="text-center py-12">
              <div
                className={`text-lg mb-4 ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {t("contractingTypes.notFound")}
              </div>
              <Link
                to="/admin-panel/contracting-types"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                  {t("contractingTypes.backToList")}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Initial form values from selectedContractingType
  const initialValues = {
    id: selectedContractingType.id,
    nameArabic: selectedContractingType.nameArabic || "",
    nameEnglish: selectedContractingType.nameEnglish || "",
    allowOvertimeHours: selectedContractingType.allowOvertimeHours || false,
    maxHoursPerWeek: selectedContractingType.maxHoursPerWeek || 168,
    isActive: selectedContractingType.isActive,
  };

  return (
    <div
      className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              to="/admin-panel/contracting-types"
              className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                isDark
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              } transition-colors`}
            >
              {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
              <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                {t("contractingTypes.backToList")}
              </span>
            </Link>
          </div>

          <h1
            className={`text-3xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            } mb-2`}
          >
            {t("contractingTypes.form.edit.title")}
          </h1>
          <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
            {t("contractingTypes.form.edit.description")}
          </p>
        </div>

        {/* Form */}
        <div
          className={`${
            isDark ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow-sm border ${
            isDark ? "border-gray-700" : "border-gray-200"
          } p-6`}
        >
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, values }) => (
              <Form className="space-y-6">
                {/* Arabic Name */}
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    {t("contractingTypes.form.nameArabic")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="nameArabic"
                    type="text"
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white"
                    }`}
                    placeholder={t(
                      "contractingTypes.form.nameArabicPlaceholder"
                    )}
                    dir="rtl"
                  />
                  <ErrorMessage
                    name="nameArabic"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* English Name */}
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    {t("contractingTypes.form.nameEnglish")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="nameEnglish"
                    type="text"
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white"
                    }`}
                    placeholder={t(
                      "contractingTypes.form.nameEnglishPlaceholder"
                    )}
                    dir="ltr"
                  />
                  <ErrorMessage
                    name="nameEnglish"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Max Hours Per Week */}
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    {t("contractingTypes.form.maxHoursPerWeek")}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="maxHoursPerWeek"
                    type="number"
                    min="1"
                    max="168"
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white"
                    }`}
                    placeholder={t("contractingTypes.form.maxHoursPlaceholder")}
                  />
                  <ErrorMessage
                    name="maxHoursPerWeek"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    } mt-1`}
                  >
                    {t("contractingTypes.form.maxHoursHint")}
                  </p>
                </div>

                {/* Allow Overtime Hours */}
                <div>
                  <div className="flex items-center">
                    <Field
                      name="allowOvertimeHours"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      className={`${
                        isRTL ? "mr-3" : "ml-3"
                      } text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("contractingTypes.form.allowOvertimeHours")}
                    </label>
                  </div>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    } mt-1 ${isRTL ? "mr-7" : "ml-7"}`}
                  >
                    {t("contractingTypes.form.allowOvertimeHint")}
                  </p>
                </div>

                {/* Is Active */}
                <div>
                  <div className="flex items-center">
                    <Field
                      name="isActive"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      className={`${
                        isRTL ? "mr-3" : "ml-3"
                      } text-sm font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {t("contractingTypes.form.isActive")}
                    </label>
                  </div>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    } mt-1 ${isRTL ? "mr-7" : "ml-7"}`}
                  >
                    {t("contractingTypes.form.isActiveHint")}
                  </p>
                </div>

                {/* Form Actions */}
                <div
                  className={`flex ${
                    isRTL ? "flex-row-reverse" : "flex-row"
                  } items-center justify-between pt-6 border-t ${
                    isDark ? "border-gray-600" : "border-gray-200"
                  }`}
                >
                  <Link
                    to="/admin-panel/contracting-types"
                    className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg ${
                      isDark
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    } transition-colors`}
                  >
                    <X size={16} className={`${isRTL ? "ml-2" : "mr-2"}`} />
                    {t("common.cancel")}
                  </Link>

                  <button
                    type="submit"
                    disabled={isSubmitting || loadingUpdateContractingType}
                    className={`inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                      isSubmitting || loadingUpdateContractingType
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isSubmitting || loadingUpdateContractingType ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save
                        size={16}
                        className={`${isRTL ? "ml-2" : "mr-2"}`}
                      />
                    )}
                    {isSubmitting || loadingUpdateContractingType
                      ? t("common.saving")
                      : t("contractingTypes.form.edit.submit")}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default EditContractingType;
