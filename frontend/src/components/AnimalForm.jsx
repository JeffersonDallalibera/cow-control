import { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

export default function AnimalForm({ onAdd }) {
  const [form, setForm] = useState({
    brinco: "",
    nome: "",
    lote: "",
    data_nascimento: "",
    raca: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/animal/CreateCow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        onAdd(data[0]);
        setForm({
          brinco: "",
          nome: "",
          lote: "",
          data_nascimento: "",
          raca: "",
        });
      } else {
        console.error("Erro ao salvar animal");
      }
    } catch (err) {
      console.error("Erro de rede:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded-lg mb-4 flex flex-col md:flex-row md:flex-wrap gap-4 bg-white shadow"
    >
      <input
        name="brinco"
        value={form.brinco}
        onChange={handleChange}
        placeholder="Brinco"
        className="border p-2 rounded w-full md:w-auto flex-1"
        required
      />
      <input
        name="nome"
        value={form.nome}
        onChange={handleChange}
        placeholder="Nome"
        className="border p-2 rounded w-full md:w-auto flex-1"
      />
      <input
        name="lote"
        value={form.lote}
        onChange={handleChange}
        placeholder="Lote"
        className="border p-2 rounded w-full md:w-auto flex-1"
      />
      <input
        type="date"
        name="data_nascimento"
        value={form.data_nascimento}
        onChange={handleChange}
        className="border p-2 rounded w-full md:w-auto flex-1"
      />
      <input
        name="raca"
        value={form.raca}
        onChange={handleChange}
        placeholder="Raça"
        className="border p-2 rounded w-full md:w-auto flex-1"
      />
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded transition"
      >
        Salvar
      </button>
    </form>
  );
}
