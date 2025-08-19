import { useState } from "react";

export default function RaqueteForm({ onAdd }) {
  const [form, setForm] = useState({
    animal_id: "",
    data: "",
    resultado: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3000/raquete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      onAdd(data[0]);
      setForm({ animal_id: "", data: "", resultado: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded mb-4 flex flex-wrap gap-2 bg-white shadow">
      <input name="animal_id" value={form.animal_id} onChange={handleChange} placeholder="ID do Animal" className="border p-2" required />
      <input type="date" name="data" value={form.data} onChange={handleChange} className="border p-2" required />
      <input name="resultado" value={form.resultado} onChange={handleChange} placeholder="Resultado" className="border p-2" required />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Salvar</button>
    </form>
  );
}
