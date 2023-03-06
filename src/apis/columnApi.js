import axiosClient from "./axiosClient";

const createColumn = ({ title, boardId }) => {
    return axiosClient.post("columns/create", {
        title,
        boardId,
    });
};

const updateColumn = (columnToUpdate) => {
    return axiosClient.put(`columns/${columnToUpdate._id}`, {
        ...columnToUpdate,
    });
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
