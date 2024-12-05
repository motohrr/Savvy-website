import IMask from 'imask';
import JustValidate from 'just-validate';
import Toastify from 'toastify-js';

/* Toastify setup */
const showToast = (message, type = 'success') => {
  Toastify({
    text: message,
    duration: 3000,
    gravity: 'top',
    position: 'right',
    backgroundColor: type === 'success' ? 'green' : 'red'
  }).showToast();
};

/* Validator for contact form */
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
  ])
  .onSuccess((event) => {
    event.preventDefault();

    const form = event.target;

    setTimeout(() => {
      showToast('Formulario enviado correctamente!');
      form.reset();
    }, 500);
  });

/* Validator for appointment form */
const validatorAppt = new JustValidate('#appt-form');
validatorAppt
  .addField('#appt-name', [
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
  .addField('#appt-email', [
    {
      rule: 'required',
      errorMessage: 'El correo es obligatorio'
    },
    {
      rule: 'email',
      errorMessage: 'Debe ser un correo válido'
    }
  ])
  .addField('#appt-phone', [
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
  .addField('#appt-message', [
    {
      rule: 'required',
      errorMessage: 'El mensaje es obligatorio'
    },
    {
      rule: 'minLength',
      value: 5,
      errorMessage: 'El mensaje debe tener al menos 5 caracteres'
    }
  ])
  .onSuccess((event) => {
    event.preventDefault();

    const form = event.target;

    setTimeout(() => {
      showToast('Solicitud enviada correctamente!');
      form.reset();
    }, 500);
  });

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
    threshold: 0.1
  }
);

const elements = document.querySelectorAll('.hidden-until-visible');
elements.forEach((el) => observer.observe(el));

// Event for "request-button"
const requestButton = document.querySelector('.request-button');
if (requestButton) {
  requestButton.addEventListener('click', () => {
    showToast('Solicitud enviada');
  });
}

// Event for "projects-request" button
const projectsRequestButton = document.getElementById('projects-request');
if (projectsRequestButton) {
  projectsRequestButton.addEventListener('click', () => {
    showToast('Ver más proyectos');
  });
}
