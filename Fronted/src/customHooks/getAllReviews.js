import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setReviewData } from "../redux/reviewSlice";

const useAllReviews = () => {

    const dispatch = useDispatch ()
  useEffect(() => {
    const allReviews = async () => {
      try {
        const result = await axios.get(
          serverUrl + "/api/review/getreview",
          { withCredentials: true }
        );
        dispatch(setReviewData(result.data))
        console.log(result.data); // You can store this in state instead
      } catch (error) {
        console.log( error)
      }
    };

    allReviews(); // ❗ You forgot to call the function here
  }, []);
};

export default useAllReviews;
