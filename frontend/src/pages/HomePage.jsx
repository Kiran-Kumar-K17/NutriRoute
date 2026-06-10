import "../styles/HomePage.css";
import { useState, useEffect } from "react";
import API from "../api/axios.js";
const HomePage = () => {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await API.get("/foods/getAll");
        setFoods(response.data.foods);
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };

    fetchFoods();
  }, []);

  return (
    <div>
      <div className="container">
        {foods.map((food) => (
          <div className="card" key={food._id}>
            <img src={food.image} alt={food.name} />
            <div className="content">
              <h3>{food.name}</h3>
              <h4>{food.restaurantId?.name}</h4>
              <p>{food.description}</p>
            </div>
            <div className="footer">
              <h4>Price: {food.price}</h4>
              <button>Order Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
