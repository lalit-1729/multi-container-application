import { React } from "react";
import { Link } from "react-router-dom";

export default function OtherPage() {
    return (
        <div>
            This is just a other Page
            <Link to="/">Go Back Home</Link>
        </div>
    );
}