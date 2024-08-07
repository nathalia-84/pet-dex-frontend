import { Component } from 'pet-dex-utilities';
import './index.scss';

const events = ['active', 'deactive', 'title:change'];

const html = `
  <div class="pet-container" data-select="pet-container">
    <p class="pet-container__title" data-select="pet-title"> </p>
    <img class="pet-container__image" data-select="pet-image" src="" alt="">
  </div>
`;

export default function PetCard({ title, imgSrc, imgAlt }) {
  Component.call(this, { html, events });

  const petContainer = this.selected.get('pet-container');
  const petTitle = this.selected.get('pet-title');
  const petImage = this.selected.get('pet-image');

  petContainer.setAttribute('aria-label', title.toLowerCase());

  petContainer.addEventListener('click', () => {
    this.toggle();
  });

  petContainer.addEventListener('mouseenter', () => {
    if (petTitle.scrollHeight > petTitle.clientHeight) {
      petContainer.classList.add('pet-container__title--extended');
      petImage.style.marginBottom = `-${
        petTitle.scrollHeight - petTitle.clientHeight
      }px`;
    }
  });

  petContainer.addEventListener('mouseleave', () => {
    if (petContainer.classList.contains('pet-container__title--extended')) {
      const transitionEndHandler = () => {
        petContainer.classList.remove('pet-container__title--extended');
        petImage.removeEventListener('transitionend', transitionEndHandler);
      };

      petImage.addEventListener('transitionend', transitionEndHandler);
      petImage.style.marginBottom = '0px';
    }
  });

  if (title) this.setTitle(title);
  if (imgSrc) this.setImgSrc(imgSrc);
  if (imgAlt) this.setImgAlt(imgAlt);
}

PetCard.prototype = Object.assign(PetCard.prototype, Component.prototype, {
  getTitle() {
    return this.selected.get('pet-title').textContent;
  },
  setTitle(text) {
    this.selected.get('pet-title').textContent = text;
  },
  setImgSrc(src) {
    this.selected.get('pet-image').src = src;
  },
  setImgAlt(alt) {
    this.selected.get('pet-image').alt = alt;
  },
  isActive() {
    return this.selected
      .get('pet-container')
      .classList.contains('pet-container--active');
  },
  toggle() {
    if (this.isActive()) this.deactivate();
    else this.activate();
  },
  activate() {
    const petContainer = this.selected.get('pet-container');
    petContainer.classList.add('pet-container--active');
    this.emit('active');
  },
  deactivate() {
    const petContainer = this.selected.get('pet-container');
    petContainer.classList.remove('pet-container--active');
    this.emit('deactive');
  },
});
