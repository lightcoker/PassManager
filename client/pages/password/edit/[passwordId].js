import { useState } from "react";
import Router from "next/router";
import useRequest from "../../../hooks/use-request";
import { useRouter } from "next/router";
import { parseDomain, fromUrl } from "parse-domain";
import Error from "next/error";

const EditPage = ({ passwordRecord, currentUser }) => {
  if (
    !currentUser ||
    (passwordRecord.userId || passwordRecord.userid) !== currentUser.id
  ) {
    return <Error statusCode={401} />;
  }

  const router = useRouter();
  const [domain, setDomain] = useState(passwordRecord.domain);
  const [account, setAccount] = useState(passwordRecord.account);
  const [password, setPassword] = useState(passwordRecord.password);
  const { doRequest, errors } = useRequest({
    url: `/api/password/${passwordRecord.id}`,
    method: "put",
    body: {
      domain,
      account,
      password,
      updatedAt: new Date(),
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
          <h2 className="title is-2">Edit the password</h2>
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
                type="text"
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
          <div className="field">{errors}</div>

          <button type="submit" className={`button is-primary mr-2 mt-2`}>
            Commit update
          </button>
        </form>
      </div>
    </section>
  );
};

EditPage.getInitialProps = async (context, client, currentUser) => {
  const { passwordId } = context.query;
  const { data } = await client.get(`/api/query/password/${passwordId}`);
  return { passwordRecord: data };
};
export default EditPage;
