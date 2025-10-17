import { useTranslation } from "react-i18next"
import { MapPin, Wifi, Radio, Edit, Plus, Calendar, Trash2 } from "lucide-react"
import {
  deleteFence,
  getDepartmentGoefences,
} from "../../../../state/act/actDepartment"
import Swal from "sweetalert2"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { useParams } from "react-router-dom"
import LoadingGetData from "../../../../components/LoadingGetData"

function DepartmentGeoFences({
  geofences,
  loadingGetDepartmentGeofences,
  loadingDeleteGeoFence,
  departmentId,
  isDark,
  isRTL,
  currentLang,
  loginRoleResponseDto,
  onNavigate,
  formatDate,
}) {
  const { t } = useTranslation()

  const handleCreateGeoFence = () => {
    onNavigate(`/admin-panel/department/geofence/${departmentId}`)
  }
  const dispatch = useDispatch()
  const handleEditGeoFence = (geofenceId) => {
    onNavigate(`/admin-panel/department/geofence/edit/${geofenceId}`)
  }
  const { depId: id } = useParams()

  const handleDeleteGeoFence = async (geofence) => {
    console.log("Geofence ", geofence)
    const result = await Swal.fire({
      title: t("geoFence.delete.confirmTitle") || "Delete GeoFence?",
      html: `
      <p>${
        t("geoFence.delete.confirmMessage") ||
        "Are you sure you want to delete this geofence?"
      }</p>
      <p class="font-semibold mt-2">${geofence.name}</p>
      <p class="text-sm text-gray-500 mt-1">${
        t("geoFence.delete.warning") || "This action cannot be undone."
      }</p>
    `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: isDark ? "#4b5563" : "#6b7280",
      confirmButtonText: t("geoFence.delete.confirm") || "Yes, delete it",
      cancelButtonText: t("common.cancel") || "Cancel",
      background: isDark ? "#2d2d2d" : "#ffffff",
      color: isDark ? "#f0f0f0" : "#111827",
    })

    if (result.isConfirmed) {
      try {
        await dispatch(deleteFence({ fenceId: geofence.id })).unwrap()

        toast.success(
          currentLang === "en"
            ? "GeoFence deleted successfully"
            : "تم حذف السياج الجغرافي بنجاح",
          {
            position: "top-right",
            autoClose: 3000,
          }
        )

        // Refresh the geofences list
        dispatch(getDepartmentGoefences({ departmentId: id }))
      } catch (error) {
        Swal.fire({
          title: t("geoFence.error.title") || "Error",
          text:
            currentLang === "en"
              ? error?.messageEn ||
                error?.message ||
                "Failed to delete geofence"
              : error?.message ||
                error?.messageEn ||
                "فشل في حذف السياج الجغرافي",
          icon: "error",
          confirmButtonText: t("common.ok") || "OK",
          confirmButtonColor: "#ef4444",
          background: isDark ? "#2d2d2d" : "#ffffff",
          color: isDark ? "#f0f0f0" : "#111827",
        })
      }
    }
  }

  const getPolicyText = (policy) => {
    switch (policy) {
      case 0:
        return t("geoFence.policy.disabled") || "Disabled"
      case 1:
        return t("geoFence.policy.required") || "Required"
      case 2:
        return t("geoFence.policy.optional") || "Optional"
      default:
        return "Unknown"
    }
  }

  const getPolicyColor = (policy) => {
    switch (policy) {
      case 0:
        return isDark
          ? "bg-gray-700 text-gray-300"
          : "bg-gray-100 text-gray-600"
      case 1:
        return isDark ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-800"
      case 2:
        return isDark
          ? "bg-blue-900/30 text-blue-400"
          : "bg-blue-100 text-blue-800"
      default:
        return isDark
          ? "bg-gray-700 text-gray-300"
          : "bg-gray-100 text-gray-600"
    }
  }

  return (
    <div
      className={`${
        isDark ? "bg-gray-800" : "bg-white"
      } rounded-2xl shadow-xl p-6`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2
          className={`text-2xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          } flex items-center`}
        >
          <div
            className={`w-8 h-8 ${
              isDark ? "bg-green-900/30" : "bg-green-100"
            } rounded-lg flex items-center justify-center ${
              isRTL ? "mr-3" : "ml-3"
            }`}
          >
            <MapPin
              className={`w-4 h-4 ${
                isDark ? "text-green-400" : "text-green-600"
              }`}
            />
          </div>
          {t("geoFence.title") || "GeoFences"}
          <span
            className={`${
              isRTL ? "mr-2" : "ml-2"
            } px-2 py-1 rounded-full text-sm font-medium ${
              isDark
                ? "bg-green-900/30 text-green-400"
                : "bg-green-100 text-green-800"
            }`}
          >
            {geofences?.length || 0}
          </span>
        </h2>

        {loginRoleResponseDto?.roleNameEn === "System Administrator" && (
          <button
            onClick={handleCreateGeoFence}
            className="inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Plus size={16} className={`${isRTL ? "mr-2" : "ml-2"}`} />
            <span className="hidden sm:inline">
              {t("geoFence.actions.create") || "Create GeoFence"}
            </span>
            <span className="sm:hidden">
              {t("geoFence.actions.add") || "Add"}
            </span>
          </button>
        )}
      </div>

      {loadingGetDepartmentGeofences ? (
        <LoadingGetData
          text={t("gettingData.geofences") || "Loading geofences..."}
        />
      ) : !geofences || geofences.length === 0 ? (
        <div className="text-center p-8">
          <div
            className={`w-16 h-16 ${
              isDark ? "bg-gray-700" : "bg-gray-100"
            } rounded-full flex items-center justify-center mx-auto mb-4`}
          >
            <MapPin
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
            {t("geoFence.empty.title") || "No GeoFences"}
          </p>
          <p
            className={`${
              isDark ? "text-gray-400" : "text-gray-500"
            } text-sm mb-4`}
          >
            {t("geoFence.empty.description") ||
              "This department doesn't have any geofences configured yet."}
          </p>
          {loginRoleResponseDto?.roleNameEn === "System Administrator" && (
            <button
              onClick={handleCreateGeoFence}
              className="inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Plus size={16} className={`${isRTL ? "mr-2" : "ml-2"}`} />
              {t("geoFence.actions.create") || "Create GeoFence"}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {geofences.map((geofence) => (
            <div
              key={geofence.id}
              className={`p-5 rounded-xl border transition-all duration-200 hover:shadow-lg ${
                isDark
                  ? "border-gray-700 bg-gray-750 hover:bg-gray-700"
                  : "border-gray-200 bg-gray-50 hover:bg-white"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3
                    className={`font-semibold text-lg ${
                      isDark ? "text-white" : "text-gray-900"
                    } mb-1 leading-tight`}
                  >
                    {geofence.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {/* Active Status */}
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        geofence.isActive
                          ? isDark
                            ? "bg-green-900/30 text-green-400"
                            : "bg-green-100 text-green-800"
                          : isDark
                          ? "bg-red-900/30 text-red-400"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {geofence.isActive
                        ? t("geoFence.status.active") || "Active"
                        : t("geoFence.status.inactive") || "Inactive"}
                    </span>

                    {/* Currently Active Status */}
                    {geofence.isActive && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          geofence.isCurrentlyActive
                            ? isDark
                              ? "bg-blue-900/30 text-blue-400"
                              : "bg-blue-100 text-blue-800"
                            : isDark
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {geofence.isCurrentlyActive
                          ? t("geoFence.status.currentlyActive") || "Live"
                          : t("geoFence.status.scheduled") || "Scheduled"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Info */}
              <div
                className={`space-y-3 mb-4 pb-4 border-b ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div
                      className={`flex items-center gap-1 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      } mb-1`}
                    >
                      <MapPin size={14} />
                      <span className="text-xs">
                        {t("geoFenceForm.fields.latitude") || "Latitude"}
                      </span>
                    </div>
                    <p
                      className={`${
                        isDark ? "text-white" : "text-gray-900"
                      } font-mono text-sm`}
                    >
                      {geofence.latitude.toFixed(6)}
                    </p>
                  </div>
                  <div>
                    <div
                      className={`flex items-center gap-1 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      } mb-1`}
                    >
                      <MapPin size={14} />
                      <span className="text-xs">
                        {t("geoFenceForm.fields.longitude") || "Longitude"}
                      </span>
                    </div>
                    <p
                      className={`${
                        isDark ? "text-white" : "text-gray-900"
                      } font-mono text-sm`}
                    >
                      {geofence.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div
                      className={`${
                        isDark ? "text-gray-400" : "text-gray-500"
                      } text-xs mb-1`}
                    >
                      {t("geoFenceForm.fields.radius") || "Radius"}
                    </div>
                    <p
                      className={`${
                        isDark ? "text-white" : "text-gray-900"
                      } font-medium`}
                    >
                      {geofence.radiusMeters}m
                    </p>
                  </div>
                  <div>
                    <div
                      className={`${
                        isDark ? "text-gray-400" : "text-gray-500"
                      } text-xs mb-1`}
                    >
                      {t("geoFenceForm.fields.priority") || "Priority"}
                    </div>
                    <p
                      className={`${
                        isDark ? "text-white" : "text-gray-900"
                      } font-medium`}
                    >
                      {geofence.priority}
                    </p>
                  </div>
                </div>
              </div>

              {/* WiFi & Beacon Policies */}
              <div
                className={`space-y-3 mb-4 pb-4 border-b ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}
              >
                {/* WiFi */}
                <div className="flex items-start gap-2">
                  <Wifi
                    size={16}
                    className={`mt-0.5 ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-sm font-medium ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {t("geoFenceForm.fields.wifi") || "WiFi"}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPolicyColor(
                          geofence.wifiPolicy
                        )}`}
                      >
                        {getPolicyText(geofence.wifiPolicy)}
                      </span>
                    </div>
                    {geofence.wifiSsid && (
                      <p
                        className={`text-xs ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        } font-mono truncate`}
                        title={geofence.wifiSsid}
                      >
                        SSID: {geofence.wifiSsid}
                      </p>
                    )}
                  </div>
                </div>

                {/* Beacon */}
                <div className="flex items-start gap-2">
                  <Radio
                    size={16}
                    className={`mt-0.5 ${
                      isDark ? "text-purple-400" : "text-purple-600"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-sm font-medium ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {t("geoFenceForm.fields.beacon") || "Beacon"}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPolicyColor(
                          geofence.beaconPolicy
                        )}`}
                      >
                        {getPolicyText(geofence.beaconPolicy)}
                      </span>
                    </div>
                    {geofence.beaconUuid && (
                      <p
                        className={`text-xs ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        } font-mono truncate`}
                        title={geofence.beaconUuid}
                      >
                        UUID: {geofence.beaconUuid}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Active Period */}
              {(geofence.activeFromUtc || geofence.activeToUtc) && (
                <div
                  className={`space-y-2 mb-4 pb-4 border-b ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Calendar
                      size={14}
                      className={isDark ? "text-gray-400" : "text-gray-500"}
                    />
                    <span
                      className={`text-xs font-medium ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {t("geoFenceForm.fields.activePeriod") || "Active Period"}
                    </span>
                  </div>
                  <div className="text-xs space-y-1">
                    {geofence.activeFromUtc && (
                      <div
                        className={`flex items-center justify-between ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <span>{t("geoFenceForm.fields.from") || "From"}:</span>
                        <span className="font-mono">
                          {formatDate(geofence.activeFromUtc)}
                        </span>
                      </div>
                    )}
                    {geofence.activeToUtc && (
                      <div
                        className={`flex items-center justify-between ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <span>{t("geoFenceForm.fields.to") || "To"}:</span>
                        <span className="font-mono">
                          {formatDate(geofence.activeToUtc)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="text-xs space-y-1">
                  <div
                    className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {t("roster.details.createdBy") || "Created by"}:{" "}
                    <span
                      className={isDark ? "text-gray-300" : "text-gray-700"}
                    >
                      {geofence.createdByName}
                    </span>
                  </div>
                  <div
                    className={`${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {formatDate(geofence.createdAt)}
                  </div>
                </div>

                {loginRoleResponseDto?.roleNameEn ===
                  "System Administrator" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditGeoFence(geofence.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDark
                          ? "text-green-400 hover:bg-green-900/30"
                          : "text-green-600 hover:bg-green-50"
                      }`}
                      title={t("geoFence.actions.edit") || "Edit"}
                    >
                      <Edit size={18} />
                    </button>

                    <button
                      onClick={() => handleDeleteGeoFence(geofence)}
                      disabled={loadingDeleteGeoFence}
                      className={`p-2 rounded-lg transition-colors ${
                        loadingDeleteGeoFence
                          ? "opacity-50 cursor-not-allowed"
                          : isDark
                          ? "text-red-400 hover:bg-red-900/30"
                          : "text-red-600 hover:bg-red-50"
                      }`}
                      title={t("geoFence.actions.delete") || "Delete"}
                    >
                      {loadingDeleteGeoFence ? (
                        <div className="animate-spin rounded-full h-[18px] w-[18px] border-b-2 border-current"></div>
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DepartmentGeoFences
