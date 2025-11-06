import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, createRoutesFromElements, Route,RouterProvider,} from "react-router-dom";
import initMockData from "./Page/utils/initMockData";

//  Khởi tạo dữ liệu giả (nếu chưa có trong localStorage)
initMockData();

// Cấu hình router (điều hướng toàn bộ về App)
const router = createBrowserRouter(
  createRoutesFromElements(<Route path="*" element={<App />} />),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

// Render ứng dụng React
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();

