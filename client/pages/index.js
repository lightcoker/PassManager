import Link from "next/link";
import { useState } from "react";
import useRequest from "../hooks/use-request";
import { CopyToClipboard } from "react-copy-to-clipboard";

const LandingPage = ({ currentUser }) => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(32);

  const [isLoading, setIsLoading] = useState("not-loading");
  const passwordMaxLength = 64;
  const getOptions = function () {
    const numbers = [];
    for (let i = 6; i <= passwordMaxLength; i++) {
      numbers.push(i);
    }
    return numbers.map((number) => {
      return <option key={number}>{number}</option>;
    });
  };

  const { doRequest, newErrors } = useRequest({
    url: "/api/password",
    method: "post",
    body: { length: parseInt(length) },
    onSuccess: (res) => {
      setPassword(res.password);
      setIsLoading("not-loading");
    },
  });

  const onNewPassword = async (event) => {
    event.preventDefault();
    setIsLoading("is-loading");
    await doRequest();
  };

  // Switch what to display according to user log in or not
  const noteForUsers = () => {
    const noteForRegisteredUser = (
      <div>
        Click{" "}
        <strong className="is-size-4">
          <Link href={{ pathname: "/password/save", query: { password } }}>
            here
          </Link>{" "}
        </strong>
        to save the result to your password collection.
      </div>
    );
    const noteForNotRegisteredUser = (
      <div>
        <strong className="is-size-4">
          <Link href={{ pathname: "/auth/signin" }}>Sign in</Link>{" "}
        </strong>
        to save the result to your password collection.
      </div>
    );
    return !!currentUser ? noteForRegisteredUser : noteForNotRegisteredUser;
  };

  return (
    <div className="container mt-2 has-text-centered">
      <section id="headlines">
        <div className="has-text-primary-dark has-text-weight-semibold">
          Password Manager Web Application
        </div>
        <div className="title is-2 is-hidden-mobile">
          Create/Save your passwords here <br /> and access them everywhere!
        </div>
        <div className="title is-2 is-hidden-tablet">Password Manager</div>
        <div className="subtitle is-5">
          Generate a strong password below and click the button below to store
          it.
        </div>
        <hr />
      </section>
      <section id="input" className="columns is-centered">
        <form id="form-first-row" className="column">
          <div className="field has-addons">
            <div className="control is-expanded">
              <input
                className="input ml-3 mr-1 mt-2"
                type="text"
                placeholder="Text input"
                value={password}
                placeholder="Random Password"
              />
            </div>
            <div className="control">
              <CopyToClipboard text={password} onCopy={(e) => e.preventDefault}>
                <button className="button ml-1 mr-2 mt-2" type="button">
                  💾
                </button>
              </CopyToClipboard>
            </div>
          </div>
          <br />
          <div className="field has-addons">
            <p className="control is-expanded">
              <div className="select ml-3 mt-2">
                <select
                  id="select-length"
                  defaultValue="Select length"
                  onChange={(e) => {
                    setLength(e.target.value);
                  }}
                >
                  <option disabled className="is-unselectable">
                    Select length
                  </option>
                  {getOptions()}
                </select>
              </div>
              <button
                id="random-gen-btn"
                type="submit"
                className={`button is-primary ${isLoading} mr-3 mt-2 is-hidden-mobile`}
                onClick={onNewPassword}
              >
                Generate Random Password
              </button>
              <button
                id="random-gen-btn"
                type="submit"
                className={`button is-primary ${isLoading} mr-3 mt-2 is-hidden-tablet`}
                onClick={onNewPassword}
              >
                Generate
              </button>
            </p>
          </div>
        </form>
        <br />
      </section>
      <section id="note">{noteForUsers()}</section>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  return {};
};

export default LandingPage;
