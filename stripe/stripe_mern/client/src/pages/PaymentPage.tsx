
const PaymentPage = () => {
    const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const options = {       
            method: "POST",
            body: JSON.stringify({
               items: [
                {
                    id: 1,
                    quantity: 1,
                    },
                    {
                        id: 2,
                        quantity: 2,
                    },
             
               ],
            }),
        }
        try{
        const response = await fetch("http://localhost:5000/api/payments/create-payment-intent", options);
       
       if(response.ok){ 
        const responseData = await response.json();
        console.log("responseData", responseData);
       }else{
        console.log("response not ok");
       }
        }catch(error){
            console.log("Error", error);
        }
    }
    
    return (
        <div>
            <h2>Payment Page</h2>
            <form onSubmit={handlePayment}> 
               

                <button type="submit">Pay Now</button>
            </form>
        </div>
    )
    
}
            export default PaymentPage; 