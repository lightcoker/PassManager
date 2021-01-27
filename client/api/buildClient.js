import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    // executed on server
    return axios.create({
      baseURL:
        process.env.NODE_ENV === "production"
          ? process.env.HOSTING_SITE
          : "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    // executed on client
    return axios.create({
      baseURL: "/",
    });
  }
};
