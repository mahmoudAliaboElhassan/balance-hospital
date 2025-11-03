import { useState, useMemo } from "react"
import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Briefcase,
  Users,
  AlertTriangle,
} from "lucide-react"
import { formatDate } from "../../../utils/formtDate"

const LeavesWithOverlap = () => {
  const { t, i18n } = useTranslation()
  const { mymode } = useSelector((state) => state.mode)
  const { leaves } = useSelector((state) => state.leaves)

  const isDark = mymode === "dark"
  const currentLang = i18n.language || "ar"

  const [expandedOverlaps, setExpandedOverlaps] = useState({})

  // Function to check if two date ranges overlap
  const datesOverlap = (start1, end1, start2, end2) => {
    const s1 = new Date(start1)
    const e1 = new Date(end1)
    const s2 = new Date(start2)
    const e2 = new Date(end2)
    return s1 <= e2 && s2 <= e1
  }

  // Function to check if shifts overlap
  const shiftsOverlap = (request1, request2) => {
    const shifts1 = request1.assignmentsSummary?.shifts || []
    const shifts2 = request2.assignmentsSummary?.shifts || []

    const overlaps = []

    shifts1.forEach((shift1) => {
      shifts2.forEach((shift2) => {
        if (
          shift1.shiftDate === shift2.shiftDate &&
          shift1.departmentNameEn === shift2.departmentNameEn &&
          shift1.shiftNameEn === shift2.shiftNameEn
        ) {
          overlaps.push({
            date: shift1.shiftDate,
            dayAr: shift1.dayOfWeekAr,
            dayEn: shift1.dayOfWeekEn,
            shiftAr: shift1.shiftNameAr,
            shiftEn: shift1.shiftNameEn,
            departmentAr: shift1.departmentNameAr,
            departmentEn: shift1.departmentNameEn,
            time: `${shift1.startTime} - ${shift1.endTime}`,
            hours: shift1.durationHours,
          })
        }
      })
    })

    return overlaps
  }

  // Find all overlapping leave requests
  const findOverlappingLeaves = useMemo(() => {
    if (!leaves || leaves.length === 0) return []

    const overlaps = []
    const processedPairs = new Set()

    for (let i = 0; i < leaves.length; i++) {
      for (let j = i + 1; j < leaves.length; j++) {
        const leave1 = leaves[i]
        const leave2 = leaves[j]

        const pairKey = `${Math.min(
          leave1.requestId,
          leave2.requestId
        )}-${Math.max(leave1.requestId, leave2.requestId)}`

        if (processedPairs.has(pairKey)) continue

        // Check if dates overlap
        if (
          datesOverlap(
            leave1.leaveStartDate,
            leave1.leaveEndDate,
            leave2.leaveStartDate,
            leave2.leaveEndDate
          )
        ) {
          // Check for shift overlaps
          const shiftOverlaps = shiftsOverlap(leave1, leave2)

          if (shiftOverlaps.length > 0) {
            overlaps.push({
              id: pairKey,
              doctor1: {
                id: leave1.requestId,
                nameAr: leave1.doctorNameAr,
                nameEn: leave1.doctorNameEn,
                leaveType:
                  currentLang === "ar"
                    ? leave1.leaveTypeNameAr
                    : leave1.leaveTypeNameEn,
                startDate: leave1.leaveStartDate,
                endDate: leave1.leaveEndDate,
                status: leave1.statusCode,
                statusName: leave1.statusNameAr,
              },
              doctor2: {
                id: leave2.requestId,
                nameAr: leave2.doctorNameAr,
                nameEn: leave2.doctorNameEn,
                leaveType:
                  currentLang === "ar"
                    ? leave2.leaveTypeNameAr
                    : leave2.leaveTypeNameEn,
                startDate: leave2.leaveStartDate,
                endDate: leave2.leaveEndDate,
                status: leave2.statusCode,
                statusName: leave2.statusNameAr,
              },
              overlappingShifts: shiftOverlaps,
              overlapCount: shiftOverlaps.length,
            })

            processedPairs.add(pairKey)
          }
        }
      }
    }

    return overlaps
  }, [leaves, currentLang])

  const toggleOverlapDetails = (overlapId) => {
    setExpandedOverlaps((prev) => ({
      ...prev,
      [overlapId]: !prev[overlapId],
    }))
  }

  const getStatusColor = (statusCode) => {
    const colors = {
      0: isDark
        ? "bg-yellow-900/30 text-yellow-400"
        : "bg-yellow-100 text-yellow-800",
      1: isDark
        ? "bg-green-900/30 text-green-400"
        : "bg-green-100 text-green-800",
      2: isDark ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-800",
    }
    return (
      colors[statusCode] ||
      (isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-800")
    )
  }

  if (findOverlappingLeaves.length === 0) {
    return null
  }

  return (
    <div
      className={`${
        isDark ? "bg-gray-800" : "bg-white"
      } rounded-2xl shadow-xl p-6 mb-8`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2
          className={`text-2xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          } flex items-center gap-3`}
        >
          <div
            className={`w-10 h-10 ${
              isDark ? "bg-orange-900/30" : "bg-orange-100"
            } rounded-lg flex items-center justify-center`}
          >
            <AlertTriangle
              className={`w-5 h-5 ${
                isDark ? "text-orange-400" : "text-orange-600"
              }`}
            />
          </div>
          {currentLang === "ar" ? "تضارب الإجازات" : "Overlapping Leaves"}
        </h2>

        <span
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            isDark
              ? "bg-orange-900/30 text-orange-400"
              : "bg-orange-100 text-orange-800"
          }`}
        >
          {findOverlappingLeaves.length}{" "}
          {currentLang === "ar" ? "تضارب" : "Conflicts"}
        </span>
      </div>

      {/* Alert Message */}
      <div
        className={`mb-6 p-4 rounded-lg border ${
          isDark
            ? "bg-orange-900/20 border-orange-700"
            : "bg-orange-50 border-orange-200"
        }`}
      >
        <div className="flex items-start gap-3">
          <AlertCircle
            className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
              isDark ? "text-orange-400" : "text-orange-600"
            }`}
          />
          <div>
            <h4
              className={`font-medium mb-1 ${
                isDark ? "text-orange-300" : "text-orange-900"
              }`}
            >
              {currentLang === "ar"
                ? "تنبيه: تضارب في الإجازات"
                : "Warning: Leave Conflicts Detected"}
            </h4>
            <p
              className={`text-sm ${
                isDark ? "text-orange-400" : "text-orange-700"
              }`}
            >
              {currentLang === "ar"
                ? "هناك أطباء متعددون لديهم إجازات متداخلة في نفس النوبات والأماكن. يرجى مراجعة هذه الحالات."
                : "Multiple doctors have overlapping leaves for the same shifts and departments. Please review these cases."}
            </p>
          </div>
        </div>
      </div>

      {/* Overlapping Leaves List */}
      <div className="space-y-4">
        {findOverlappingLeaves.map((overlap) => (
          <div
            key={overlap.id}
            className={`rounded-lg border ${
              isDark
                ? "bg-gray-700 border-gray-600"
                : "bg-white border-gray-200"
            } overflow-hidden`}
          >
            {/* Overlap Header */}
            <button
              onClick={() => toggleOverlapDetails(overlap.id)}
              className={`w-full p-4 flex items-center justify-between transition-colors ${
                isDark ? "hover:bg-gray-600" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-4">
                <Users
                  className={`w-5 h-5 ${
                    isDark ? "text-orange-400" : "text-orange-600"
                  }`}
                />
                <div className="text-left">
                  <div
                    className={`font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {currentLang === "ar"
                      ? overlap.doctor1.nameAr
                      : overlap.doctor1.nameEn}
                    {" & "}
                    {currentLang === "ar"
                      ? overlap.doctor2.nameAr
                      : overlap.doctor2.nameEn}
                  </div>
                  <div
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {overlap.overlapCount}{" "}
                    {currentLang === "ar"
                      ? "نوبة متضاربة"
                      : "conflicting shifts"}
                  </div>
                </div>
              </div>
              {expandedOverlaps[overlap.id] ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>

            {/* Overlap Details */}
            {expandedOverlaps[overlap.id] && (
              <div
                className={`p-4 border-t ${
                  isDark
                    ? "border-gray-600 bg-gray-750"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                {/* Doctor Cards */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {/* Doctor 1 */}
                  <div
                    className={`p-4 rounded-lg border ${
                      isDark
                        ? "bg-gray-600 border-gray-500"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4
                          className={`font-semibold ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {currentLang === "ar"
                            ? overlap.doctor1.nameAr
                            : overlap.doctor1.nameEn}
                        </h4>
                        <p
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {overlap.doctor1.leaveType}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          overlap.doctor1.status
                        )}`}
                      >
                        {overlap.doctor1.statusName}
                      </span>
                    </div>
                    <div
                      className={`text-sm space-y-1 ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(overlap.doctor1.startDate)} -{" "}
                          {formatDate(overlap.doctor1.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Doctor 2 */}
                  <div
                    className={`p-4 rounded-lg border ${
                      isDark
                        ? "bg-gray-600 border-gray-500"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4
                          className={`font-semibold ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {currentLang === "ar"
                            ? overlap.doctor2.nameAr
                            : overlap.doctor2.nameEn}
                        </h4>
                        <p
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {overlap.doctor2.leaveType}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          overlap.doctor2.status
                        )}`}
                      >
                        {overlap.doctor2.statusName}
                      </span>
                    </div>
                    <div
                      className={`text-sm space-y-1 ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(overlap.doctor2.startDate)} -{" "}
                          {formatDate(overlap.doctor2.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overlapping Shifts */}
                <div>
                  <h5
                    className={`font-semibold mb-3 flex items-center gap-2 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    {currentLang === "ar"
                      ? "النوبات المتضاربة"
                      : "Conflicting Shifts"}
                  </h5>
                  <div className="space-y-2">
                    {overlap.overlappingShifts.map((shift, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          isDark
                            ? "bg-red-900/20 border-red-700"
                            : "bg-red-50 border-red-200"
                        }`}
                      >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <span
                              className={`font-medium block mb-1 ${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {currentLang === "ar" ? "التاريخ" : "Date"}
                            </span>
                            <span
                              className={
                                isDark ? "text-gray-200" : "text-gray-900"
                              }
                            >
                              {formatDate(shift.date)}
                            </span>
                          </div>
                          <div>
                            <span
                              className={`font-medium block mb-1 ${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {currentLang === "ar" ? "اليوم" : "Day"}
                            </span>
                            <span
                              className={
                                isDark ? "text-gray-200" : "text-gray-900"
                              }
                            >
                              {currentLang === "ar" ? shift.dayAr : shift.dayEn}
                            </span>
                          </div>
                          <div>
                            <span
                              className={`font-medium block mb-1 ${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {currentLang === "ar" ? "النوبة" : "Shift"}
                            </span>
                            <span
                              className={
                                isDark ? "text-gray-200" : "text-gray-900"
                              }
                            >
                              {currentLang === "ar"
                                ? shift.shiftAr
                                : shift.shiftEn}
                            </span>
                          </div>
                          <div>
                            <span
                              className={`font-medium block mb-1 ${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {currentLang === "ar" ? "المكان" : "Department"}
                            </span>
                            <span
                              className={
                                isDark ? "text-gray-200" : "text-gray-900"
                              }
                            >
                              {currentLang === "ar"
                                ? shift.departmentAr
                                : shift.departmentEn}
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span
                              className={`font-medium block mb-1 ${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {currentLang === "ar" ? "الوقت" : "Time"}
                            </span>
                            <span
                              className={
                                isDark ? "text-gray-200" : "text-gray-900"
                              }
                            >
                              {shift.time} ({shift.hours}{" "}
                              {currentLang === "ar" ? "ساعة" : "hours"})
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default LeavesWithOverlap
