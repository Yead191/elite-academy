import { Modal, Tag } from "antd";
import { imageUrl } from "../../redux/api/baseApi";
import moment from "moment";

export default function LeaveModal({
  isModalOpen,
  setIsModalOpen,
  selectedApplication,
  onClose,
}) {
  return (
    <Modal
      title={
        <h2 className="text-[#13333A] text-lg font-semibold px-6 py-4">
          Leave Application Details
        </h2>
      }
      open={isModalOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={600}
    >
      <div className="px-6 pb-6">
        {selectedApplication && (
          <div className="flex flex-col gap-4 mt-4 text-[#13333A]">
            <div className="flex items-center gap-4 border-b pb-4">
              <img
                src={
                  selectedApplication?.couch?.image &&
                  selectedApplication?.couch?.image.startsWith("http")
                    ? selectedApplication?.couch?.image
                    : selectedApplication?.couch?.image
                      ? `${imageUrl}${selectedApplication?.couch?.image}`
                      : "/default-avatar.jpg"
                }
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover border border-gray-200"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/64x64?text=U";
                }}
              />
              <div>
                <h4 className="text-xl font-bold">
                  {selectedApplication.couch?.name}
                </h4>
                <p className="text-gray-500">
                  {selectedApplication.couch?.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-500">
                  Start Date
                </label>
                <p className="font-medium">
                  {moment(selectedApplication.startDate).format(
                    "MMMM DD, YYYY",
                  )}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500">
                  End Date
                </label>
                <p className="font-medium">
                  {moment(selectedApplication.endDate).format("MMMM DD, YYYY")}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500">
                  Total Duration
                </label>
                <p className="font-medium">
                  {moment(selectedApplication.endDate).diff(
                    moment(selectedApplication.startDate),
                    "days",
                  ) + 1}{" "}
                  Days
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-500">
                  Current Status
                </label>
                <div className="mt-1">
                  {selectedApplication.status === "approved" && (
                    <Tag color="green">Approved</Tag>
                  )}
                  {selectedApplication.status === "pending" && (
                    <Tag color="gold">Pending</Tag>
                  )}
                  {selectedApplication.status === "rejected" && (
                    <Tag color="red">Rejected</Tag>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="text-sm font-semibold text-gray-500 block mb-1">
                Reason for Leave
              </label>
              <div className="bg-gray-50 p-4 rounded-md border text-gray-700">
                {selectedApplication.reason}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
