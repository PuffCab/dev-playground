import { Link, useParams } from "react-router";

const CancelPage = () => {
    const { session_id } = useParams();
        console.log(session_id);
    return (
        <div>
            <h1>Cancel</h1>
            <p>Your payment was cancelled.</p>
            <p>If you have any questions, please contact us.</p>
            <Link to="/paymentMern">Back to payment</Link>
            <Link to="/">Back to home</Link>
        </div>
    )
}   

export default CancelPage;