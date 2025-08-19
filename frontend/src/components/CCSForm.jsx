import { useState } from "react";

export default function CCSForm({ onAdd }) {
  const [form, setForm] = useState({
    animal_id: "",
    data: "",
    ccs: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3000/ccs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      onAdd(data[0]);
      setForm({ animal_id: "", data: "", ccs: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
  <input
    name="animal_id"
    value={form.animal_id}
    onChange={handleChange}
    placeholder="ID do Animal"
    required
  />
  <input
    type="date"
    name="data"
    value={form.data}
    onChange={handleChange}
    required
  />
  <input
    name="ccs"
    value={form.ccs}
    onChange={handleChange}
    placeholder="CCS"
    required
  />
  <button type="submit">Salvar</button>
</form>
  );
}
