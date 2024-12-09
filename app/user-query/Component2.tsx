"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import HospitalTable from "@/components/table/HospitalTable";
import { toast } from "react-toastify";
import { PROXY } from "@/config";
import axios from "axios";
import { useEffect, useState } from "react";

const Component2 = ({ setId, setState, state }: any) => {
  const [HospitaltableData, setHospitaltableData] = useState([]);
  const [updateApi, setUpdateApi] = useState(false);
  const getData = async () => {
    const res = await axios.get(`${PROXY}/inquiry`, {
      headers: {
        Authorization: `Bearer ${
          typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("Indiduser")!)?.token
            : ""
        }`,
      },
    });
    setHospitaltableData(res.data.data);
  };
  useEffect(() => {
    getData();
  }, [updateApi, state]);
  const Hospitalheaders = [
    { label: "Name", name: "pName" },
    { label: "Email", name: "email" },
    { label: "Mobile", name: "mNo" },
    { label: "Description", name: "description" },
  ];

  return (
    <>
      <Breadcrumb pageName="User Query" />
      <div className="flex flex-col gap-10">
        <HospitalTable
          isPage={false}
          isSearch={false}
          setUpdateApi={setUpdateApi}
          onAddClick={(id: any) => {
            setId(id), setState("add");
          }}
          headers={Hospitalheaders}
          tableData={HospitaltableData}
          name="User Query"
          onDelClick={async (id: any) => {
            const res = await axios.delete(`${PROXY}/inquiry?id=${id}`, {
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
