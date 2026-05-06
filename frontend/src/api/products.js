import api from "./axiosConfig";
import { useEffect, useState } from "react";


export const getProducts = async () => {
    const { data } = await api.get("/products");
    return data;
};

export const getProduct = async (id) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
};

export const updateProduct = async (id, updateData) => {
    const { data } = await api.put(`/products/${id}`, updateData);
    return data;
};