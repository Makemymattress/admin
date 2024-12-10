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
    const res = await axios.get(`${PROXY}/user`, {
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
    { label: "Name", name: "name" },
    { label: "Email", name: "email" },
    { label: "Mobile", name: "mobile" },
  ];

  return (
    <>
      <Breadcrumb pageName="Registered Users" />
      <div className="flex flex-col gap-10">
        <HospitalTable
          isPage={false}
          notactions={true}
          isSearch={false}
          setUpdateApi={setUpdateApi}
          onAddClick={(id: any) => {
            setId(id), setState("add");
          }}
          headers={Hospitalheaders}
          tableData={HospitaltableData}
          name="Registered Users"
        />
      </div>
    </>
  );
};

export default Component2;
