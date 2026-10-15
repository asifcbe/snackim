import React from 'react';
import SnackPack from './SnackPack';
import { mediaUrl } from '../utils/api';

// Product photo if one was uploaded, otherwise the illustrated on-brand pack.
const ProductVisual = ({ product, index = 0, className = '' }) => {
  const img = product.images?.[index] || (index === 0 ? product.image : null);
  if (img) return <img src={mediaUrl(img)} alt={product.name} className={`product-photo ${className}`} loading="lazy" />;
  return <SnackPack name={product.name} color={product.packColor} chipColor={product.chipColor} category={product.category} className={className} />;
};

export default ProductVisual;
