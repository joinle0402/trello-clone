import axiosClient from "./axiosClient";

const createColumn = ({ title, boardId }) => {
    return axiosClient.post("columns/create", {
        title,
        boardId,
    });
};

const updateColumn = (columnId, columnToUpdate) => {
    return axiosClient.put(`columns/${columnId}`, { ...columnToUpdate });
};

const deleteColumnById = (columnId) => {
    return axiosClient.delete(`columns/${columnId}`);
};

const columnApi = {
    createColumn,
    deleteColumnById,
    updateColumn,
};

export default columnApi;
