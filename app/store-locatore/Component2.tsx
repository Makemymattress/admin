"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import StoreTable from "@/components/table/HospitalTable";
import { Button, Modal } from "@/components/ui";
import { toast } from "react-toastify";
import { PROXY } from "@/config";
import axios from "axios";
import { useEffect, useState } from "react";

const StoreLocator = () => {
  const [storeData, setStoreData] = useState([]);
  const [search, setSearch] = useState("");
  const [updateApi, setUpdateApi] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    address: "",
    cityid: "",
    timings: { open: "", close: "" },
    phone: "",
    imageUrl: "",
    mapUrl: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${PROXY}/store/create`, form, {
        headers: {
          Authorization: `Bearer ${
            typeof window !== "undefined"
              ? JSON.parse(localStorage.getItem("Indiduser")!)?.token
              : ""
          }`,
        },
      });
      toast.success("Store added successfully!");
      setModalOpen(false);
      setUpdateApi(!updateApi);
    } catch (error) {
      toast.error("Failed to add store!");
    }
  };

  const getData = async () => {
    const res = await axios.get(
      `${PROXY}/store/getall?page=${page}&search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${
            typeof window !== "undefined"
              ? JSON.parse(localStorage.getItem("Indiduser")!)?.token
              : ""
          }`,
        },
      }
    );

    setTotalPage(res.data.totalPage);
    setStoreData(
      res.data.data.map((val: any) => ({
        ...val,
        createdAt: `${new Date(val.createdAt).getDate()} / ${new Date(
          val.createdAt
        ).getMonth()} / ${new Date(val.createdAt).getFullYear()}`,
        updatedAt: `${new Date(val.updatedAt).getDate()} / ${new Date(
          val.updatedAt
        ).getMonth()} / ${new Date(val.updatedAt).getFullYear()}`,
      }))
    );
  };

  useEffect(() => {
    getData();
  }, [page, updateApi]);

  const storeHeaders = [
    { label: "Store Name", name: "name" },
    { label: "Address", name: "address" },
    { label: "Phone", name: "phone" },
    { label: "Created Date", name: "createdAt" },
    { label: "Last Updated", name: "updatedAt" },
  ];

  return (
    <>
      <Breadcrumb pageName="Stores" />
      <div className="flex flex-col gap-10">
        <StoreTable
          setUpdateApi={setUpdateApi}
          setSearch={setSearch}
          totalpage={totalPage}
          setPage={setPage}
          onAddClick={() => setModalOpen(true)}
          headers={storeHeaders}
          tableData={storeData}
          name="Stores"
          onEyeClick={(id: any) => {
            console.log("View store:", id);
          }}
          onDelClick={async (id: any) => {
            await axios.delete(`${PROXY}/store/delete?id=${id}`, {
              headers: {
                Authorization: `Bearer ${
                  typeof window !== "undefined"
                    ? JSON.parse(localStorage.getItem("Indiduser")!)?.token
                    : ""
                }`,
              },
            });
            toast.success("Store Deleted Successfully");
            setUpdateApi(!updateApi);
          }}
        />
      </div>

      {/* Add Store Modal */}
      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)} title="Add Store">
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Store Name"
              className="input"
            />
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
              className="input"
            />
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="input"
            />
            <input
              type="text"
              name="cityid"
              value={form.cityid}
              onChange={handleChange}
              placeholder="City ID"
              className="input"
            />
            <input
              type="text"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="Image URL"
              className="input"
            />
            <input
              type="text"
              name="mapUrl"
              value={form.mapUrl}
              onChange={handleChange}
              placeholder="Google Maps URL"
              className="input"
            />
            <div className="flex gap-2">
              <input
                type="text"
                name="open"
                value={form.timings.open}
                onChange={(e) =>
                  setForm({
                    ...form,
                    timings: { ...form.timings, open: e.target.value },
                  })
                }
                placeholder="Opening Time"
                className="input"
              />
              <input
                type="text"
                name="close"
                value={form.timings.close}
                onChange={(e) =>
                  setForm({
                    ...form,
                    timings: { ...form.timings, close: e.target.value },
                  })
                }
                placeholder="Closing Time"
                className="input"
              />
            </div>
            <Button onClick={handleSubmit}>Add Store</Button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default StoreLocator;
