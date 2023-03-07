import { cloneDeep } from "lodash";
import axiosClient from "./axiosClient";

const fetchBoardList = () => {
    return axiosClient.get("boards");
};

const fetchBoardById = (id) => {
    return axiosClient.get(`boards/${id}`);
};

const createNewBoard = ({ title }) => {
    return axiosClient.post(`boards/create`, {
        title,
    });
};

const updateBoard = (boardToUpdate) => {
    return axiosClient.put(`boards/${boardToUpdate._id}`, {
        columnOrder: [...boardToUpdate.newColumnOrder],
    });
};

const boardApi = {
    fetchBoardById,
    fetchBoardList,
    updateBoard,
    createNewBoard
};

export default boardApi;
