import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const fetchPets = async () => {
  const response = await axios.get("http://localhost:3000/pets");
  return response.data;
};

const deletePet = async (id) => {
  const response = await axios.delete(`http://localhost:3000/pets/${id}`);
  return response.data;
};

const Home = () => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    fetchPets()
      .then((response) => {
        setPets(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleDelete = async (id) => {
    try {
      await deletePet(id);
      setPets((prevPets) => prevPets.filter((pet) => pet._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        width: 1100,
        margin: "50px auto",
        textAlign: "center",
      }}
    >
      {pets.map((pet) => (
        <div key={pet._id} style={{ marginBottom: 20 }}>
          <Link to={`/pets/${pet._id}`}>{pet.name}</Link> is {pet.type} and has{" "}
          <strong>owner: {pet.owner.name}</strong>
          <span
            style={{ marginLeft: 20, color: "red" }}
            onClick={() => handleDelete(pet._id)}
          >
            DELETE
          </span>
        </div>
      ))}
    </div>
  );
};

export default Home;
