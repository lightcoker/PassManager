import axios from "axios";
import getConfig from "next/config";

export default ({ req }) => {
  const { serverRuntimeConfig } = getConfig();
  const { NODE_ENV, HOSTING_SITE } = serverRuntimeConfig;
  console.log({ NODE_ENV, HOSTING_SITE });

  if (typeof window === "undefined") {
    // executed on server
    return axios.create({
      baseURL: HOSTING_SITE, // "http://www.albertapp.codes" (dev) or "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local" (prod)
      headers: req.headers,
    });
  } else {
    // executed on client
    return axios.create({
      baseURL: "/",
    });
  }
};
