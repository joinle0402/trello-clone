import { useState, useEffect } from "react";
import { Container, Draggable } from "react-smooth-dnd";

import BoardColumn from "components/BoardColumn";
import database from "database/database.json";
import { mapOrder } from "utilities/sorts";
import { applyDrag } from "utilities/applyDrag";

function BoardContent() {
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        const foundBoard = database.boards.find((board) => board.id === "board-1");
        if (foundBoard) {
            setColumns(mapOrder(foundBoard.columns, foundBoard.columnOrder, "id"));
        }
    }, []);

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

    return (
        <div className="flex items-start gap-3 p-3 overflow-x-auto bg-blue-700 scrollbar overflow-y-none">
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
                        <BoardColumn key={index} column={column} onColumnCardDrog={onColumnCardDrog} />
                    </Draggable>
                ))}
            </Container>
        </div>
    );
}

export default BoardContent;
