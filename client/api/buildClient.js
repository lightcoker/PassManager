import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    // executed on server
    return axios.create({
      baseURL: process.env.HOSTING_SITE,
      headers: req.headers,
    });
  } else {
    // executed on client
    return axios.create({
      baseURL: "/",
    });
  }
};
