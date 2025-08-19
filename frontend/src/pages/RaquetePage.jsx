import { useEffect, useState } from "react";
import RaqueteForm from "../components/RaqueteForm";

export default function RaquetePage() {
  const [raquetes, setRaquetes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/raquete")
      .then((res) => res.json())
      .then((data) => setRaquetes(data));
  }, []);

  const addRaquete = (novo) => setRaquetes([...raquetes, novo]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Cadastro Raquete</h1>
      <RaqueteForm onAdd={addRaquete} />
      <table className="table-auto border-collapse border border-gray-400 w-full bg-white shadow">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Animal ID</th>
            <th className="border p-2">Data</th>
            <th className="border p-2">Resultado</th>
          </tr>
        </thead>
        <tbody>
          {raquetes.map((r) => (
            <tr key={r.id}>
              <td className="border p-2">{r.id}</td>
              <td className="border p-2">{r.animal_id}</td>
              <td className="border p-2">{r.data}</td>
              <td className="border p-2">{r.resultado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
