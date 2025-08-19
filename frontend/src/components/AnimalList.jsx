export default function AnimalList({ animais }) {
  return (
    <table className="table-auto border-collapse border border-gray-400 w-full bg-white shadow">
      <thead>
        <tr>
          <th className="border p-2">Brinco</th>
          <th className="border p-2">Nome</th>
          <th className="border p-2">Lote</th>
          <th className="border p-2">Nascimento</th>
          <th className="border p-2">Raça</th>
        </tr>
      </thead>
      <tbody>
        {animais.map(animal => (
          <tr key={animal.id}>
            <td className="border p-2">{animal.brinco}</td>
            <td className="border p-2">{animal.nome}</td>
            <td className="border p-2">{animal.lote}</td>
            <td className="border p-2">{animal.data_nascimento}</td>
            <td className="border p-2">{animal.raca}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
