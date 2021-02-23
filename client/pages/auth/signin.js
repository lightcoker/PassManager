import { useState, useEffect } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    await doRequest();
  };

  return (
    <section className="columns is-multiline is-text-centered mt-2">
      <div className="card column is-6 is-offset-3">
        <form onSubmit={onSubmit} className="has-text-centered card-content">
          <h2 className="title is-2">Sign In</h2>
          <div className="field">
            <label className="label">Email Address</label>
            <div className="control">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Password</label>
            <div className="control">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="input"
              />
            </div>
          </div>
          <div className="field"></div>
          {errors}
          <button type="submit" className={`button is-primary mr-2 mt-2`}>
            Log In
          </button>
        </form>
      </div>
    </section>
  );
};
