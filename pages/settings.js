import Layout from "../components/Layout";
import {useEffect, useState} from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import {withSwal} from "react-sweetalert2";

function SettingPage({swal}){
    const [products, setProducts] = useState([])
    const [featuredProductId, setFeaturedProductId] = useState('')
    const [productsLoading, setProductsLoading] = useState(false)
    const [featuredLoading, setFeaturedLoading] = useState(false)


    useEffect(() => {
        setProductsLoading(true)
        axios.get('/api/products').then(res => {
            setProducts(res.data)
            setProductsLoading(false)
        })
        setFeaturedLoading(true)
        axios.get('/api/setting?name=featuredProductId').then(res => {
            setFeaturedProductId(res.data.value)
            setFeaturedLoading(false)
        })
    }, [])

    async function saveSettings(){
        await axios.put('/api/setting', {
            name: 'featuredProductId',
            value: featuredProductId
        }).then(()=>{
            swal.fire({
                title:'Setting saved',
                icon:'success'
            })
        })
    }

    return (
        <Layout>
            <h1>Settings</h1>
            {(productsLoading || featuredLoading) && (
                <Spinner/>
            )}

            {( !productsLoading && !featuredLoading) && (
                <>
                    <label>Featured product</label>
                    <select value={featuredProductId} onChange={ev => setFeaturedProductId(ev.target.value)}>
                        {products.length > 0 && products.map(product => (
                            // eslint-disable-next-line react/jsx-key
                            <option key={product._id} value={product._id}>
                                {product.title}
                            </option>
                        ))}
                    </select>
                    <div>
                        <button onClick={saveSettings} className={'btn-primary'}>Save settings</button>
                    </div>
                </>
            )}
        </Layout>
    )
}

export default withSwal(({swal}) => (
    <SettingPage swal={swal}/>
))
