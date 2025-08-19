import { useEffect, useState } from "react";
import CCSForm from "../components/CCSForm";

export default function CCSPage() {
  const [ccsList, setCcsList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/ccs")
      .then((res) => res.json())
      .then((data) => setCcsList(data));
  }, []);

  const addCcs = (novo) => setCcsList([...ccsList, novo]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Cadastro CCS Individual</h1>
      <CCSForm onAdd={addCcs} />
      <table className="table-auto border-collapse border border-gray-400 w-full bg-white shadow">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Animal ID</th>
            <th className="border p-2">Data</th>
            <th className="border p-2">CCS</th>
          </tr>
        </thead>
        <tbody>
          {ccsList.map((ccs) => (
            <tr key={ccs.id}>
              <td className="border p-2">{ccs.id}</td>
              <td className="border p-2">{ccs.animal_id}</td>
              <td className="border p-2">{ccs.data}</td>
              <td className="border p-2">{ccs.ccs}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
