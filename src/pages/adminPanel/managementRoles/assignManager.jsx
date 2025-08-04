import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  UserPlus,
  User,
  AlertCircle,
  CheckCircle,
  Loader as LoaderIcon,
  Search,
  Phone,
  X,
  Users,
} from "lucide-react";

// Redux actions
import {
  addManager,
  getUsersForManagerAssignment,
  getCurrentManagers,
} from "../../../state/act/actManagementRole";
import {
  clearRoleErrors,
  clearUsersData,
} from "../../../state/slices/managementRole";

// Hooks
import i18next from "i18next";

const AssignManager = () => {
  const { t } = useTranslation();
  const { mymode } = useSelector((state) => state.mode);
  const isDark = mymode === "dark";
  const language = i18next.language;
  const isRTL = language === "ar";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const {
    loadingAddManager,
    addManagerError,
    addManagerSuccess,
    usersForManagerAssignment,
    loadingUsersForManagerAssignment,
    usersForManagerAssignmentError,
    currentManagers,
  } = useSelector((state) => state.role);

  // Form state
  const [formData, setFormData] = useState({
    userId: "",
    notes: "",
  });

  // Local state
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(getUsersForManagerAssignment({ pageSize: 100 }));
    dispatch(getCurrentManagers());

    return () => {
      dispatch(clearUsersData());
    };
  }, [dispatch]);

  // Filter users based on search term and exclude current managers
  const filteredUsers =
    usersForManagerAssignment?.filter((user) => {
      // Exclude users who are already managers
      const isCurrentManager = currentManagers?.some(
        (manager) => manager.id === user.id
      );
      const isAdmin = user.role === "Admin" ? true : false;
      if (isCurrentManager || isAdmin) return false;

      // Apply search filter - if no search term, show all users
      if (!searchTerm.trim()) return true;

      const searchLower = searchTerm.toLowerCase();
      return (
        user.nameArabic?.toLowerCase().includes(searchLower) ||
        user.nameEnglish?.toLowerCase().includes(searchLower)
      );
    }) || [];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Handle user search with debounce
  const handleSearchChange = useCallback(
    (value) => {
      setSearchTerm(value);

      // Always show dropdown when there are users available
      setShowUserDropdown(true);

      // Reset selection if search is cleared
      if (!value) {
        setSelectedUser(null);
        setFormData((prev) => ({ ...prev, userId: "" }));
      }

      // Debounced search for more users if needed
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      const timeout = setTimeout(() => {
        if (value.length > 2) {
          dispatch(
            getUsersForManagerAssignment({
              search: value,
              pageSize: 100,
            })
          );
        }
      }, 500);

      setSearchTimeout(timeout);
    },
    [dispatch, searchTimeout]
  );

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setSelectedUser(null);
    setFormData((prev) => ({ ...prev, userId: "" }));
    setShowUserDropdown(true);

    // Fetch all users again
    dispatch(getUsersForManagerAssignment({ pageSize: 100 }));
  };

  // Handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setFormData((prev) => ({ ...prev, userId: user.id }));
    setSearchTerm(`${language === "ar" ? user.nameArabic : user.nameEnglish}`);
    setShowUserDropdown(false);

    // Clear user selection error
    if (errors.userId) {
      setErrors((prev) => ({ ...prev, userId: null }));
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    // Show dropdown if there are users available
    if (filteredUsers.length > 0) {
      setShowUserDropdown(true);
    }
  };

  // Handle click outside to close dropdown
  const handleClickOutside = useCallback((e) => {
    if (!e.target.closest(".user-dropdown-container")) {
      setShowUserDropdown(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.userId) {
      newErrors.userId = t("assignManager.errors.userRequired");
    }

    if (!formData.notes.trim()) {
      newErrors.notes = t("assignManager.errors.notesRequired");
    } else if (formData.notes.trim().length < 10) {
      newErrors.notes = t("assignManager.errors.notesTooShort");
    } else if (formData.notes.trim().length > 500) {
      newErrors.notes = t("assignManager.errors.notesTooLong");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const result = await dispatch(
        addManager({
          userId: parseInt(formData.userId),
          notes: formData.notes.trim(),
        })
      ).unwrap();

      if (result.success) {
        // Reset form
        setFormData({ userId: "", notes: "" });
        setSelectedUser(null);
        setSearchTerm("");
        setErrors({});

        // Navigate back to managers list after a short delay
        setTimeout(() => {
          navigate("/admin-panel/management-roles/managers");
        }, 2000);
      }
    } catch (error) {
      console.error("Error assigning manager:", error);
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({ userId: "", notes: "" });
    setSelectedUser(null);
    setSearchTerm("");
    setErrors({});
    setShowUserDropdown(false);
    dispatch(clearRoleErrors());
  };

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              to="/admin-panel/management-roles/managers"
              className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                isDark
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              } transition-colors ${isRTL ? "ml-4" : "mr-4"}`}
            >
              {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
              <span className={`${isRTL ? "mr-2" : "ml-2"}`}>
                {t("assignManager.backToManagers")}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`p-3 ${
                isDark ? "bg-gray-700" : "bg-blue-100"
              } rounded-lg`}
            >
              <UserPlus
                className={`h-8 w-8 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </div>
            <div>
              <h1
                className={`text-3xl font-bold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {t("assignManager.title")}
              </h1>
              <p
                className={`text-lg ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {t("assignManager.description")}
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {addManagerSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>{t("assignManager.success")}</span>
            </div>
          </div>
        )}

        {/* Error Messages */}
        {(addManagerError || usersForManagerAssignmentError) && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>
                  {language === "ar"
                    ? addManagerError?.messageAr ||
                      usersForManagerAssignmentError?.messageAr ||
                      "حدث خطأ"
                    : addManagerError?.messageEn ||
                      usersForManagerAssignmentError?.messageEn ||
                      "An error occurred"}
                </span>
              </div>
              <button
                onClick={() => dispatch(clearRoleErrors())}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <div
          className={`${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          } border rounded-xl shadow-sm p-6`}
        >
          <form onSubmit={handleSubmit}>
            {/* User Selection */}
            <div className="mb-6 user-dropdown-container">
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {t("assignManager.form.selectUser")}{" "}
                <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <div className="relative">
                  <Search
                    className={`absolute ${
                      isRTL ? "right-3" : "left-3"
                    } top-1/2 transform -translate-y-1/2 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    } h-4 w-4`}
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={handleInputFocus}
                    placeholder={t("assignManager.form.searchUserPlaceholder")}
                    className={`w-full ${
                      isRTL ? "pr-10 pl-10" : "pl-10 pr-10"
                    } py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.userId
                        ? "border-red-500"
                        : isDark
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                  {/* Clear Search Button */}
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className={`absolute ${
                        isRTL ? "left-3" : "right-3"
                      } top-1/2 transform -translate-y-1/2 ${
                        isDark
                          ? "text-gray-400 hover:text-gray-300"
                          : "text-gray-500 hover:text-gray-700"
                      } transition-colors`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* User Dropdown */}
                {showUserDropdown && (
                  <div
                    className={`absolute z-10 w-full mt-1 ${
                      isDark
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    } border rounded-lg shadow-lg max-h-60 overflow-y-auto`}
                  >
                    {loadingUsersForManagerAssignment ? (
                      <div className="p-4 text-center">
                        <LoaderIcon className="h-4 w-4 animate-spin mx-auto mb-2" />
                        <span
                          className={`text-sm ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {t("assignManager.form.loadingUsers")}
                        </span>
                      </div>
                    ) : filteredUsers.length === 0 ? (
                      <div className="p-4 text-center">
                        <Users className="h-8 w-8 mx-auto mb-2 opacity-50 text-gray-400" />
                        <span
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {searchTerm.trim()
                            ? t("assignManager.form.noUsersFound")
                            : t("assignManager.form.noAvailableUsers")}
                        </span>
                      </div>
                    ) : (
                      <div className="max-h-60 overflow-y-auto">
                        {filteredUsers.map((user) => (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => handleUserSelect(user)}
                            className={`w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 border-b border-gray-200 dark:border-gray-600 last:border-b-0 transition-colors ${
                              selectedUser?.id === user.id
                                ? "bg-blue-50 dark:bg-blue-900/30"
                                : ""
                            }`}
                          >
                            <div className="flex items-center">
                              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-600 mr-3">
                                <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                              </div>
                              <div className="flex-1">
                                <div
                                  className={`font-medium ${
                                    isDark ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {language === "ar"
                                    ? user.nameArabic
                                    : user.nameEnglish}
                                </div>
                                <div className="flex items-center space-x-2 space-x-reverse">
                                  <div className="flex items-center">
                                    <Phone className="h-3 w-3 mr-1 text-gray-400" />
                                    <span
                                      className={`text-xs ${
                                        isDark
                                          ? "text-gray-400"
                                          : "text-gray-600"
                                      }`}
                                    >
                                      {user.mobile}
                                    </span>
                                  </div>
                                  {user.role && (
                                    <span
                                      className={`text-xs px-2 py-1 rounded-full ${
                                        user.role === "Admin"
                                          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                          : user.role === "Manager"
                                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                          : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                                      }`}
                                    >
                                      {user.role}
                                    </span>
                                  )}
                                </div>
                                <div
                                  className={`text-xs ${
                                    isDark ? "text-gray-500" : "text-gray-500"
                                  }`}
                                >
                                  ID: {user.id}
                                  {user.primaryCategoryNameEn && (
                                    <span>
                                      {" • "}
                                      {language === "ar"
                                        ? user.primaryCategoryNameAr ||
                                          user.primaryCategoryNameEn
                                        : user.primaryCategoryNameEn}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {errors.userId && (
                <p className="mt-1 text-sm text-red-600">{errors.userId}</p>
              )}

              <p
                className={`mt-1 text-xs ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {filteredUsers.length > 0
                  ? t("assignManager.form.usersAvailable", {
                      count: filteredUsers.length,
                    })
                  : t("assignManager.form.noUsersAvailableDesc")}
              </p>
            </div>

            {/* Selected User Display */}
            {selectedUser && (
              <div
                className={`mb-6 p-4 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <h4
                  className={`font-medium ${
                    isDark ? "text-white" : "text-gray-900"
                  } mb-2`}
                >
                  {t("assignManager.form.selectedUser")}
                </h4>
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 mr-3">
                    <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div
                      className={`font-medium ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {language === "ar"
                        ? selectedUser.nameArabic
                        : selectedUser.nameEnglish}
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse mt-1">
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-1 text-gray-400" />
                        <span
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {selectedUser.mobile}
                        </span>
                      </div>
                      {selectedUser.role && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            selectedUser.role === "Admin"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              : selectedUser.role === "Manager"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                          }`}
                        >
                          {selectedUser.role}
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        isDark ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      ID: {selectedUser.id}
                      {selectedUser.primaryCategoryNameEn && (
                        <span>
                          {" • "}
                          {language === "ar"
                            ? selectedUser.primaryCategoryNameAr ||
                              selectedUser.primaryCategoryNameEn
                            : selectedUser.primaryCategoryNameEn}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="mb-6">
              <label
                htmlFor="notes"
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {t("assignManager.form.notes")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder={t("assignManager.form.notesPlaceholder")}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
                  errors.notes
                    ? "border-red-500"
                    : isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
              {errors.notes && (
                <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
              )}
              <p
                className={`mt-1 text-xs ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {formData.notes.length}/500 {t("assignManager.form.characters")}
              </p>
            </div>

            {/* Assignment Details */}
            <div
              className={`mb-6 p-4 rounded-lg border ${
                isDark
                  ? "bg-yellow-900/20 border-yellow-800"
                  : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <h4
                className={`font-medium ${
                  isDark ? "text-yellow-300" : "text-yellow-800"
                } mb-2`}
              >
                {t("assignManager.form.whatHappens")}
              </h4>
              <ul
                className={`text-sm ${
                  isDark ? "text-yellow-200" : "text-yellow-700"
                } space-y-1`}
              >
                <li>• {t("assignManager.form.consequence1")}</li>
                <li>• {t("assignManager.form.consequence2")}</li>
                <li>• {t("assignManager.form.consequence3")}</li>
              </ul>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleReset}
                className={`px-6 py-3 border rounded-lg font-medium transition-colors ${
                  isDark
                    ? "text-gray-300 border-gray-600 hover:bg-gray-700"
                    : "text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {t("assignManager.form.reset")}
              </button>

              <Link
                to="/admin-panel/management-roles/managers"
                className={`px-6 py-3 border rounded-lg font-medium transition-colors ${
                  isDark
                    ? "text-gray-300 border-gray-600 hover:bg-gray-700"
                    : "text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {t("assignManager.form.cancel")}
              </Link>

              <button
                type="submit"
                disabled={loadingAddManager || !selectedUser}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {loadingAddManager ? (
                  <>
                    <LoaderIcon className="h-4 w-4 animate-spin mr-2" />
                    {t("assignManager.form.assigning")}
                  </>
                ) : (
                  <>
                    <UserPlus size={16} className="mr-2" />
                    {t("assignManager.form.assignManager")}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignManager;
