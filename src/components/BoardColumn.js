import { Container, Draggable } from "react-smooth-dnd";

import ColumnCard from "components/ColumnCard";
import { mapOrder } from "utilities/sorts";

function BoardColumn({ column, onColumnCardDrog }) {
    const cards = mapOrder(column.cards, column.cardOrder, "id");

    return (
        <div className="bg-blue-100 rounded w-80 min-w-[320px] max-h-full board-column">
            <header
                className="flex items-center h-10 p-3 border-b cursor-pointer border-slate-300"
                id="board-column-drag-handle"
            >
                <h4 className="text-base font-bold">{column.name}</h4>
            </header>

            <ul className="max-h-[520px] overflow-auto scrollbar  p-3">
                <Container
                    {...column.props}
                    groupName="board-column"
                    onDrop={(dropResult) => onColumnCardDrog(column.id, dropResult)}
                    getChildPayload={(index) => cards[index]}
                    dragClass="column-card-ghost"
                    dropClass="column-card-ghost-drop"
                    dragHandleSelector=".column-card-drag-handle"
                    dropPlaceholder={{
                        animationDuration: 150,
                        showOnTop: true,
                        className: "column-card-drop-preview",
                    }}
                    dropPlaceholderAnimationDuration={200}
                >
                    {cards.map((card, index) => (
                        <Draggable key={card.id} className="mt-2 first:mt-0">
                            <ColumnCard key={index} card={card} />
                        </Draggable>
                    ))}
                </Container>
            </ul>

            <footer className="flex items-center h-10 p-3 border-t border-slate-300">
                <button className="w-full px-4 py-1 text-base font-bold text-white bg-blue-700 rounded">
                    Add Item...
                </button>
            </footer>
        </div>
    );
}

export default BoardColumn;
