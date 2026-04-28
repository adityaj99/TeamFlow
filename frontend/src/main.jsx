import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ModalProvider } from "./context/ModalContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { setQueryClient } from "./api/axios.js";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 min cache
      refetchOnWindowFocus: false, // stop refetch spam
      refetchOnMount: false,
      retry: 1, // avoid repeated retries
    },
  },
});

setQueryClient(queryClient);

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <App />
      </ModalProvider>
    </QueryClientProvider>
  </BrowserRouter>,
);
