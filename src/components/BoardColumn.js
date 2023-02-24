import ColumnCard from "components/ColumnCard";
import { mapOrder } from "utilities/sorts";

function BoardColumn({ column }) {
    const cards = mapOrder(column.cards, column.cardOrder, "id");

    return (
        <div className="bg-blue-100 rounded w-80 min-w-[320px] max-h-full">
            <header className="flex items-center h-10 p-3 border-b border-slate-300">
                <h4 className="text-base font-bold">{column.name}</h4>
            </header>

            <ul className="max-h-[520px] overflow-auto scrollbar  p-3">
                {cards.map((card, index) => (
                    <ColumnCard key={index} card={card} />
                ))}
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
