"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import HospitalTable from "@/components/table/HospitalTable";
import { toast } from "react-toastify";
import { PROXY } from "@/config";
import axios from "axios";
import { useEffect, useState } from "react";

const Component2 = ({ setId, setState }: any) => {
  const [HospitaltableData, setHospitaltableData] = useState([]);
  const [search, setSearch] = useState("");
  const [updateApi, setUpdateApi] = useState(false);
  const [page, setPage] = useState(1);
  const [totalpage, setTotalPage] = useState();
  const getData = async () => {
    const res = await axios.get(
      `${PROXY}/product/getall?page=${page}&search=${search}`,
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
    console.log("🚀 ~ file: Component2.tsx:26 ~ getData ~ res:", res);
    setTotalPage(res.data.totalPage);
    setHospitaltableData(
      res.data.data.map((val: any) => {
        return {
          ...val,
          createdAt: `${new Date(val.createdAt).getDate()} / ${new Date(
            val.createdAt
          ).getMonth()} / ${new Date(val.createdAt).getFullYear()}`,
          updatedAt: `${new Date(val.updatedAt).getDate()} / ${new Date(
            val.updatedAt
          ).getMonth()} / ${new Date(val.updatedAt).getFullYear()}`,
        };
      })
    );
  };
  useEffect(() => {
    getData();
  }, [page, updateApi]);
  const Hospitalheaders = [
    { label: "Title", name: "product_name" },
    { label: "Category", name: "category" },
    { label: "Price", name: "price" },
    { label: "created date", name: "createdAt" },
    { label: "last updated", name: "updatedAt" },
  ];

  return (
    <>
      <Breadcrumb pageName="Products" />
      <div className="flex flex-col gap-10">
        <HospitalTable
          setUpdateApi={setUpdateApi}
          setSearch={setSearch}
          totalpage={totalpage}
          setPage={setPage}
          onAddClick={() => {
            setId(""), setState("add");
          }}
          headers={Hospitalheaders}
          tableData={HospitaltableData}
          name="Products"
          onEyeClick={(id: any) => {
            setId(id);
            setState("edit");
          }}
          onDelClick={async (id: any) => {
            const res = await axios.delete(`${PROXY}/product/delete?id=${id}`, {
              headers: {
                Authorization: `Bearer ${
                  typeof window !== "undefined"
                    ? JSON.parse(localStorage.getItem("Indiduser")!)?.token
                    : ""
                }`,
              },
            });
            toast.success("Blog Deleted Successfully");
            setUpdateApi(!updateApi);
          }}
        />
      </div>
    </>
  );
};

export default Component2;
