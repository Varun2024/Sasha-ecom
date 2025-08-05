import React, {  useState } from 'react';
import DataContext from './Context';


export const DataProvider = ({ children }) => {
    const [productData, setProductData] = useState({
        id: '',
        name: '',
        category: '',
        price: 0,
        rating: 0,
        reviewCount: 0,
        imageUrl: '',
    });
    return (

        <DataContext.Provider
            value={{
                productData,
                setProductData,
            }}
        >
            {children}
        </DataContext.Provider>
    )
}

export default DataProvider;
