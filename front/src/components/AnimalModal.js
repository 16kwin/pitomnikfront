// src/components/AnimalModal.js
import React from 'react';
import '../styles/AnimalModal.css';

const AnimalModal = ({ animal, onClose }) => {
  if (!animal) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>{animal.name}</h2>
        <p>Type: {animal.typeAnimal ? animal.typeAnimal.type : 'N/A'}</p>
        <p>Breed: {animal.breed ? animal.breed.breed : 'N/A'}</p>
        <p>Color: {animal.color ? animal.color.color : 'N/A'}</p>
        <p>Dimension: {animal.dimension ? animal.dimension.dimension : 'N/A'}</p>
        <p>Age: {animal.age ? animal.age : 'N/A'}</p>
        <p>Sex: {animal.sex ? 'Male' : 'Female'}</p>
        <p>Chip: {animal.chip ? animal.chip : 'N/A'}</p>
        <p>Height: {animal.height ? animal.height : 'N/A'}</p>
        <p>Weight: {animal.weight ? animal.weight : 'N/A'}</p>
        <p>Feature: {animal.feature ? animal.feature : 'N/A'}</p>
        <p>Date In: {animal.dateTimeIn ? animal.dateTimeIn : 'N/A'}</p>
        <p>Feature In: {animal.featureIn ? animal.featureIn : 'N/A'}</p>
        <p>Curator: {animal.curator ? animal.curator.name : 'N/A'}</p>
        <p>Volunteer: {animal.volunteer ? animal.volunteer.name : 'N/A'}</p>
      </div>
    </div>
  );
};

export default AnimalModal;