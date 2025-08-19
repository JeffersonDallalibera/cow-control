import { useEffect, useState } from "react";
import CCSTanqueForm from "../components/CCSTanqueForm";

export default function CCSTanquePage() {
  const [tanques, setTanques] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/ccs-tanque")
      .then((res) => res.json())
      .then((data) => setTanques(data));
  }, []);

  const addTanque = (novo) => setTanques([...tanques, novo]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Cadastro CCS Tanque</h1>
      <CCSTanqueForm onAdd={addTanque} />
      <table className="table-auto border-collapse border border-gray-400 w-full bg-white shadow">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Tanque ID</th>
            <th className="border p-2">Data</th>
            <th className="border p-2">CCS Médio</th>
          </tr>
        </thead>
        <tbody>
          {tanques.map((t) => (
            <tr key={t.id}>
              <td className="border p-2">{t.id}</td>
              <td className="border p-2">{t.tanque_id}</td>
              <td className="border p-2">{t.data}</td>
              <td className="border p-2">{t.ccs_medio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
