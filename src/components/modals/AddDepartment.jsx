import { useState } from "react"
import { Plus } from "lucide-react"
import { useTranslation } from "react-i18next"
import ModalAddRosterDepartment from "./ModalAddRosterDepartment"

export function AddDepartmentButton() {
  const [showModal, setShowModal] = useState(false)
  const { t } = useTranslation()

  const handleOpenModal = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleSuccess = () => {
    setShowModal(false)
  }

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        <Plus size={18} className="mr-2" />
        {t("roster.actions.addDepartment")}
      </button>

      {showModal && (
        <ModalAddRosterDepartment
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </>
  )
}
