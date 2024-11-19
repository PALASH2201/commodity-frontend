import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/crud",
    headers: {
      "Content-Type": "application/json",
    }
}); 

export const getAllCommodities = async () => {
    const response = axiosInstance.get("/getAll");
    return response;
}

export const getCommodityById = async (id) => {
    const response = axiosInstance.get(`/getById/${id}`);
    return response;
}

export const addCommodity = async (commodity) => {
    const response = axiosInstance.post("/add", commodity);
    return response;
}

export const updateCommodity = async (id,commodity) => {
    const response = axiosInstance.put(`/updateById/${id}`, commodity);
    return response;
}

export const deleteCommodity = async (id) => {
    const response = axiosInstance.delete(`/deleteById/${id}`);
    return response;
}