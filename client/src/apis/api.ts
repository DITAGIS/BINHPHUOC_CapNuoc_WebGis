const SERVICE_URL = 'http://tanhoa.ditagis.com/api';

export default {
  demo: (attributes: any) => {
    return new Promise((resolve, reject) => {
      fetch(`${SERVICE_URL}`)
        .then(r => r.json())
        .then(d => resolve(d))
    });

  }
}