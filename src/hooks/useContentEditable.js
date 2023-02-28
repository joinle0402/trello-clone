import { useState, useLayoutEffect } from "react";

function useContentEditable({ initialContent }) {
    const [content, setContent] = useState("");

    useLayoutEffect(() => {
        setContent(initialContent);
    }, [initialContent]);

    const onContentEditableChange = (event) => {
        setContent(event.target.value);
    };

    const onContentEditableClick = (event) => {
        event.target.focus();
        event.target.select();
    };

    const onContentEditableKeyDown = (event) => {
        if (event.key === "Enter") {
            event.target.blur();
        }
    };

    const onContentEditableMouseDown = (event) => {
        event.preventDefault();
    }

    return {
        content,
        onContentEditableChange,
        onContentEditableClick,
        onContentEditableKeyDown,
        onContentEditableMouseDown,
    };
}

export default useContentEditable;
