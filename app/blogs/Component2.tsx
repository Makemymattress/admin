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
      `${PROXY}/blog/getall?page=${page}&search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ?
            JSON.parse(localStorage.getItem("Indiduser")!)?.token : ""
          }`,
        },
      }
    );
    setTotalPage(res.data.totalPage);
    setHospitaltableData(
      res.data.data.map((val: any) => {
        return {
          _id: val._id,
          title: val.title,
          category: val.category,
          subCategory: val.subCategory,
          url: val.url,
        };
      })
    );
  };
  useEffect(() => {
    getData();
  }, [page, updateApi]);
  const Hospitalheaders = [
    { label: "Title", name: "title" },
    { label: "Category", name: "category" },
    { label: "Sub Category", name: "subCategory" },
    { label: "URL", name: "url" },
  ];

  return (
    <>
      <Breadcrumb pageName="Blogs" />
      <div className="flex flex-col gap-10">
        <HospitalTable
          setUpdateApi={setUpdateApi}
          setSearch={setSearch}
          totalpage={totalpage}
          setPage={setPage}
          onAddClick={() => {
            setId(""), setState(true);
          }}
          headers={Hospitalheaders}
          tableData={HospitaltableData}
          name="Blogs"
          onEyeClick={(id: any) => {
            setId(id);
            setState(true);
          }}
          onDelClick={async (id: any) => {
            const res = await axios.post(
              `${PROXY}/blog/delete?id=${id}`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${typeof window !== 'undefined' ?
                    JSON.parse(localStorage.getItem("Indiduser")!)?.token : ""
                  }`,
                },
              }
            );
            toast.success("Blog Deleted Successfully");
            setUpdateApi(!updateApi);
          }}
        />
      </div>
    </>
  );
};

export default Component2;
