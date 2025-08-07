import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import {
  updateDepartment,
  getDepartmentById,
} from "../../../state/act/actDepartment";
import { useNavigate, useParams } from "react-router-dom";
import UseFormValidation from "../../../hooks/use-form-validation";
import LoadingGetData from "../../../components/LoadingGetData";
import { getCategories } from "../../../state/act/actCategory";

function EditDepartment() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { depId: id } = useParams();
  const currentLang = i18n.language;
  const isRTL = currentLang === "ar";
  const { categories } = useSelector((state) => state.category);

  const {
    loadingUpdateDepartment,
    selectedDepartment,
    loadingGetSingleDepartment,
    singleDepartmentError,
  } = useSelector((state) => state.department);
  const { loadingGetCategories } = useSelector((state) => state.category);
  const { VALIDATION_SCHEMA_EDIT_DEPARTMENT } = UseFormValidation();

  useEffect(() => {
    if (id) dispatch(getDepartmentById(id));
    dispatch(getCategories({ isActive: true }));
  }, [dispatch, id]);

  if (loadingGetSingleDepartment || loadingGetCategories)
    return <LoadingGetData text={t("gettingData.departmentData")} />;

  if (singleDepartmentError)
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-4">
            {currentLang === "ar"
              ? singleDepartmentError.message
              : "Department not found"}
          </div>
          <button
            onClick={() => navigate("/admin-panel/departments")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {t("common.goBack")}
          </button>
        </div>
      </div>
    );

  if (!selectedDepartment)
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-600">{t("common.noData")}</div>
        </div>
      </div>
    );

  const initialValues = {
    id: selectedDepartment.id,
    nameArabic: selectedDepartment.nameArabic || "",
    nameEnglish: selectedDepartment.nameEnglish || "",
    categoryId: selectedDepartment.categoryId || "",
    location: selectedDepartment.location || "",
    isActive: selectedDepartment.isActive,
  };

  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(updateDepartment({ id, departmentData: values }))
      .unwrap()
      .then(() => {
        toast.success(t("departmentForm.success.updated"), {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/admin-panel/departments");
      })
      .catch((error) => {
        Swal.fire({
          title: t("departmentForm.error.title"),
          text:
            currentLang === "en"
              ? error?.messageEn || error?.message
              : error?.messageAr || error?.message,
          icon: "error",
          confirmButtonText: t("common.ok"),
        });
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2
        className={`text-2xl font-bold text-gray-800 mb-6 text-center ${
          isRTL ? "font-arabic" : ""
        }`}
      >
        {t("departmentForm.editTitle")}
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={VALIDATION_SCHEMA_EDIT_DEPARTMENT}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, errors, touched, setFieldValue, values }) => (
          <Form className="space-y-6">
            {/* Arabic Name */}
            <div>
              <label
                htmlFor="nameArabic"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("departmentForm.fields.nameArabic")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                id="nameArabic"
                name="nameArabic"
                dir="rtl"
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.nameArabic && touched.nameArabic
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder={t("departmentForm.placeholders.nameArabic")}
              />
              <ErrorMessage
                name="nameArabic"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            {/* English Name */}
            <div>
              <label
                htmlFor="nameEnglish"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("departmentForm.fields.nameEnglish")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                id="nameEnglish"
                name="nameEnglish"
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.nameEnglish && touched.nameEnglish
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder={t("departmentForm.placeholders.nameEnglish")}
              />
              <ErrorMessage
                name="nameEnglish"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="categoryId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("departmentForm.fields.category")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <Field
                as="select"
                id="categoryId"
                name="categoryId"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.categoryId && touched.categoryId
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
              >
                <option value="">
                  {t("departmentForm.placeholders.category")}
                </option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {currentLang === "ar"
                      ? category.nameArabic
                      : category.nameEnglish}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="categoryId"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("departmentForm.fields.location")}
              </label>
              <Field
                type="text"
                id="location"
                name="location"
                dir={isRTL ? "rtl" : "ltr"}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.location && touched.location
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder={t("departmentForm.placeholders.location")}
              />
              <ErrorMessage
                name="location"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            {/* Is Active */}
            <div
              className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <Field
                type="checkbox"
                id="isActive"
                name="isActive"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label
                htmlFor="isActive"
                className={`block text-sm text-gray-700 ${
                  isRTL ? "ml-2" : "mr-2"
                }`}
              >
                {t("departmentForm.fields.isActive")}
              </label>
            </div>

            {/* Buttons */}
            <div
              className={`flex justify-end space-x-3 pt-4 ${
                isRTL ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => navigate("/admin-panel/departments")}
                className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                {t("departmentForm.buttons.cancel")}
              </button>
              <button
                type="submit"
                disabled={isSubmitting || loadingUpdateDepartment}
                className={`px-4 py-2 rounded-md text-white focus:outline-none ${
                  isSubmitting || loadingUpdateDepartment
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting || loadingUpdateDepartment
                  ? t("departmentForm.buttons.editing")
                  : t("departmentForm.buttons.edit")}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default EditDepartment;
