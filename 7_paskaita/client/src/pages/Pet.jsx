import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const fetchPet = async (id) => {
  const response = await axios.get(`http://localhost:3000/pets/${id}`);
  return response.data;
};

const fetchOwners = async () => {
  const response = await axios.get("http://localhost:3000/");
  return response.data;
};

const updatePet = async (id, pet) => {
  const response = await axios.put(`http://localhost:3000/pets/${id}`, pet);
  return response.data;
};

const Pet = () => {
  const { id } = useParams();
  const [owners, setOwners] = useState([]);
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetctPetData = (id) => {
    fetchPet(id)
      .then((response) => {
        setPet(response);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetctPetData(id);
  }, [id]);

  useEffect(() => {
    fetchOwners()
      .then((response) => {
        setOwners(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleUpdateOwner = (event) => {
    const ownerId = event.target.value;
    const updatingPet = { ownerId };

    updatePet(id, updatingPet)
      .then(() => {
        fetctPetData(id);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!pet) {
    return <div>Pet not found</div>;
  }

  return (
    <div>
      Pet {pet.name} owner{" "}
      <select value={pet.owner._id} onChange={handleUpdateOwner}>
        {owners.map((owner) => (
          <option key={owner._id} value={owner._id}>
            {owner.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Pet;
