import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { publicRoutes } from "../routes";  // Завантажуємо маршрути
import { ORDERS_ROUTE } from "../utils/consts";

const AppRouter = () => {
  console.log(publicRoutes);  // Лог для перевірки маршрутів
  
  return (
    <Routes>
      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
      {/* Перенаправлення на ORDERS_ROUTE за замовчуванням */}
      <Route path="*" element={<Navigate to={ORDERS_ROUTE} />} />
    </Routes>
  );
};

export default AppRouter;