import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const fetchPet = async (id) => {
  const response = await axios.get(`http://localhost:3000/pets/${id}`);
  return response.data;
};

const Pet = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPet(id)
      .then((response) => {
        setPet(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!pet) {
    return <div>Pet not found</div>;
  }

  return (
    <div>
      Pet {pet.name} owner {pet.owner.name}
    </div>
  );
};

export default Pet;
