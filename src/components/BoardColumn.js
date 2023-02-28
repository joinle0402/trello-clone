import { Container, Draggable } from "react-smooth-dnd";
import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";

import ColumnCard from "components/ColumnCard";
import { mapOrder } from "utilities/sorts";
import { classNames } from "utilities/classNames";
import Modal from "./Modal";

function BoardColumn({ column, onColumnCardDrog, deleteBoardColumn }) {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const cards = mapOrder(column.cards, column.cardOrder, "id");

    const handleButtonDeleteClick = () => {
        if (deleteBoardColumn) {
            deleteBoardColumn(column.id);
        }
        setIsOpenModal(false);
    };

    return (
        <Fragment>
            <div className="bg-blue-100 rounded w-80 min-w-[320px] max-h-full board-column">
                <header
                    className="flex items-center h-10 gap-1 p-2 border-b cursor-pointer border-slate-300"
                    id="board-column-drag-handle"
                >
                    <input
                        type="text"
                        id="first_name"
                        value={column.name}
                        onChange={() => console.log(column.name)}
                        className="flex-1 p-1 text-sm font-semibold text-gray-900 border rounded bg-inherit focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                    <Menu as="div" className="relative inline-block text-left">
                        <div>
                            <Menu.Button className="inline-flex justify-center w-full px-1 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                    />
                                </svg>
                            </Menu.Button>
                        </div>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <span
                                                onClick={() => setIsOpenModal(true)}
                                                className={classNames(
                                                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                                    "block px-4 py-2 text-sm"
                                                )}
                                            >
                                                Delete Column
                                            </span>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <span
                                                href="#"
                                                className={classNames(
                                                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                                    "block px-4 py-2 text-sm"
                                                )}
                                            >
                                                Support
                                            </span>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <span
                                                href="#"
                                                className={classNames(
                                                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                                    "block px-4 py-2 text-sm"
                                                )}
                                            >
                                                License
                                            </span>
                                        )}
                                    </Menu.Item>
                                    <form method="POST" action="#">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    type="submit"
                                                    className={classNames(
                                                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                                                        "block w-full px-4 py-2 text-left text-sm"
                                                    )}
                                                >
                                                    Sign out
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </form>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </header>
                {cards.length > 0 && (
                    <ul className="max-h-[520px] overflow-auto scrollbar p-3">
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
                )}

                <footer className="flex items-center h-10 p-3 border-t border-slate-300">
                    <button className="w-full px-4 py-1 text-base font-bold text-white bg-blue-700 rounded">
                        Add Item...
                    </button>
                </footer>
                <Modal
                    title={`Delete board column modal`}
                    description={`Are you sure you want to delete this board column? (${column.id})`}
                    isOpen={isOpenModal}
                    setIsOpen={setIsOpenModal}
                    onButtonDeleteClick={handleButtonDeleteClick}
                />
            </div>
        </Fragment>
    );
}

export default BoardColumn;
