import AppBar from "components/AppBar";
import BoardBar from "components/BoardBar";
import BoardContent from "components/BoardContent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    return (
        <div className="h-screen w-full grid grid-rows-[50px_40px_1fr] bg-blue-700 font-['Roboto'] text-sm">
            <AppBar />
            <BoardBar />
            <BoardContent />
            <ToastContainer />
        </div>
    );
}

export default App;
