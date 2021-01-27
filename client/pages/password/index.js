import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";

const PasswordsPage = ({ currentUser, passwords }) => {
  // user validation
  if (!currentUser) {
    return <Error statusCode={401} />;
  }

  // Return empty template for users with no passwords saved in database
  if (passwords.length === 0) {
    return (
      <section>
        <div className="columns is-multiline is-text-centered mt-2 has-text-centered">
          <div className="card my-1 column is-8 is-offset-2">
            <div className="card-content">
              <div className="content">
                <p className="title is-3">
                  There is 0 password saved in PassManager.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const router = useRouter();

  const onDelete = async (id, domain) => {
    if (!confirm(`Delete password for ${domain}?`)) {
      return;
    }
    try {
      await axios.delete(`/api/password/${id}`);
      alert("Deletion succeeded.");
    } catch (error) {
      alert("Deletion failed. Please try again later.");
    }
    router.reload();
  };

  const passwordCards = passwords.map((passwordRecord) => {
    const { id, domain, password, updatedat, updatedAt } = passwordRecord;
    return (
      <div key={id} className="card my-1 column is-8 is-offset-2">
        <div className="card-content">
          <div className="content">
            <ul>
              <li>
                <strong>Domain: </strong> {domain}
              </li>
              <li>
                <strong>Password: </strong> {password}
              </li>
              <li>
                <strong>Updated at: </strong>{" "}
                {new Date(updatedat || updatedAt).toLocaleString()}
              </li>
            </ul>
          </div>
        </div>
        <footer className="card-footer">
          <p className="card-footer-item">
            <span>
              <Link href={`/password/edit/${id}`}>
                <button className="button is-primary">Edit the password</button>
              </Link>
            </span>
          </p>
          <p className="card-footer-item">
            <span>
              <button
                className="button is-danger"
                onClick={() => onDelete(id, domain)}
              >
                Delete the password
              </button>
            </span>
          </p>
        </footer>
      </div>
    );
  });

  return (
    <section>
      <div className="columns is-multiline is-text-centered mt-2">
        {passwordCards}
      </div>
    </section>
  );
};

PasswordsPage.getInitialProps = async (context, client, currentUser) => {
  if (!currentUser) {
    return { passwords: [] };
  }

  const { data } = await client.get(`/api/query/passwords/`);
  return { passwords: data };
};

export default PasswordsPage;
