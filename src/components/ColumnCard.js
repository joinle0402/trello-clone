function ColumnCard({ card }) {
    return (
        <li className="p-2 mt-2 bg-white rounded shadow-md cursor-pointer first:mt-0 column-card-drag-handle">
            {!!card.thumbnail && (
                <img src={card.thumbnail} alt="" className="mb-2" onMouseDown={(event) => event.preventDefault()} />
            )}
            {card.title}
        </li>
    );
}

export default ColumnCard;
