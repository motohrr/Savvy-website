import IMask from 'imask';
import JustValidate from 'just-validate';

const validator = new JustValidate('#contact-form');

validator
  .addField('#name', [
    {
      rule: 'required',
      errorMessage: 'El nombre es obligatorio'
    },
    {
      rule: 'minLength',
      value: 3,
      errorMessage: 'El nombre debe tener al menos 3 caracteres'
    }
  ])
  .addField('#email', [
    {
      rule: 'required',
      errorMessage: 'El correo es obligatorio'
    },
    {
      rule: 'email',
      errorMessage: 'Debe ser un correo válido'
    }
  ])
  .addField('#phone', [
    {
      rule: 'required',
      errorMessage: 'El teléfono es obligatorio'
    },
    {
      rule: 'minLength',
      value: 14,
      errorMessage: 'El teléfono debe tener al menos 14 caracteres'
    }
  ])
  .addField('#message', [
    {
      rule: 'required',
      errorMessage: 'El mensaje es obligatorio'
    },
    {
      rule: 'minLength',
      value: 5,
      errorMessage: 'El mensaje debe tener al menos 5 caracteres'
    }
  ]);

/* Input mask implementation */
const phoneInput = document.querySelector('.phone');
if (phoneInput) {
  IMask(phoneInput, {
    mask: '(000) 0000-0000'
  });
}

/* Observer */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  },
  {
    threshold: 0.1,
  }
);

const elements = document.querySelectorAll('.hidden-until-visible');
elements.forEach((el) => observer.observe(el));