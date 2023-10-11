import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const fetchPets = async () => {
  const response = await axios.get("http://localhost:3000/pets");
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

  return (
    <div>
      {pets.map((pet) => (
        <div key={pet._id}>
          <Link to={`/pets/${pet._id}`}>{pet.name}</Link> is {pet.type} and has{" "}
          <strong>owner: {pet.owner.name}</strong>
        </div>
      ))}
    </div>
  );
};

export default Home;
