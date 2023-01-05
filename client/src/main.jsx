import React from "react";
import { ReactDOM, createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import { StateContextProvider } from "./context";
import App from "./App";
import "./style.css";

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Goerli;

const container = document.getElementById("campaign-root");
const root = createRoot(container);
root.render(
	<React.StrictMode>
		<ThirdwebProvider desiredChainId={activeChainId}>
			<Router>
				<StateContextProvider>
					<App />
				</StateContextProvider>
			</Router>
		</ThirdwebProvider>
	</React.StrictMode>
);
