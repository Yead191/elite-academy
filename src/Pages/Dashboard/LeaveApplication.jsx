import { useState } from "react";
import { ConfigProvider, Input, Select, Table } from "antd";
import { FiSearch, FiEye } from "react-icons/fi";
import moment from "moment";
import { imageUrl } from "../../redux/api/baseApi";
import LeaveModal from "../../Components/Dashboard/LeaveModal";
import {
  useChangeStatusMutation,
  useGetLeavesQuery,
} from "../../redux/features/leaveApi";
import toast from "react-hot-toast";

export default function LeaveApplication() {
  const [searchText, setSearchText] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  // api calls
  const { data: leaves, refetch } = useGetLeavesQuery({
    page,
    searchTerm: searchText,
  });
  const [changeStatus] = useChangeStatusMutation();

  // console.log(leaves);
  const paginationData = leaves?.pagination;
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleStatusChange = (value, id, name) => {
    toast.promise(changeStatus({ id, status: value }), {
      loading: "Loading...",
      success: `Status for ${name} changed to ${value}`,
      error: "Failed to change status!",
    });
    refetch();
  };

  const showDetails = (record) => {
    setSelectedApplication(record);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  // Filter data based on search text (searching by name or email)

  const columns = [
    {
      title: "Serial No.",
      dataIndex: "key",
      key: "key",
      render: (_, __, index) => (
        <span className="text-[#FDFDFD]">{index + 1}</span>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src={
              record?.couch?.image && record?.couch?.image.startsWith("http")
                ? record?.couch?.image
                : record?.couch?.image
                  ? `${imageUrl}${record?.couch?.image}`
                  : "/default-avatar.jpg"
            }
            alt={record?.couch?.name}
            className="w-10 h-10 object-cover rounded-full"
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/40x40?text=U";
            }}
          />
          <div>
            <p className="text-[#FDFDFD] font-medium">{record?.couch?.name}</p>
            <p className="text-[#aaaaaa] text-xs">{record?.couch?.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (text) => (
        <span className="text-[#FDFDFD] line-clamp-1" title={text}>
          {text.length > 30 ? text.substring(0, 30) + "..." : text}
        </span>
      ),
    },
    {
      title: "Duration",
      key: "duration",
      render: (_, record) => (
        <div className="text-[#FDFDFD]">
          <p>From: {moment(record.startDate).format("MMM DD, YYYY")}</p>
          <p>To: {moment(record.endDate).format("MMM DD, YYYY")}</p>
        </div>
      ),
    },
    {
      title: "Applied Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <span className="text-[#FDFDFD]">
          {moment(date).format("MMM DD, YYYY")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <ConfigProvider
          theme={{
            token: {
              colorText: "#FDFDFD",
              colorBgContainer: "#13333A",
              colorBorder: "#2E7A8A",
            },
            components: {
              Select: {
                optionSelectedBg: "#2E7A8A",
                selectorBg: "2e7a8a",
                optionColor: "#000000",
                // colorBgElevated: "#13333A",
                colorBgElevated: "#000000",
              },
            },
          }}
        >
          <Select
            defaultValue={status}
            style={{ width: 120 }}
            onChange={(value) =>
              handleStatusChange(value, record._id, record?.couch?.name)
            }
            options={[
              {
                value: "pending",
                label: <span className="text-yellow-500">Pending</span>,
              },
              {
                value: "approved",
                label: <span className="text-white">Approved</span>,
              },
              {
                value: "rejected",
                label: <span className="text-red-500">Rejected</span>,
              },
            ]}
          />
        </ConfigProvider>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <button
          onClick={() => showDetails(record)}
          className="text-[#FDFDFD] hover:text-[#2E7A8A] transition-colors p-2"
          title="View Details"
        >
          <FiEye size={20} />
        </button>
      ),
    },
  ];

  return (
    <div className="w-full h-full bg-[#13333A]">
      <div style={{ borderRadius: "8px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "0px 16px",
            padding: "16px 0px",
          }}
        >
          <h3
            style={{
              color: "#FDFDFD",
              fontSize: 18,
              fontWeight: "500",
              lineHeight: "24px",
            }}
          >
            Leave Applications
          </h3>

          <div style={{ width: "350px", height: "40px", borderRadius: "8px" }}>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#13333A",
                },
              }}
            >
              <Input
                placeholder="Search by name or email..."
                onChange={handleSearchChange}
                prefix={<FiSearch size={14} color="#868FA0" />}
                style={{
                  width: "100%",
                  height: "100%",
                  fontSize: "14px",
                  backgroundColor: "#FAFAFA",
                }}
                size="middle"
              />
            </ConfigProvider>
          </div>
        </div>

        <div className="relative h-full">
          <ConfigProvider
            theme={{
              components: {
                Pagination: {
                  itemActiveBg: "#FFC107",
                  borderRadius: "100%",
                  colorText: "white",
                  colorTextDisabled: "#6C6C6C",
                },
                Table: {
                  rowHoverBg: "#1E414A",
                  headerBg: "#13333A",
                  headerColor: "#FDFDFD",
                  colorBgContainer: "#13333A",
                  borderColor: "#2E7A8A",
                },
              },
              token: {
                colorPrimary: "#13333A",
                colorText: "#FDFDFD",
              },
            }}
          >
            <Table
              size="small"
              columns={columns}
              rowKey="_id"
              dataSource={leaves?.data}
              pagination={{
                total: paginationData?.total,
                pageSize: paginationData?.limit,
                current: paginationData?.page,
                onChange: (page) => setPage(page),
              }}
              className="custom-table"
            />
          </ConfigProvider>
        </div>
      </div>

      <LeaveModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedApplication={selectedApplication}
        onClose={closeModal}
      />
    </div>
  );
}
