import { useEffect, useRef, useState } from "react";

function useOpenAddForm() {
    const [isOpenAddForm, setIsOpenAddForm] = useState(false);
    const [newContent, setNewContent] = useState("");
    const contentRef = useRef(null);

    useEffect(() => {
        if (isOpenAddForm && contentRef.current) {
            contentRef.current.focus();
            contentRef.current.select();
        }
    }, [isOpenAddForm]);

    const onNewContentChange = (event) => {
        setNewContent(event.target.value);
    };

    const toggleForm = () => {
        setIsOpenAddForm(!isOpenAddForm);
    };

    const openForm = () => {
        setIsOpenAddForm(true);
    };

    const closeForm = () => {
        setIsOpenAddForm(false);
    };

    const resetForm = () => {
        setIsOpenAddForm(false);
        setNewContent("");
    };

    return {
        isOpenAddForm,
        toggleForm,
        openForm,
        closeForm,
        contentRef,
        newContent,
        onNewContentChange,
        resetForm,
    };
}

export default useOpenAddForm;
