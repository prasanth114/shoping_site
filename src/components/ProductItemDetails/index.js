import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const fetchingApiStatus = {
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const ProductItemDetails = props => {
  const [productDetails, newProductDetails] = useState({})
  const [similarProductDetails, newSimilarProductDetails] = useState([])
  const [count, updateCount] = useState(1)
  const [apiStatus, updateApiStatus] = useState(fetchingApiStatus.inProgress)

  const {match} = props
  const {params} = match
  const {id} = params

  const getProductDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()

    const updatedProductDetails = {
      availability: data.availability,
      brand: data.brand,
      rating: data.rating,
      title: data.title,
      description: data.description,
      id: data.id,
      style: data.style,
      imageUrl: data.image_url,
      price: data.price,
      totalReviews: data.total_reviews,
    }
    const updateSimilarProducts = data.similar_products.map(eachProduct => ({
      availability: eachProduct.availability,
      brand: eachProduct.brand,
      rating: eachProduct.rating,
      title: eachProduct.title,
      description: eachProduct.description,
      id: eachProduct.id,
      style: eachProduct.style,
      imageUrl: eachProduct.image_url,
      price: eachProduct.price,
      totalReviews: eachProduct.total_reviews,
    }))
    if (response.ok === true) {
      newProductDetails(updatedProductDetails)
      newSimilarProductDetails(updateSimilarProducts)
      updateApiStatus(fetchingApiStatus.success)
    } else {
      updateApiStatus(fetchingApiStatus.failure)
    }
  }

  const renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  const renderProductDetails = () => {
    const {
      availability,
      brand,
      rating,
      title,
      description,
      imageUrl,
      price,
      totalReviews,
    } = productDetails

    const onDecrementQuantity = () => {
      if (count === 1) {
        updateCount(1)
      } else {
        updateCount(count - 1)
      }
    }

    const onIncrementQuantity = () => {
      updateCount(count + 1)
    }

    return (
      <div className="product-detail-container">
        <img src={imageUrl} alt="img" className="productImg" />
        <div className="product-description-container">
          <h1>{title}</h1>
          <p>Rs {price}/-</p>
          <div className="rating-reviews-container">
            <div className="rating-container">
              <p className="rating">{rating}</p>
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
                className="star"
              />
            </div>
            <p>{totalReviews} Reviews</p>
          </div>
          <p>{description}</p>
          <p>Available: {availability}</p>
          <p>Brand: {brand}</p>
          <hr />
          <div className="product-quantity-container">
            <button type="button" onClick={onDecrementQuantity}>
              -
            </button>
            <p>{count}</p>
            <button type="button" onClick={onIncrementQuantity}>
              +
            </button>
          </div>
          <button type="button">ADD TO CART</button>
        </div>
      </div>
    )
  }

  const renderSimilarProducts = () => (
    <div className="similar-products-container">
      <h1>Similar Products</h1>
      <ul className="similar-products-item-container">
        {similarProductDetails.map(eachItem => (
          <SimilarProductItem key={eachItem.id} SimilarProductData={eachItem} />
        ))}
      </ul>
    </div>
  )

  const renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png "
        alt="error view"
      />
    </div>
  )

  useEffect(() => {
    getProductDetails()
  })

  return (
    <>
      <Header />
      <div className="products-container">
        {apiStatus === fetchingApiStatus.inProgress && renderLoadingView()}
        {apiStatus === fetchingApiStatus.success && renderProductDetails()}
        {apiStatus === fetchingApiStatus.success && renderSimilarProducts()}
        {apiStatus === fetchingApiStatus.failure && renderFailureView()}
      </div>
    </>
  )
}

export default ProductItemDetails
