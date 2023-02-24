import { useState, useEffect } from "react";
import BoardColumn from "components/BoardColumn";
import database from "database/database.json";
import { mapOrder } from "utilities/sorts";

function BoardContent() {
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        const foundBoard = database.boards.find((board) => board.id === "board-1");
        if (foundBoard) {
            setColumns(mapOrder(foundBoard.columns, foundBoard.columnOrder, "id"));
        }
    }, []);

    return (
        <div className="flex items-start gap-3 p-3 overflow-x-auto bg-blue-700 scrollbar overflow-y-none">
            {columns.map((column, index) => (
                <BoardColumn key={index} column={column} />
            ))}
        </div>
    );
}

export default BoardContent;
