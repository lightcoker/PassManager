import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
import { useRouter } from "next/router";
import { parseDomain, fromUrl } from "parse-domain";
import Error from "next/error";

const SavePage = ({ currentUser }) => {
  // user validation
  if (!currentUser) {
    return <Error statusCode={401} />;
  }

  const router = useRouter();
  const [domain, setDomain] = useState("");
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState(router.query.password ?? "");

  const { doRequest, errors } = useRequest({
    url: "/api/password/save",
    method: "post",
    body: {
      domain,
      account,
      password,
    },
    onSuccess: () => router.push("/password"),
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  };

  const onBlur = () => {
    const parsedResult = parseDomain(fromUrl(domain));
    if (parsedResult.type !== "LISTED") {
      return;
    }
    setDomain(parsedResult.hostname);
  };

  return (
    <section className="columns is-multiline is-text-centered mt-2">
      <div className="card column is-4 is-offset-4">
        <form onSubmit={onSubmit} className="has-text-centered card-content">
          <h2 className="title is-2">
            Save the domain and its password to PassManager
          </h2>
          <div className="field">
            <label className="label">Domain name</label>
            <div className="control">
              <input
                value={domain}
                onBlur={onBlur}
                onChange={(e) => setDomain(e.target.value)}
                className="input"
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Account</label>
            <div className="control">
              <input
                value={account}
                onChange={(e) => setAccount(e.target.value)}
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
                type="text"
                className="input"
              />
            </div>
          </div>
          <div className="field"></div>
          {errors}
          <button type="submit" className={`button is-primary mr-2 mt-2`}>
            Save to my collection
          </button>
        </form>
      </div>
    </section>
  );
};

SavePage.getInitialProps = async (context, client, currentUser) => {
  return {};
};
export default SavePage;
