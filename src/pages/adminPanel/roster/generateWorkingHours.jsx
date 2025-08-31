import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import i18next from "i18next";
import * as Yup from "yup";
import {
  Clock,
  ArrowLeft,
  RefreshCw,
  Calendar,
  Building2,
  Users,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";
import {
  addWorkingHours,
  getRosterById,
  getWorkingHours,
} from "../../../state/act/actRosterManagement";
import LoadingGetData from "../../../components/LoadingGetData";

function GenerateWorkingHours() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentLang = i18next.language;
  const isRTL = currentLang === "ar";

  const [rosterId, setRosterId] = useState(null);

  const { selectedRoster, workingHours, loading } = useSelector(
    (state) => state.rosterManagement
  );

  const { mymode } = useSelector((state) => state.mode);
  const isDark = mymode === "dark";

  // Get roster ID from localStorage and fetch data
  useEffect(() => {
    const storedRosterId = localStorage.getItem("rosterId");
    if (storedRosterId) {
      setRosterId(storedRosterId);
      dispatch(getRosterById({ rosterId: storedRosterId }));
      dispatch(getWorkingHours({ rosterId: storedRosterId }));
    }
  }, [dispatch]);

  // Validation schema
  const validationSchema = Yup.object({
    overwriteExisting: Yup.boolean(),
  });

  // Initial values
  const initialValues = {
    overwriteExisting: false,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (!rosterId) {
        throw new Error(t("roster.workingHourss.error.noRosterId"));
      }

      const generateData = {
        rosterId: parseInt(rosterId),
        departmentIds: null,
        shiftIds: null,
        contractingTypeIds: null,
        overwriteExisting: values.overwriteExisting,
      };

      console.log("Generating working hours with data:", generateData);

      await dispatch(addWorkingHours(generateData)).unwrap();

      // Refresh data after successful generation

      toast.success(t("roster.workingHourss.success.generated"), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Navigate to working hours management after successful generation
      navigate(`/admin-panel/rosters/${rosterId}`);
    } catch (error) {
      console.error("Working hours generation error:", error);

      Swal.fire({
        title: t("roster.workingHourss.error.title"),
        text:
          currentLang === "en"
            ? error?.response?.data?.messageEn ||
              error?.message ||
              t("roster.workingHourss.error.message")
            : error?.response?.data?.messageAr ||
              error?.message ||
              t("roster.workingHourss.error.message"),
        icon: "error",
        confirmButtonText: t("common.ok"),
        confirmButtonColor: "#ef4444",
        background: isDark ? "#1f2937" : "#ffffff",
        color: isDark ? "#f9fafb" : "#111827",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const navigateBack = () => {
    if (rosterId) {
      navigate(`/admin-panel/rosters/departments`);
    } else {
      navigate(`/admin-panel/rosters`);
    }
  };
  if (loading.fetch) {
    return <LoadingGetData text={t("gettingData.roster")} />;
  }
  return (
    <div
      className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <button
              onClick={navigateBack}
              className={`p-2 rounded-lg mr-4 ${
                isDark
                  ? "text-gray-400 hover:text-white hover:bg-gray-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              } transition-colors`}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1
                className={`text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("roster.workingHourss.generateTitle") ||
                  "Generate Working Hours"}
              </h1>
              {selectedRoster && (
                <div className="mt-2">
                  <p
                    className={`text-lg ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    {selectedRoster.title}
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {selectedRoster.categoryName} • {selectedRoster.month}/
                    {selectedRoster.year}
                  </p>
                </div>
              )}
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                } mt-1`}
              >
                {t("roster.workingHourss.generateSubtitle") ||
                  "Generate working hours for all shifts and departments"}
              </p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div
          className={`mb-8 p-4 rounded-lg border-l-4 border-blue-500 ${
            isDark ? "bg-blue-900/20" : "bg-blue-50"
          }`}
        >
          <div className="flex items-start">
            <Info className="text-blue-500 mr-3 mt-0.5" size={20} />
            <div>
              <h3
                className={`text-lg font-medium ${
                  isDark ? "text-blue-300" : "text-blue-800"
                }`}
              >
                {t("roster.workingHourss.infoTitle") ||
                  "About Working Hours Generation"}
              </h3>
              <p
                className={`text-sm ${
                  isDark ? "text-blue-200" : "text-blue-700"
                } mt-1`}
              >
                {t("roster.workingHourss.infoDescription") ||
                  "This process will create individual working hour slots for each day of the roster period, for each shift and contracting type combination. This is required before doctors can be assigned to specific shifts."}
              </p>
            </div>
          </div>
        </div>

        {/* Generation Form */}
        <div
          className={`rounded-lg border p-6 ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, values }) => (
              <Form className="space-y-6">
                <div>
                  <h2
                    className={`text-xl font-semibold mb-4 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {t("roster.workingHourss.generateSettings") ||
                      "Generation Settings"}
                  </h2>
                </div>

                {/* Generation Options */}
                <div className="space-y-4">
                  <div
                    className={`p-4 border rounded-lg ${
                      isDark
                        ? "border-gray-600 bg-gray-700"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div
                      className={`p-4 border rounded-lg ${
                        isDark
                          ? "border-gray-600 bg-gray-700"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <label
                            htmlFor="overwriteExisting"
                            className={`text-sm font-medium ${
                              isDark ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {t("roster.workingHourss.overwriteExisting") ||
                              "Overwrite Existing Working Hours"}
                          </label>
                          <p
                            className={`text-xs ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            } mt-1`}
                          >
                            {t("roster.workingHourss.overwriteExistingHelp") ||
                              "Replace any existing working hours. WARNING: This will remove all doctor assignments!"}
                          </p>
                        </div>
                        <Field
                          type="checkbox"
                          id="overwriteExisting"
                          name="overwriteExisting"
                          className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Warning for Overwrite */}
                {values.overwriteExisting && (
                  <div
                    className={`p-4 rounded-lg border-l-4 border-red-500 ${
                      isDark ? "bg-red-900/20" : "bg-red-50"
                    }`}
                  >
                    <div className="flex items-start">
                      <AlertCircle
                        className="text-red-500 mr-3 mt-0.5"
                        size={20}
                      />
                      <div>
                        <h3
                          className={`text-lg font-medium ${
                            isDark ? "text-red-300" : "text-red-800"
                          }`}
                        >
                          {t("roster.workingHourss.warningTitle") || "Warning"}
                        </h3>
                        <p
                          className={`text-sm ${
                            isDark ? "text-red-200" : "text-red-700"
                          } mt-1`}
                        >
                          {t("roster.workingHourss.overwriteWarning") ||
                            "Overwriting existing working hours will remove all current doctor assignments. This action cannot be undone."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Current Working Hours Status */}
                {workingHours && workingHours.length > 0 && (
                  <div
                    className={`p-4 rounded-lg border ${
                      isDark
                        ? "bg-green-900/20 border-green-700"
                        : "bg-green-50 border-green-200"
                    }`}
                  >
                    <div className="flex items-start">
                      <CheckCircle
                        className="text-green-500 mr-3 mt-0.5"
                        size={20}
                      />
                      <div>
                        <h3
                          className={`text-lg font-medium ${
                            isDark ? "text-green-300" : "text-green-800"
                          }`}
                        >
                          {t("roster.workingHourss.existingTitle") ||
                            "Existing Working Hours"}
                        </h3>
                        <p
                          className={`text-sm ${
                            isDark ? "text-green-200" : "text-green-700"
                          } mt-1`}
                        >
                          {t("roster.workingHourss.existingMessage", {
                            count: workingHours.length,
                          }) ||
                            `${workingHours.length} working hours already exist for this roster.`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={navigateBack}
                    className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                      isDark
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <ArrowLeft size={16} className={isRTL ? "ml-2" : "mr-2"} />
                    {t("roster.workingHourss.buttons.back") || "Back"}
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || loading.generate}
                    className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting || loading.generate ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {t("roster.workingHourss.buttons.generating") ||
                          "Generating..."}
                      </>
                    ) : (
                      <>
                        <RefreshCw
                          size={16}
                          className={isRTL ? "ml-2" : "mr-2"}
                        />
                        {t("roster.workingHourss.buttons.generate") ||
                          "Generate Working Hours"}
                      </>
                    )}
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

export default GenerateWorkingHours;
