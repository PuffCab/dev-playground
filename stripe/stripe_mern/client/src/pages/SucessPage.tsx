import { Link, useParams    } from "react-router";

const SuccessPage = () => {
    const { session_id } = useParams();
    console.log(session_id);
    return (
        <div>
            <h1>Success</h1>
            <p>Thank you for your purchase!</p>
            <p>Your order will be shipped soon.</p>
            <p>If you have any questions, please contact us.</p>    
            <Link to="/paymentMern">Back to payment</Link>
            <Link to="/">Back to home</Link>
        </div>
    )
}   

export default SuccessPage;