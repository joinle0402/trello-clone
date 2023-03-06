import { cloneDeep } from "lodash";
import axiosClient from "./axiosClient";

const fetchBoardList = () => {
    return axiosClient.get("boards");
};

const fetchBoardById = (id) => {
    return axiosClient.get(`boards/${id}`);
};

const updateBoard = (boardToUpdate) => {
    return axiosClient.put(`boards/${boardToUpdate._id}`, {
        columnOrder: cloneDeep(boardToUpdate.newColumnOrder),
    });
};

const boardApi = {
    fetchBoardById,
    fetchBoardList,
    updateBoard,
};

export default boardApi;
