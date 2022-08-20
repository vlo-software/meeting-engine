import Card from "../../components/Card";
import SchoolLogo from "../../components/SchoolLogo";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  useEffect(() => {
    if (sessionStorage.getItem("admin-token")) {
      router.push("/dashboard");
    }
  }, [router]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        sessionStorage.setItem("admin-token", data.jwt);
        router.push("/dashboard");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Niepoprawne dane logowania!");
      });
  };

  return (
    <>
      <div className="content">
        <SchoolLogo />
        <h1>Zaloguj się</h1>
        <div className="login-card">
          <Card>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                login();
              }}
            >
              <input
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Login"
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Hasło"
              />
              <button type="submit">Zaloguj się</button>
            </form>
          </Card>
        </div>
      </div>
      <style jsx>
        {`
          @import "styles/index.less";

          .login-card {
            input[type="text"],
            input[type="password"] {
              width: calc(100% - 80px);
              margin: 10px 20px;
              max-width: 400px;
            }
            input[type="text"] {
              margin-top: 30px;
            }
            button {
              margin-bottom: 30px;
            }
          }
        `}
      </style>
    </>
  );
}
