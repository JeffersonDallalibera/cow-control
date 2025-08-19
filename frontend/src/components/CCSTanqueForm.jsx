import { useState } from "react";

export default function CCSTanqueForm({ onAdd }) {
  const [form, setForm] = useState({
    tanque_id: "",
    data: "",
    ccs_medio: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3000/ccs-tanque", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      onAdd(data[0]);
      setForm({ tanque_id: "", data: "", ccs_medio: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded mb-4 flex flex-wrap gap-2 bg-white shadow">
      <input name="tanque_id" value={form.tanque_id} onChange={handleChange} placeholder="ID do Tanque" className="border p-2" required />
      <input type="date" name="data" value={form.data} onChange={handleChange} className="border p-2" required />
      <input name="ccs_medio" value={form.ccs_medio} onChange={handleChange} placeholder="CCS Médio" className="border p-2" required />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Salvar</button>
    </form>
  );
}
