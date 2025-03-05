import { Link } from "react-router"

const NavBar = () => {
    const style = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px",
        backgroundColor: "lightgray",
    }   
    return (
        <div style={style} className="navbar"       >
            <Link to="/">Home</Link>
            <Link to="/paymentMern">Payment Merns</Link>  

        </div>
    )
}

export default NavBar;