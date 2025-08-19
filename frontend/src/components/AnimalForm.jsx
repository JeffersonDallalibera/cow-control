import { useState } from "react";

export default function AnimalForm({ onAdd }) {
  const [form, setForm] = useState({ brinco: "", nome: "", lote: "", data_nascimento: "", raca: "" });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch("http://localhost:3000/animal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      const data = await res.json();
      onAdd(data[0]);
      setForm({ brinco: "", nome: "", lote: "", data_nascimento: "", raca: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded mb-4 flex flex-wrap gap-2 bg-white shadow">
      <input name="brinco" value={form.brinco} onChange={handleChange} placeholder="Brinco" className="border p-2" required />
      <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome" className="border p-2" />
      <input name="lote" value={form.lote} onChange={handleChange} placeholder="Lote" className="border p-2" />
      <input type="date" name="data_nascimento" value={form.data_nascimento} onChange={handleChange} className="border p-2" />
      <input name="raca" value={form.raca} onChange={handleChange} placeholder="Raça" className="border p-2" />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Salvar</button>
    </form>
  );
}
