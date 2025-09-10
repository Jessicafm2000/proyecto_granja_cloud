import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
import {
  Authenticator,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(awsExports);

// Opcional: theme personalizado
const formTheme = {
  name: "custom-theme",
  tokens: {
    components: {
      authenticator: {
        router: {
          boxShadow: "0px 4px 20px rgba(0,0,0,0.15)",
          borderRadius: "16px",
          padding: "2rem",
        },
      },
      button: {
        primary: {
          backgroundColor: { value: "#151870" },
          _hover: { backgroundColor: { value: "#2f2fd8" } },
        },
      },
    },
  },
};

createRoot(document.getElementById("root")).render(
  <Authenticator
    theme={formTheme}
    components={{
      Header() {
        return (
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <img
              src="https://d2trfafuwnq9hu.cloudfront.net/logo/granjacloud.png"
              alt="GranjaCloud"
              style={{ width: "200px", marginBottom: "10px" }}
            />
            <h2 style={{ fontFamily: "Outfit, sans-serif", color: "#151870" }}>
              Bienvenido a GranjaCloud
            </h2>
          </div>
        );
      },
      Footer() {
        return (
          <p
            style={{
              fontSize: "0.85rem",
              textAlign: "center",
              marginTop: "1rem",
              color: "#666",
            }}
          >
            © 2025 GranjaCloud 🌱
          </p>
        );
      },
    }}
  >
    {({ signOut, user }) => <App signOut={signOut} user={user} />}
  </Authenticator>
);
