import {useState} from "react";
import { DataContext } from "./DataContext";

export  const DataProvider = ({ children }) => {
    const [imageUrl, setImageUrl] = useState('');
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [discount, setDiscount] = useState('');
    return(

        <DataContext.Provider 
        value={{ 
            imageUrl, setImageUrl, 
            productName, setProductName,
            productPrice, setProductPrice,
            discount, setDiscount
        }}
        >
            {children}
        </DataContext.Provider>
    )
}

export default DataProvider;
