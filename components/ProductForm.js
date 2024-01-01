import {useRouter} from "next/router";
import axios from "axios";
import {useEffect, useState} from "react";
import {ReactSortable} from 'react-sortablejs'
import Spinner from "./Spinner";


export default function ProductForm({
                                        _id,
                                        title: existingTitle,
                                        description: existingDescription,
                                        price: existingPrice,
                                        images: existingImage,
                                        category: assignedCategory,
                                        properties: assignedProperties
                                    }){
    const [title, setTitle] = useState(existingTitle || '')
    const [images, setImages] = useState(existingImage || []);
    const [description, setDescription] = useState(existingDescription || '')
    const [category, setCategory] = useState(assignedCategory || '')
    const [productProperties, setProductProperties] = useState(assignedProperties || {})
    const [price, setPrice] = useState(existingPrice || '')
    const [goToProducts, setGoToProducts] = useState(false)
    const [isUploading, setIsUploading] = useState(false);
    const [categories, setCategories] = useState([])
    const [categoriesLoading, setCategoriesLoading] = useState(false)

    const router = useRouter()

    useEffect(() => {
        setCategoriesLoading(true)
        axios.get('/api/categories').then(result => {
            setCategories(result.data)
            setCategoriesLoading(false)
        })
    }, [])

    async function saveProduct(ev){
        ev.preventDefault()
        const data = {title, description, price, images, category, properties: productProperties};
        try{
            if(_id) {
                //update
                await axios.put('/api/products', {...data, _id})
            } else {
                //create
                await axios.post('/api/products', data)
            }
            setGoToProducts(true)
        } catch (e){
            console.log(e)
        }

    }

    if(goToProducts) {
        router.push('/products').then(r => {
            console.log(r)
        })
    }

    async function uploadImages(ev){
        const files = ev.target?.files;

        if(files?.length > 0) {
            setIsUploading(true);
            const data = new FormData();
            const links = []
            for (const file of files) {
                data.append('file', file);
            }
            data.append('upload_preset', 'max_fiverr')
            const res = await axios.post('https://api.cloudinary.com/v1_1/dvr6unyvv/image/upload', data);
            const {url} = res.data
            links.push(url)
            setImages(oldImages => {
                return [...oldImages, ...links];
            });
            setIsUploading(false);
        }
    }

    function updateImagesOrder(images){
        setImages(images)
    }

    const propertiesToFill = []
    if(categories.length > 0 && category) {
        let catInfo = categories.find(({_id}) => _id === category)
        if(catInfo) {
            propertiesToFill.push(...catInfo.properties)
        }
        while (catInfo?.parent?._id){
            const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id)
            propertiesToFill.push(...parentCat.properties);
            catInfo = parentCat
        }
    }

    function setProductProp(propName, value){
        setProductProperties(prev => {
            const newProductProps = {...prev}
            newProductProps[propName] = value
            return newProductProps
        })
    }

    return (
        <form onSubmit={saveProduct}>
            <label>Product name</label>
            <input
                type="text"
                placeholder='product name'
                value={title}
                onChange={ev => setTitle(ev.target.value)}
            />
            <label>Category</label>
            <select value={category} onChange={ev => setCategory(ev.target.value)}>
                <option value=''>Uncategorized</option>
                {categories.length > 0 && categories.map((c, index) => (
                    // eslint-disable-next-line react/jsx-key
                    <option value={c._id} key={index}>{c.name}</option>
                ))}
            </select>
            {categoriesLoading && (
                <div className={'py-4'}>
                    <Spinner fullWidth={true}/>
                </div>
            )}
            {propertiesToFill.length > 0 && propertiesToFill.map(p => (
                <div key={p.name} className={''}>
                    <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
                    <div>
                        <select value={productProperties[p.name]} onChange={ev =>
                            setProductProp(p.name, ev.target.value)}>
                            {p.values.map(v => (
                                // eslint-disable-next-line react/jsx-key
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}
            <label>Photos</label>
            <div className={'mb-2 flex flex-wrap gap-1'}>
                <ReactSortable list={images} setList={updateImagesOrder} className={"flex  flex-wrap gap-1"}>
                    { !!images?.length && images.map(link => (
                        <div key={link} className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={link} alt="" className="rounded-lg"/>
                        </div>
                    ))}
                </ReactSortable>

                {isUploading && (
                    <div className={"h-24 flex items-center "}>
                        <Spinner/>
                    </div>
                )}
                <label
                    className={'w-24 h-24 border border-primary  text-center flex flex-col text-sm gap-1 text-primary rounded-sm bg-white shadow-sm items-center justify-center cursor-pointer'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                    </svg>
                    <div>
                        Add image
                    </div>
                    <input type="file" name='file' onChange={uploadImages} className={'hidden'}/>
                </label>
            </div>
            <label>Description</label>
            <textarea
                placeholder="description"
                value={description}
                onChange={ev => setDescription(ev.target.value)}
            />
            <label>Price (in USD)</label>
            <input
                type="number"
                placeholder="price"
                value={price}
                onChange={ev => setPrice(ev.target.value)}
            />
            <button type='submit' className="btn-primary">Save</button>
        </form>
    )
}