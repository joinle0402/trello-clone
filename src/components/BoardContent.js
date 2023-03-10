import { useState, useEffect } from "react";
import { Container, Draggable } from "react-smooth-dnd";
import BoardColumn from "components/BoardColumn";
import { mapOrder } from "utilities/sorts";
import { applyDrag } from "utilities/applyDrag";
import useOpenAddForm from "hooks/useOpenAddForm";
import boardApi from "apis/boardApi";
import columnApi from "apis/columnApi";
import { toast } from "react-toastify";
import { cloneDeep } from "lodash";
import cardApi from "apis/cardApi";

let boardId = "";

function BoardContent() {
    const [columnsOrder, setColumnsOrder] = useState([]);
    const [columns, setColumns] = useState([]);
    const { isOpenAddForm, openForm, closeForm, contentRef, newContent, onNewContentChange, resetForm } =
        useOpenAddForm();

    useEffect(() => {
        async function fetchBoardList() {
            const { boards } = await boardApi.fetchBoardList();
            if (boards[0]) {
                boardId = boards[0]._id;
                setColumnsOrder(boards[0].columnOrder);
                setColumns(mapOrder(boards[0].columns, boards[0].columnOrder, "_id"));
            } else {
                const { createdBoard } = await boardApi.createNewBoard({
                    title: "Board 1",
                });
                boardId = createdBoard._id;
            }
        }
        fetchBoardList();
    }, []);

    const onBoardColumnDrog = (dropResult) => {
        if (dropResult.addedIndex !== dropResult.removedIndex) {
            const cloneColumns = cloneDeep(columns);
            const cloneColumnOrder = cloneDeep(columnsOrder);
            const newColumns = applyDrag(cloneColumns, dropResult);
            const newColumnOrder = applyDrag(cloneColumnOrder, dropResult);
            boardApi
                .updateBoard({
                    _id: boardId,
                    newColumnOrder,
                })
                .then(({ message }) => {
                    toast.success(message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                    setColumns(newColumns);
                })
                .catch((error) => {});
        }
    };

    const onColumnCardDrog = (columnId, dropResult) => {
        if (
            (dropResult.removedIndex !== null || dropResult.addedIndex !== null) &&
            dropResult.addedIndex !== dropResult.removedIndex
        ) {
            if (dropResult.addedIndex !== dropResult.removedIndex) {
                const newColumns = [...columns];
                const currentColumn = newColumns.find((item) => item._id === columnId);
                currentColumn.cards = applyDrag([...currentColumn.cards], dropResult);

                if (dropResult.addedIndex != null) {
                    const currentCard = currentColumn.cards.find((item) => item._id === dropResult.payload._id);
                    currentCard.column = currentColumn._id;
                }

                currentColumn.cardOrder = currentColumn.cards.map((card) => card._id);
                setColumns(newColumns);

                if (dropResult.removedIndex != null && dropResult.addedIndex != null) {
                    columnApi
                        .updateColumn(columnId, {
                            cardOrder: currentColumn.cardOrder,
                            cards: currentColumn.cardOrder,
                        })
                        .catch((error) => {
                            setColumns(columns);
                        });
                } else {
                    columnApi
                        .updateColumn(columnId, {
                            cardOrder: currentColumn.cardOrder,
                            cards: currentColumn.cardOrder,
                        })
                        .catch((error) => {
                            setColumns(columns);
                        });

                    if (dropResult.addedIndex !== null) {
                        const cardToUpdate = { ...dropResult.payload };
                        cardApi
                            .updateCard(cardToUpdate._id, {
                                column: currentColumn._id,
                            })
                            .catch((error) => {
                                setColumns(columns);
                            });
                    }
                }
            }
        }
    };

    const handleUpdateColumn = (columnId, columnToUpdate) => {
        columnApi
            .updateColumn(columnId, {
                ...columnToUpdate,
            })
            .then(({ message, updatedColumn }) => {
                toast.success(message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                const updatedColumns = [...columns];
                const columnIndexToUpdate = updatedColumns.findIndex((item) => item._id === columnId);
                updatedColumns.splice(columnIndexToUpdate, 1, updatedColumn);
                setColumns(updatedColumns);
            })
            .catch((error) => {});
    };

    const handleDeleteColumn = async (columnId) => {
        columnApi
            .deleteColumnById(columnId)
            .then(({ message }) => {
                toast.success(message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                const newColumns = [...columns];
                const deletedIndex = newColumns.findIndex((item) => item._id === columnId);
                newColumns.splice(deletedIndex, 1);
                setColumns(newColumns);
            })
            .catch((error) => {});
    };

    const handleCreateColumn = () => {
        if (newContent !== "") {
            columnApi
                .createColumn({
                    title: newContent,
                    boardId,
                })
                .then(({ message, createdColumn }) => {
                    toast.success(message, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                    setColumns([...columns, { ...createdColumn }]);
                    setColumnsOrder([...columnsOrder, createdColumn._id]);
                    resetForm();
                })
                .catch((error) => {});
        }
    };

    const handleCreateCard = ({ createdCard, updatedColumn }) => {
        const newColumns = [...columns];
        const columnIndexToUpdate = newColumns.findIndex((item) => item._id === updatedColumn._id);
        const columnToUpdate = newColumns[columnIndexToUpdate];
        columnToUpdate.cards = [...columnToUpdate.cards, { ...createdCard }];
        columnToUpdate.cardOrder = [...columnToUpdate.cardOrder, createdCard._id];
        newColumns.splice(columnIndexToUpdate, 1, columnToUpdate);
        setColumns(newColumns);
    };

    return (
        <div className="flex items-start px-3 py-2 overflow-x-auto overflow-y-hidden bg-blue-700 scrollbar">
            {columns.length > 0 && (
                <div className="mr-3">
                    <Container
                        orientation="horizontal"
                        onDrop={onBoardColumnDrog}
                        getChildPayload={(index) => columns[index]}
                        dragHandleSelector="#board-column-drag-handle"
                        dropPlaceholder={{
                            animationDuration: 150,
                            showOnTop: true,
                            className: "board-column-drop-preview",
                        }}
                    >
                        {columns.map((column, index) => (
                            <Draggable key={index} className="pl-3 first:pl-0">
                                <BoardColumn
                                    key={index}
                                    column={column}
                                    onColumnCardDrog={onColumnCardDrog}
                                    onDeleteColumn={handleDeleteColumn}
                                    onUpdateColumn={handleUpdateColumn}
                                    onCreateCard={handleCreateCard}
                                />
                            </Draggable>
                        ))}
                    </Container>
                </div>
            )}

            {!isOpenAddForm ? (
                <div
                    className="bg-blue-600 hover:bg-blue-500 transition-all duration-300 cursor-pointer text-white rounded w-80 min-w-[320px] max-h-full h-10 flex items-center gap-1 px-3"
                    onClick={openForm}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span>Th??m danh s??ch kh??c</span>
                </div>
            ) : (
                <div className="bg-blue-100 rounded w-80 min-w-[320px] max-h-full board-column ml-1">
                    <div className="px-2 py-1">
                        <input
                            type="text"
                            id="first_name"
                            className="block w-full p-2 text-sm text-gray-900 border border-gray-400 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Board content title"
                            ref={contentRef}
                            value={newContent}
                            onChange={onNewContentChange}
                            onKeyDown={(event) => event.key === "Enter" && handleCreateColumn()}
                            required
                        />
                    </div>
                    <div className="flex items-center gap-3 px-2 py-1">
                        <button
                            type="button"
                            className="px-2 py-2 text-sm font-medium text-white bg-blue-700 rounded hover:bg-blue-800"
                            onClick={handleCreateColumn}
                        >
                            Th??m danh s??ch
                        </button>

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6 cursor-pointer"
                            onClick={closeForm}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BoardContent;
