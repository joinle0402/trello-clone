function ColumnCard({ card }) {
    return (
        <li className="p-2 mt-2 bg-white rounded shadow-md first:mt-0">
            {!!card.thumbnail && <img src={card.thumbnail} alt="" className="mb-2" />}
            {card.title}
        </li>
    );
}

export default ColumnCard;
