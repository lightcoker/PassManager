import { useEffect } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

export default () => {
  // executing signing out in client side to clear cookie
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return (
    <section className="columns is-multiline is-text-centered mt-2">
      <div className="card column is-6 is-offset-3">
        <div className="has-text-centered card-content">Signing you out...</div>
      </div>
    </section>
  );
};
