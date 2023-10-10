import { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field } from "formik";

const App = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/")
      .then((resp) => resp.data)
      .then((response) => {
        setCars(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>brand</th>
            <th>model</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car._id}>
              <td>{car._id}</td>
              <td>{car.brand}</td>
              <td>{car.model}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <br />
      <Formik
        initialValues={{ brand: "", model: "" }}
        onSubmit={(values) => {
          const newCar = values;
          axios
            .post("http://localhost:3000/", newCar)
            .then(() => {
              setCars((prevCars) => [...prevCars, newCar]);
            })
            .catch((error) => {
              console.error(error);
            });
        }}
      >
        <Form>
          <Field name="brand" placeholder="Brand..." />
          <Field name="model" placeholder="Model..." />
          <button type="submit">Add new car</button>
        </Form>
      </Formik>
    </div>
  );
};

export default App;
