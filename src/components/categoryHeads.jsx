import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  UserCog,
  UserPlus,
  UserX,
  Eye,
  Edit,
  Shield,
  Calendar,
  Mail,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import LoadingGetData from "./LoadingGetData";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useNavigate, useParams } from "react-router-dom";
import RemoveCategoryHeadModal from "./RemoveCategoryHead";

const CategoryHeadsManagement = ({
  selectedCategory,
  isDark = false,
  isRTL = false,
}) => {
  const { categoryHeads, categoryHeadsPagination, loadingGetCategoryHeads } =
    useSelector((state) => state.category);
  const { catId: id } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [selectedCategoryHead, setSelectedCategoryHead] = useState(null);
  const { t } = useTranslation();
  const language = i18next.language;

  // Filter category heads for the selected category
  const filteredCategoryHeads = categoryHeads.filter(
    (head) => head.categoryId === selectedCategory?.id
  );

  const { loadingRemoveCategoryHead } = useSelector((state) => state.category);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  const formatDaysInRole = (days) => {
    if (days === 0) return t("categoryHead.justAssigned") || "Just assigned";
    if (days === 1) return t("categoryHead.oneDay") || "1 day";
    return `${days} ${t("categoryHead.days") || "days"}`;
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Dispatch action to fetch category heads for the new page
    // dispatch(getCategoryHeads({ page: newPage, pageSize: 10 }));
  };

  const handleRemoveClick = (categoryHead) => {
    setSelectedCategoryHead(categoryHead);
    setIsRemoveModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsRemoveModalOpen(false);
    setSelectedCategoryHead(null);
  };

  if (loadingGetCategoryHeads) {
    return <LoadingGetData text={t("gettingData.categoryHeads")} />;
  }

  if (selectedCategoryHead && isRemoveModalOpen) {
    return (
      <RemoveCategoryHeadModal
        isOpen={isRemoveModalOpen}
        onClose={handleCloseModal}
        categoryInfo={selectedCategory}
        categoryHeadName={
          language === "ar"
            ? selectedCategoryHead.userNameAr
            : selectedCategoryHead.userNameEn
        }
        categoryHeadId={selectedCategoryHead.userId}
      />
    );
  }
  return (
    <div
      className={`${
        isDark ? "bg-gray-800" : "bg-white"
      } rounded-2xl shadow-xl p-6`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2
          className={`text-2xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          } flex items-center`}
        >
          <div
            className={`w-8 h-8 ${
              isDark ? "bg-purple-900/30" : "bg-purple-100"
            } rounded-lg flex items-center justify-center ${
              isRTL ? "mr-3" : "ml-3"
            }`}
          >
            <UserCog
              className={`w-4 h-4 ${
                isDark ? "text-purple-400" : "text-purple-600"
              }`}
            />
          </div>
          {t("categoryHead.title") || "Category Heads"}
        </h2>

        {/* Category Info */}
        {selectedCategory && (
          <div
            className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            <span className="font-medium">
              {isRTL
                ? selectedCategory.categoryNameAr
                : selectedCategory.categoryNameEn}
            </span>
          </div>
        )}
      </div>

      {/* Category Heads List */}
      {filteredCategoryHeads && filteredCategoryHeads.length > 0 ? (
        <div className="space-y-4">
          {filteredCategoryHeads.map((categoryHead) => (
            <div
              key={categoryHead.id}
              className={`p-4 rounded-lg border ${
                isDark
                  ? "border-gray-700 bg-gray-750"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Head Name and Status */}
                  <div className="flex items-center gap-3 mb-3">
                    <h3
                      className={`font-semibold text-lg ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {language == "ar"
                        ? categoryHead.userNameAr
                        : categoryHead.userNameEn}
                    </h3>

                    {/* Active Status Badge */}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        categoryHead.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {categoryHead.isActive
                        ? t("categories.status.active") || "Active"
                        : t("categories.status.inactive") || "Inactive"}
                    </span>
                  </div>

                  {/* Head Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    {/* Email */}
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-blue-500" />
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {categoryHead.email}
                      </span>
                    </div>

                    {/* Days in Role */}
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-orange-500" />
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {formatDaysInRole(categoryHead.daysInRole)}
                      </span>
                    </div>

                    {/* Assigned Date */}
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-green-500" />
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        <strong>{t("roster.assign.at") || "Assigned"}:</strong>{" "}
                        {formatDate(categoryHead.assignedAt)}
                      </span>
                    </div>

                    {/* Assigned By */}
                    <div className="flex items-center gap-2">
                      <UserCog size={16} className="text-purple-500" />
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        <strong>{t("roster.assign.by") || "By"}:</strong>{" "}
                        {categoryHead.assignedByName}
                      </span>
                    </div>
                  </div>

                  {/* Category Info */}
                  <div
                    className={`p-3 rounded-lg ${
                      isDark ? "bg-gray-700" : "bg-gray-100"
                    } mb-3`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Shield size={16} className="text-indigo-500" />
                      <span
                        className={`text-sm font-medium ${
                          isDark ? "text-gray-200" : "text-gray-700"
                        }`}
                      >
                        {t("categories.title") || "Category"}:
                      </span>
                    </div>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      } ml-6`}
                    >
                      {language == "ar"
                        ? categoryHead.categoryNameAr
                        : categoryHead.categoryNameEn}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    disabled={loadingRemoveCategoryHead}
                    onClick={() => handleRemoveClick(categoryHead)}
                    className="inline-flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    title={
                      t("department.manager.actions.removeManager") ||
                      "Remove Category Head"
                    }
                  >
                    {loadingRemoveCategoryHead ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                    ) : (
                      <UserX
                        size={14}
                        className={`${isRTL ? "ml-1" : "mr-1"}`}
                      />
                    )}
                    {t("department.manager.actions.removeManager") || "Remove"}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {categoryHeadsPagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {t("pagination.showing") || "Showing"}{" "}
                {categoryHeadsPagination.startIndex} -{" "}
                {categoryHeadsPagination.endIndex} {t("pagination.of") || "of"}{" "}
                {categoryHeadsPagination.totalCount}{" "}
                {t("pagination.results") || "results"}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!categoryHeadsPagination.hasPreviousPage}
                  className={`p-2 rounded-lg transition-colors ${
                    categoryHeadsPagination.hasPreviousPage
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                  }`}
                >
                  <ChevronLeft size={16} />
                </button>

                <span
                  className={`px-3 py-1 rounded-lg font-medium ${
                    isDark
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {categoryHeadsPagination.pageNumber} /{" "}
                  {categoryHeadsPagination.totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!categoryHeadsPagination.hasNextPage}
                  className={`p-2 rounded-lg transition-colors ${
                    categoryHeadsPagination.hasNextPage
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                  }`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* No Category Heads State */
        <div className="text-center p-8">
          <div
            className={`w-16 h-16 ${
              isDark ? "bg-gray-700" : "bg-gray-100"
            } rounded-full flex items-center justify-center mx-auto mb-4`}
          >
            <UserPlus
              className={`w-8 h-8 ${
                isDark ? "text-gray-500" : "text-gray-400"
              }`}
            />
          </div>
          <p
            className={`text-lg font-medium ${
              isDark ? "text-gray-300" : "text-gray-600"
            } mb-2`}
          >
            {t("categoryHead.noCategoryHead") || "No Category Head Assigned"}
          </p>
          <p
            className={`${
              isDark ? "text-gray-400" : "text-gray-500"
            } text-sm mb-4`}
          >
            {t("categoryHead.noCategoryHeadDescription") ||
              "This category doesn't have a head assigned yet."}
          </p>
          <button
            onClick={() =>
              navigate(
                `/admin-panel/department/assign-manager/${id}?type=category`
              )
            }
            className="inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <UserPlus size={16} className={`${isRTL ? "ml-2" : "mr-2"}`} />
            {t("department.manager.actions.assignManager") ||
              "Assign Category Head"}
          </button>
        </div>
      )}

      {/* Remove Category Head Modal */}
      {selectedCategoryHead && (
        <RemoveCategoryHeadModal
          isOpen={isRemoveModalOpen}
          onClose={handleCloseModal}
          categoryInfo={selectedCategory}
          categoryHeadName={
            language === "ar"
              ? selectedCategoryHead.userNameAr
              : selectedCategoryHead.userNameEn
          }
          categoryHeadId={selectedCategoryHead.userId}
        />
      )}
    </div>
  );
};

export default CategoryHeadsManagement;
