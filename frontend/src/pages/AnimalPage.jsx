import { useEffect, useState } from "react";
import AnimalForm from "../components/AnimalForm";
import AnimalList from "../components/AnimalList";

export default function AnimalPage() {
  const [animais, setAnimais] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/animal")
      .then(res => res.json())
      .then(data => setAnimais(data));
  }, []);

  const addAnimal = novo => setAnimais([...animais, novo]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Cadastro de Animais</h1>
      <AnimalForm onAdd={addAnimal} />
      <AnimalList animais={animais} />
    </div>
  );
}
