import axiosClient from "./axiosClient";

const createCard = ({ title, columnId }) => {
    return axiosClient.post("cards/create", {
        title,
        columnId,
    });
};

const updateCard = (cardToUpdate) => {
    return axiosClient.put(`cards/${cardToUpdate._id}`, {
        ...cardToUpdate,
    });
};

const cardApi = {
    createCard,
    updateCard,
};

export default cardApi;
