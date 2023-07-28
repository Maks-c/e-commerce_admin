import Layout from "../../../components/Layout";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import axios from "axios";
import ProductForm from "../../../components/ProductForm";

export default function editProductPage(){
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [productInfo, setProductInfo] = useState(null)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter()
    const {id} = router.query


    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if( !id) return
        axios.get('/api/products?id=' + id).then(response => {
            setProductInfo(response.data)
        })
    }, [id])

    return (
        <Layout>
            <h1>Edit product</h1>
            {productInfo && (
                <ProductForm {...productInfo}/>
            )}

        </Layout>
    )
}