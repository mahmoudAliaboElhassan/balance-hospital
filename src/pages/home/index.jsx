import { useEffect } from "react";
import axios from "axios";

const Home = () => {
  useEffect(() => {
    axios
      .get("http://balancev1.runasp.net/api/v1/Category/Categories-types", {
        withCredentials: true, // include cookies if your API uses them
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        // assuming your API returns { success: true, data: CategoryType[] }
        console.log(res);
      })
      .catch((err) => {
        console.log("Error fetching category types:", err);
      });
  }, []);

  return <div>hello</div>;
};

export default Home;
