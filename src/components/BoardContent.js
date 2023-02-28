import { useState, useEffect, useRef } from "react";
import { Container, Draggable } from "react-smooth-dnd";

import BoardColumn from "components/BoardColumn";
import database from "database/database.json";
import { mapOrder } from "utilities/sorts";
import { applyDrag } from "utilities/applyDrag";

function BoardContent() {
    const [columns, setColumns] = useState([]);
    const [isOpenNewColumn, setIsOpenNewColumn] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState("");
    const inputNewColumnRef = useRef();

    useEffect(() => {
        const foundBoard = database.boards.find((board) => board.id === "board-1");
        if (foundBoard) {
            setColumns(mapOrder(foundBoard.columns, foundBoard.columnOrder, "id"));
        }
    }, []);

    useEffect(() => {
        if (isOpenNewColumn && inputNewColumnRef.current) {
            inputNewColumnRef.current.focus();
            inputNewColumnRef.current.select();
        }
    }, [isOpenNewColumn]);

    const toggleOpenNewColumn = () => setIsOpenNewColumn(!isOpenNewColumn);

    const onBoardColumnDrog = (dropResult) => {
        const copyColumns = [...columns];
        const newColumns = applyDrag(copyColumns, dropResult);
        setColumns(newColumns);
    };

    const onColumnCardDrog = (columnId, dropResult) => {
        if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
            const newColumns = [...columns];
            const currentColumn = newColumns.find((item) => item.id === columnId);
            currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
            currentColumn.cardOrder = currentColumn.cards.map((item) => item.id);
            setColumns(newColumns);
        }
    };

    const createNewColumn = () => {
        if (newColumnTitle) {
            const newColumn = {
                id: Date.now(),
                name: newColumnTitle,
                cards: [],
                cardOrder: [],
            };
            setColumns([...columns, newColumn]);
            setNewColumnTitle("");
            setIsOpenNewColumn(false);
        }
    };

    const deleteBoardColumn = (columnId) => {
        const newColumns = [...columns];
        const deletedIndex = newColumns.findIndex((item) => item.id === columnId);
        newColumns.splice(deletedIndex, 1);
        setColumns(newColumns);
    };

    const handleUpdateColumnName = ({ columnName, columnId }) => {
        const updatedColumns = [...columns];
        const columnIndexToUpdate = updatedColumns.findIndex((item) => item.id === columnId);
        const newColumnToUpdate = {
            ...updatedColumns[columnIndexToUpdate],
            name: columnName,
        };
        updatedColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate);
        setColumns(updatedColumns);
        console.log(`BoardContent.handleUpdateColumnName: `, {
            columnName,
            columnId,
            columnIndexToUpdate,
            newColumnToUpdate,
        });
    };

    return (
        <div className="flex items-start gap-3 p-3 overflow-x-auto overflow-y-hidden bg-blue-700 scrollbar">
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
                            deleteBoardColumn={deleteBoardColumn}
                            onUpdateColumnName={handleUpdateColumnName}
                        />
                    </Draggable>
                ))}
            </Container>
            {!isOpenNewColumn ? (
                <div
                    className="bg-blue-600 hover:bg-blue-500 cursor-pointer text-white rounded w-80 min-w-[320px] max-h-full board-column h-10 flex items-center gap-1 px-3 ml-1"
                    onClick={toggleOpenNewColumn}
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
                    <span>Thêm danh sách khác</span>
                </div>
            ) : (
                <div className="bg-blue-100 rounded w-80 min-w-[320px] max-h-full board-column ml-1">
                    <div className="px-2 py-1">
                        <input
                            type="text"
                            id="first_name"
                            className="block w-full p-2 text-sm text-gray-900 border border-gray-400 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Board content title"
                            ref={inputNewColumnRef}
                            value={newColumnTitle}
                            onChange={(e) => setNewColumnTitle(e.target.value)}
                            onKeyDown={(keyEvent) => keyEvent.key === "Enter" && createNewColumn()}
                            required
                        />
                    </div>
                    <div className="flex items-center gap-3 px-2 py-1">
                        <button
                            type="button"
                            className="px-2 py-2 text-sm font-medium text-white bg-blue-700 rounded hover:bg-blue-800"
                            onClick={createNewColumn}
                        >
                            Thêm danh sách
                        </button>

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6 cursor-pointer"
                            onClick={toggleOpenNewColumn}
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
